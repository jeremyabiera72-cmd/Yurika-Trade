import React, { useState, useEffect } from 'react';
import { marketService } from '@/src/services/marketData';
import { cn } from '@/src/lib/utils';
import { BarChart3, Globe } from 'lucide-react';

interface MarketBarProps {
  activeSymbol: string;
  onSymbolChange: (symbol: string) => void;
  onOpenSelector: () => void;
}

export const MarketBar: React.FC<MarketBarProps> = ({ 
  activeSymbol, 
  onSymbolChange, 
  onOpenSelector 
}) => {
  const [tickerPrices, setTickerPrices] = useState<Record<string, string>>({});
  const [tickerChanges, setTickerChanges] = useState<Record<string, string>>({});

  useEffect(() => {
    const unsubscribe = marketService.subscribeTickers((update) => {
      setTickerPrices(prev => ({ ...prev, [update.symbol]: update.price }));
      setTickerChanges(prev => ({ ...prev, [update.symbol]: update.change }));
    });
    return () => { unsubscribe(); };
  }, []);

  const items = [
    { s: 'BTC/USDT', full: 'BTCUSDT' },
    { s: 'ETH/USDT', full: 'ETHUSDT' },
    { s: 'SOL/USDT', full: 'SOLUSDT' },
    { s: 'USD/JPY', full: 'USDTJPY' },
    { s: 'GOLD', full: 'PAXGUSDT' },
    { s: 'EUR/USDT', full: 'EURUSDT' },
    { s: 'BNB/USDT', full: 'BNBUSDT' },
    { s: 'DOT/USDT', full: 'DOTUSDT' },
    { s: 'LINK/USDT', full: 'LINKUSDT' },
    { s: 'ADA/USDT', full: 'ADAUSDT' },
    { s: 'MATIC/USDT', full: 'MATICUSDT' },
    { s: 'AVAX/USDT', full: 'AVAXUSDT' }
  ];

  return (
    <div className="flex gap-2 md:gap-4 items-center">
      <div className="h-14 md:h-16 glass rounded-2xl flex items-center px-4 md:px-6 gap-4 md:gap-8 overflow-x-auto no-scrollbar relative flex-grow scroll-smooth">
        {items.map((item) => {
          const price = tickerPrices[item.full] || '...';
          const change = tickerChanges[item.full] || '...';
          return (
            <button 
              key={item.s}
              onClick={() => onSymbolChange(item.s)}
              className={cn(
                "flex items-center gap-3 md:gap-4 flex-shrink-0 transition-all hover:scale-105 py-1",
                activeSymbol === item.s ? "opacity-100 scale-105" : "opacity-40 hover:opacity-80"
              )}
            >
              <div className="flex flex-col items-start leading-none gap-1">
                <span className="text-[9px] md:text-[10px] font-bold text-white uppercase tracking-tighter">{item.s}</span>
                <span className={cn(
                  "text-[9px] md:text-[10px] font-bold transition-colors duration-300",
                  price === '...' ? "text-slate-600" : "text-slate-400"
                )}>{price}</span>
              </div>
              <span className={cn("text-[9px] md:text-[10px] font-bold", change !== '...' && change.startsWith('+') ? "text-emerald-500" : "text-rose-500")}>
                {change}
              </span>
            </button>
          );
        })}
      </div>
      <button 
        onClick={onOpenSelector}
        className="h-14 w-14 md:h-16 md:w-16 glass rounded-2xl flex flex-col items-center justify-center gap-0.5 md:gap-1 hover:bg-brand-primary/20 transition-all group flex-shrink-0 shrink-0"
      >
        <BarChart3 size={18} className="text-brand-primary group-hover:scale-110 transition-transform" />
        <span className="text-[7px] md:text-[8px] font-bold text-white uppercase">Explorer</span>
      </button>
      
      <div className="ml-auto flex items-center gap-2 flex-shrink-0 lg:flex hidden px-4">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Live Exchange Status</span>
      </div>
    </div>
  );
};
