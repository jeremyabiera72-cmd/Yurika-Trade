import React, { useState, useEffect } from 'react';
import { Zap, Target, Layers, Activity, TrendingUp, ChevronRight, BarChart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { marketService } from '@/src/services/marketData';

const pairs = [
  { symbol: 'BTC/USD', price: '64,240.50', change: '+2.4%', status: 'Stable' },
  { symbol: 'ETH/USD', price: '3,450.20', change: '+1.8%', status: 'Bullish' },
  { symbol: 'BNB/USD', price: '584.20', change: '+0.5%', status: 'Strong' },
  { symbol: 'SOL/USD', price: '145.60', change: '-0.5%', status: 'Consolidation' },
  { symbol: 'USD/JPY', price: '155.40', change: '-0.15%', status: 'Stable' },
  { symbol: 'EUR/USD', price: '1.0845', change: '+0.12%', status: 'Range' },
  { symbol: 'GBP/USD', price: '1.2650', change: '+0.05%', status: 'Stable' },
  { symbol: 'XAU/USD', price: '2,345.10', change: '+0.85%', status: 'Breakout' },
  { symbol: 'NDX/USD', price: '18,240.00', change: '+1.2%', status: 'Strong Bullish' },
  { symbol: 'SPX/USD', price: '5,240.50', change: '+0.4%', status: 'Stable' },
];

interface DeepScanProps {
  sensitivity: number;
}

export const DeepScan: React.FC<DeepScanProps> = ({ sensitivity }) => {
  const [scanning, setScanning] = useState<string | null>(null);
  const [scanResults, setScanResults] = useState<Record<string, {bias: string, conf: number}>>({});

  const startScan = (symbol: string) => {
    setScanning(symbol);
    setTimeout(() => {
      setScanning(null);
      setScanResults(prev => ({
        ...prev,
        [symbol]: {
          bias: Math.random() > 0.5 ? 'BULLISH' : 'BEARISH',
          conf: Math.floor(Math.random() * (98 - sensitivity) + sensitivity)
        }
      }));
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-brand-primary shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Scanner Active</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight italic">Market Intelligence Scan</h2>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest">Order Flow & Liquidity Cycle Analysis</p>
        </div>
        <div className="flex gap-3">
          <div className="px-3 py-1.5 bg-white/5 border border-white/10 rounded flex items-center gap-3">
            <Target className="text-brand-primary" size={14} />
            <div className="flex flex-col">
              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-1 leading-none">Filter</span>
              <span className="text-[10px] font-bold text-white uppercase tracking-widest leading-none">{sensitivity}% Target</span>
            </div>
          </div>
          <div className="px-3 py-1.5 bg-brand-primary/10 border border-brand-primary/20 rounded flex items-center gap-3">
            <Zap className="text-brand-primary" size={14} />
            <div className="flex flex-col">
              <span className="text-[8px] font-bold text-brand-primary uppercase tracking-widest mb-1 leading-none">Engine</span>
              <span className="text-[10px] font-bold text-white uppercase tracking-widest leading-none">Analysis v2.4</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3 space-y-2">
          <div className="grid grid-cols-12 px-6 py-2 text-[9px] font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 hidden md:grid">
            <div className="col-span-4">Asset Identifier</div>
            <div className="col-span-3">Market Vitals</div>
            <div className="col-span-3">Scan Status</div>
            <div className="col-span-2 text-right">Action</div>
          </div>
          
          {pairs.map((pair) => {
            const price = pair.price;
            const change = pair.change;
            return (
              <div key={pair.symbol} className="bg-[#16191e]/40 border border-white/5 p-4 md:p-3 rounded-lg group hover:border-brand-primary/30 transition-all grid grid-cols-1 md:grid-cols-12 items-center gap-4 relative overflow-hidden">
                {scanning === pair.symbol && (
                  <motion.div 
                    initial={{ left: "-100%" }}
                    animate={{ left: "100%" }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-y-0 w-32 bg-gradient-to-r from-transparent via-brand-primary/5 to-transparent pointer-events-none"
                  />
                )}
                
                <div className="md:col-span-4 flex items-center gap-4">
                  <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-[10px] font-bold text-slate-400 border border-white/5">
                    {pair.symbol.split('/')[0]}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-tight">{pair.symbol}</h4>
                    <p className="text-[9px] text-slate-500 uppercase tracking-wider">Institutional Feed</p>
                  </div>
                </div>

                <div className="md:col-span-3">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-medium text-slate-300">{price}</span>
                    <span className={cn("text-[9px] font-bold", change.startsWith('+') ? "text-emerald-500" : "text-rose-500")}>
                      {change}
                    </span>
                  </div>
                </div>

                <div className="md:col-span-3">
                  {scanResults[pair.symbol] && !scanning ? (
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider",
                        scanResults[pair.symbol].bias === 'BULLISH' ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                      )}>
                        {scanResults[pair.symbol].bias}
                      </div>
                      <span className="text-[9px] text-slate-400">{scanResults[pair.symbol].conf}% Confidence</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                       <span className="text-[9px] text-slate-500 uppercase">
                         {scanning === pair.symbol ? 'Analyzing Streams...' : pair.status}
                       </span>
                    </div>
                  )}
                </div>

                <div className="md:col-span-2 text-right">
                  <button 
                    onClick={() => startScan(pair.symbol)}
                    disabled={scanning !== null}
                    className="w-full md:w-auto px-4 py-1.5 bg-white/5 hover:bg-brand-primary/20 text-slate-400 hover:text-white rounded text-[10px] font-bold transition-all border border-white/10 disabled:opacity-30"
                  >
                    {scanning === pair.symbol ? 'Loading...' : 'Deep Scan'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="space-y-6">
          <div className="p-5 glass rounded-lg border-l-2 border-l-brand-primary">
            <h3 className="text-[10px] font-bold text-slate-400 mb-4 flex items-center gap-2 uppercase tracking-wider">
              <Layers size={14} />
              Market Statistics
            </h3>
            <div className="space-y-4">
              <div className="p-3 bg-white/[0.02] border border-white/5 rounded">
                <p className="text-[9px] font-bold text-slate-500 uppercase mb-1 tracking-widest">Liquidity Analysis</p>
                <p className="text-[10px] text-slate-400 leading-relaxed">Major supply cluster identified at $62.4k. Institutional accumulation phase confirmed.</p>
              </div>
              <div className="p-3 bg-white/[0.02] border border-white/5 rounded">
                <p className="text-[9px] font-bold text-slate-500 uppercase mb-1 tracking-widest">Price Imbalance</p>
                <p className="text-[10px] text-slate-400 leading-relaxed">Structural inefficiency detected on medium-term timeframes. Target: $66.2k.</p>
              </div>
            </div>
          </div>

          <div className="p-5 glass rounded-lg">
            <h3 className="text-[10px] font-bold text-slate-400 mb-4 flex items-center gap-2 uppercase tracking-wider">
              <Activity size={14} />
              Volatility Distribution
            </h3>
            <div className="grid grid-cols-4 gap-1.5">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className={cn(
                  "h-6 rounded-sm opacity-30 hover:opacity-100 transition-opacity cursor-pointer border border-white/5",
                  Math.random() > 0.5 ? "bg-emerald-500/40" : "bg-rose-500/40"
                )} />
              ))}
            </div>
            <div className="flex justify-between mt-3 px-1 text-[8px] text-slate-500 uppercase tracking-widest">
              <span>Resistance</span>
              <span>Support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
