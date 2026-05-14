import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { marketService } from '@/src/services/marketData';
import { cn } from '@/src/lib/utils';
import { Globe } from 'lucide-react';

interface MarketExplorerProps {
  isOpen: boolean;
  onClose: () => void;
  activeSymbol: string;
  onSelect: (symbol: string) => void;
}

export const MarketExplorer: React.FC<MarketExplorerProps> = ({ 
  isOpen, 
  onClose, 
  activeSymbol, 
  onSelect 
}) => {
  const [tickerPrices, setTickerPrices] = useState<Record<string, string>>({});
  const [tickerChanges, setTickerChanges] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isOpen) return;
    const unsubscribe = marketService.subscribeTickers((update) => {
      setTickerPrices(prev => ({ ...prev, [update.symbol]: update.price }));
      setTickerChanges(prev => ({ ...prev, [update.symbol]: update.change }));
    });
    return () => { unsubscribe(); };
  }, [isOpen]);

  if (!isOpen) return null;

  const markets = [
    { s: 'BTC/USDT', full: 'BTCUSDT', cat: 'Crypto' },
    { s: 'ETH/USDT', full: 'ETHUSDT', cat: 'Crypto' },
    { s: 'BNB/USDT', full: 'BNBUSDT', cat: 'Crypto' },
    { s: 'SOL/USDT', full: 'SOLUSDT', cat: 'Crypto' },
    { s: 'XRP/USDT', full: 'XRPUSDT', cat: 'Crypto' },
    { s: 'ADA/USDT', full: 'ADAUSDT', cat: 'Crypto' },
    { s: 'DOT/USDT', full: 'DOTUSDT', cat: 'Crypto' },
    { s: 'MATIC/USDT', full: 'MATICUSDT', cat: 'Crypto' },
    { s: 'AVAX/USDT', full: 'AVAXUSDT', cat: 'Crypto' },
    { s: 'LINK/USDT', full: 'LINKUSDT', cat: 'Crypto' },
    { s: 'UNI/USDT', full: 'UNIUSDT', cat: 'Crypto' },
    { s: 'ATOM/USDT', full: 'ATOMUSDT', cat: 'Crypto' },
    { s: 'LTC/USDT', full: 'LTCUSDT', cat: 'Crypto' },
    { s: 'BCH/USDT', full: 'BCHUSDT', cat: 'Crypto' },
    { s: 'ALGO/USDT', full: 'ALGOUSDT', cat: 'Crypto' },
    { s: 'XLM/USDT', full: 'XLMUSDT', cat: 'Crypto' },
    { s: 'DOGE/USDT', full: 'DOGEUSDT', cat: 'Meme' },
    { s: 'SHIB/USDT', full: 'SHIBUSDT', cat: 'Meme' },
    { s: 'PEPE/USDT', full: 'PEPEUSDT', cat: 'Meme' },
    { s: 'EUR/USDT', full: 'EURUSDT', cat: 'Forex' },
    { s: 'GBP/USDT', full: 'GBPUSDT', cat: 'Forex' },
    { s: 'AUD/USDT', full: 'AUDUSDT', cat: 'Forex' },
    { s: 'USD/JPY', full: 'USDTJPY', cat: 'Forex' },
    { s: 'USD/CAD', full: 'USDCADUSDT', cat: 'Forex' },
    { s: 'USD/CHF', full: 'USDCHFUSDT', cat: 'Forex' },
    { s: 'NZD/USD', full: 'NZDUSDT', cat: 'Forex' },
    { s: 'GOLD', full: 'PAXGUSDT', cat: 'Commodity' },
    { s: 'WTI OIL', full: 'WTI', cat: 'Commodity', mock: true, price: '78.42', change: '+0.4%' },
    { s: 'SILVER', full: 'XAGUSDT', cat: 'Commodity', mock: true, price: '28.15', change: '-0.2%' },
    { s: 'S&P 500', full: 'SPX', cat: 'Index', mock: true, price: '5,221.4', change: '+0.8%' },
    { s: 'NASDAQ', full: 'NDX', cat: 'Index', mock: true, price: '18,335', change: '+1.1%' },
    { s: 'DOW JONES', full: 'DJI', cat: 'Index', mock: true, price: '39,127', change: '+0.5%' },
    { s: 'APPLE', full: 'AAPL', cat: 'Stock', mock: true, price: '189.45', change: '+1.2%' },
    { s: 'TESLA', full: 'TSLA', cat: 'Stock', mock: true, price: '174.60', change: '-2.1%' },
    { s: 'NVIDIA', full: 'NVDA', cat: 'Stock', mock: true, price: '945.30', change: '+3.4%' }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-4xl glass rounded-[32px] p-8 relative z-10 overflow-hidden shadow-2xl border border-white/10"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-display font-bold text-white tracking-tight">Market Explorer</h2>
            <p className="text-sm text-slate-500">Select an asset to load real-time technical data.</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors text-white"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 max-h-[60vh] overflow-y-auto pr-2 no-scrollbar">
          {markets.map((item) => {
            const price = item.mock ? item.price : (tickerPrices[item.full] || '...');
            const change = item.mock ? item.change : (tickerChanges[item.full] || '-');
            return (
              <button
                key={item.s}
                onClick={() => {
                  onSelect(item.s);
                  onClose();
                }}
                className={cn(
                  "p-3 md:p-4 glass rounded-xl md:rounded-2xl text-left transition-all hover:scale-[1.02] hover:bg-white/10 group h-full flex flex-col justify-between min-h-[90px] md:min-h-0",
                  activeSymbol === item.s && "border-brand-primary bg-brand-primary/10 shadow-[0_0_20px_rgba(147,51,234,0.15)]"
                )}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5 md:mb-2">
                    <span className="text-[8px] md:text-[10px] font-bold text-brand-primary uppercase tracking-widest">{item.cat}</span>
                    <Globe size={10} className="md:w-3 md:h-3 text-slate-700" />
                  </div>
                  <p className="text-xs md:text-sm font-bold text-white group-hover:text-brand-secondary transition-colors line-clamp-1">{item.s}</p>
                </div>
                <div className="mt-2 md:mt-3 flex items-center justify-between">
                  <span className={cn(
                    "text-[9px] md:text-[10px] font-bold transition-colors duration-300",
                    price === '...' ? "text-slate-700" : "text-slate-400"
                  )}>{price}</span>
                  <span className={cn(
                    "text-[9px] md:text-[10px] font-bold",
                    change.startsWith('+') ? "text-emerald-500" : "text-rose-500"
                  )}>
                    {change}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Feed API Status: Online</span>
            </div>
            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-wider italic">Real-time quotes provided by global providers.</p>
        </div>
      </motion.div>
    </div>
  );
};
