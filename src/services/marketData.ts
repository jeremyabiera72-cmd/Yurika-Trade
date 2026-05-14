import { MarketData } from "@/src/types";

export class MarketDataService {
  private static instance: MarketDataService;
  private ws: WebSocket | null = null;
  private subscribers: Set<(data: any) => void> = new Set();
  private symbol: string = 'btcusdt';

  private constructor() {}

  static getInstance(): MarketDataService {
    if (!MarketDataService.instance) {
      MarketDataService.instance = new MarketDataService();
    }
    return MarketDataService.instance;
  }

  async fetchHistory(symbol: string = 'BTCUSDT', interval: string = '1h'): Promise<MarketData[]> {
    const formattedSymbol = symbol.toUpperCase().replace('/', '');
    const binanceInterval = interval.toLowerCase().replace('1h', '1h').replace('1d', '1d').replace('4h', '4h').replace('15m', '15m').replace('5m', '5m').replace('1m', '1m');
    
    try {
      const response = await fetch(`https://api.binance.com/api/v3/klines?symbol=${formattedSymbol}&interval=${binanceInterval}&limit=150`);
      const data = await response.json();
      return data.map((d: any) => ({
        time: d[0] / 1000,
        open: parseFloat(d[1]),
        high: parseFloat(d[2]),
        low: parseFloat(d[3]),
        close: parseFloat(d[4]),
        volume: parseFloat(d[5])
      }));
    } catch (error) {
      console.error('Failed to fetch history:', error);
      return [];
    }
  }

  private tickerSubscribers: Set<(data: any) => void> = new Set();
  
  connect(symbol: string = 'btcusdt', interval: string = '1m') {
    if (this.ws) {
      this.ws.close();
    }
    
    // Proper Binance mapping
    const aliasMap: Record<string, string> = {
      'GOLD': 'PAXGUSDT', 
      'GOLD/USDT': 'PAXGUSDT',
      'WTI OIL': 'BTCUSDT', // Placeholder as Binance doesn't have OIL spot
      'EUR/USDT': 'EURUSDT',
      'GBP/USDT': 'GBPUSDT',
      'AUD/USDT': 'AUDUSDT',
      'USD/JPY': 'USDTJPY'
    };

    const cleanSymbol = symbol.toUpperCase().trim();
    this.symbol = (aliasMap[cleanSymbol] || cleanSymbol.replace('/', '')).toLowerCase();
    
    // Multi-stream support - include all relevant symbols from UI
    const tickerPairs = [
      'btcusdt', 'ethusdt', 'solusdt', 'dotusdt', 'linkusdt', 
      'adausdt', 'maticusdt', 'avaxusdt', 'dogeusdt', 'shibusdt', 
      'xrpusdt', 'ltcusdt', 'eurusdt', 'gbpusdt', 'audusdt', 
      'usdtjpy', 'paxgusdt', 'btcusd', 'ethusd', 'bnbusdt',
      'uniusdt', 'atomusdt', 'xlmusdt', 'algousdt', 'bchusdt',
      'usdcadusdt', 'usdchfusdt', 'nzdusdt', 'vetchainusdt'
    ];
    
    const binanceInterval = interval.toLowerCase();
    const streamSet = new Set([
      `${this.symbol}@kline_${binanceInterval}`,
      `${this.symbol}@ticker`, // Ensure active symbol always has ticker stream
      ...tickerPairs.map(p => `${p}@ticker`)
    ]);
    
    const streams = Array.from(streamSet).join('/');

    console.log(`Connecting to Binance WebSocket: ${streams}`);
    this.ws = new WebSocket(`wss://stream.binance.com:9443/ws/${streams}`);

    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        
        // Handle Kline data for the ACTIVE symbol
        if (message.e === 'kline' && message.s.toLowerCase() === this.symbol) {
          const kline = message.k;
          const data: MarketData = {
            time: kline.t / 1000,
            open: parseFloat(kline.o),
            high: parseFloat(kline.h),
            low: parseFloat(kline.l),
            close: parseFloat(kline.c),
            volume: parseFloat(kline.v)
          };
          this.subscribers.forEach(cb => cb(data));
        }

        // Handle Ticker data
        if (message.e === '24hrTicker') {
          const priceRaw = parseFloat(message.c);
          const tickerData = {
            symbol: message.s,
            price: priceRaw.toLocaleString(undefined, { 
              minimumFractionDigits: priceRaw < 0.001 ? 6 : (priceRaw < 1 ? 4 : 2),
              maximumFractionDigits: priceRaw < 0.001 ? 8 : (priceRaw < 1 ? 4 : 2)
            }),
            change: (parseFloat(message.P) >= 0 ? '+' : '') + parseFloat(message.P).toFixed(2) + '%'
          };
          this.tickerSubscribers.forEach(cb => cb(tickerData));
        }
      } catch (err) {
        console.error("WS Parse Error", err);
      }
    };

    this.ws.onerror = (err) => {
      console.error('WebSocket Error:', err);
    };

    this.ws.onclose = (e) => {
      console.log('WebSocket Closed', e.reason);
      // Auto-reconnect after 3 seconds if not intentionally closed
      if (e.code !== 1000) {
        setTimeout(() => this.connect(symbol, interval), 3000);
      }
    };
  }

  subscribe(callback: (data: any) => void) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  subscribeTickers(callback: (data: any) => void) {
    this.tickerSubscribers.add(callback);
    return () => this.tickerSubscribers.delete(callback);
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const marketService = MarketDataService.getInstance();
