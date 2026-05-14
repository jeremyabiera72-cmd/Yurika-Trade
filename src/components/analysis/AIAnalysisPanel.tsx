import React from 'react';
import { ShieldCheck, Info, TrendingUp, TrendingDown, Minus, Eye, Zap, BookOpen, Target, Activity, AlertTriangle } from 'lucide-react';
import { MarketOutlook } from '@/src/types';
import { AIAnalysisResult } from '@/src/services/geminiService';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { cn } from '@/src/lib/utils';

interface AIAnalysisPanelProps {
  result: AIAnalysisResult | null;
  isLoading: boolean;
}

export const AIAnalysisPanel: React.FC<AIAnalysisPanelProps> = ({ result, isLoading }) => {
  const getOutlookStyles = (outlook: MarketOutlook) => {
    switch (outlook) {
      case 'bullish': return { 
        icon: TrendingUp, 
        color: 'text-emerald-400', 
        bg: 'bg-emerald-400/10', 
        border: 'border-emerald-400/20',
        label: 'Bullish',
        desc: 'Buyer Dominance'
      };
      case 'bearish': return { 
        icon: TrendingDown, 
        color: 'text-rose-400', 
        bg: 'bg-rose-400/10', 
        border: 'border-rose-400/20',
        label: 'Bearish',
        desc: 'Seller Pressure'
      };
      default: return { 
        icon: Minus, 
        color: 'text-amber-400', 
        bg: 'bg-amber-400/10', 
        border: 'border-amber-400/20',
        label: 'Neutral',
        desc: 'Market Indecision'
      };
    }
  };

  if (!result && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center h-full bg-[#0d0f12] border border-white/5 rounded-xl overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.03)_0,transparent_70%)]" />
        <div className="relative z-10 space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center justify-center mx-auto mb-6 group transition-all duration-500 hover:border-brand-primary/30">
            <BookOpen className="w-6 h-6 text-slate-700 group-hover:text-brand-primary transition-colors" />
          </div>
          <h3 className="text-sm font-bold text-white uppercase tracking-[0.3em] italic">Intelligence Engine</h3>
          <p className="text-slate-500 text-[10px] uppercase tracking-widest max-w-[220px] mx-auto leading-relaxed">
            Initialize technical scan to generate institutional-grade insights.
          </p>
        </div>
      </div>
    );
  }

  const sentimentData = result ? [
    { name: 'Confidence', value: result.confidence },
    { name: 'Remaining', value: 100 - result.confidence },
  ] : [];

  const confidenceColor = result ? (result.confidence > 75 ? '#10b981' : result.confidence > 50 ? '#3b82f6' : '#f59e0b') : '#3b82f6';

  return (
    <div className="flex flex-col h-full bg-[#0d0f12] border border-white/5 rounded-xl overflow-hidden shadow-2xl">
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-[#0a0b0d]/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-lg bg-brand-primary/10 flex items-center justify-center">
            <Zap className="text-brand-primary" size={12} />
          </div>
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white italic">Protocol Analysis</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">System Active</span>
        </div>
      </div>

      {isLoading ? (
        <div className="flex-grow flex flex-col items-center justify-center p-8 space-y-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0,transparent_100%)]" />
          <div className="relative group">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="w-24 h-24 border border-brand-primary/20 border-t-brand-primary rounded-full relative"
            />
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-2 border border-brand-secondary/20 border-b-brand-secondary rounded-full"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Activity className="text-brand-primary/50 animate-pulse" size={24} />
            </div>
          </div>
          <div className="text-center relative z-10">
            <p className="font-display font-bold text-white text-sm mb-2 tracking-tight uppercase italic">Synthesizing Data</p>
            <div className="flex gap-1 justify-center">
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                  className="w-1 h-1 rounded-full bg-brand-primary"
                />
              ))}
            </div>
          </div>
        </div>
      ) : result && (
        <AnimatePresence mode="wait">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-grow overflow-y-auto no-scrollbar p-4 sm:p-5 space-y-6 sm:space-y-8"
          >
            {/* Outlook Hero Section */}
            <div className="relative group">
              <div className={cn(
                "p-6 rounded-2xl border bg-gradient-to-br transition-all duration-500",
                getOutlookStyles(result.outlook).bg,
                getOutlookStyles(result.outlook).border,
                "from-white/[0.02] shadow-xl"
              )}>
                <div className="flex justify-between items-center mb-8">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                       <span className={cn("text-[9px] font-bold uppercase tracking-[0.2em]", getOutlookStyles(result.outlook).color)}>
                        {getOutlookStyles(result.outlook).desc}
                       </span>
                    </div>
                    <h2 className={cn("text-2xl sm:text-3xl font-display font-black tracking-tighter italic leading-none", getOutlookStyles(result.outlook).color)}>
                      {result.outlook.toUpperCase()}
                    </h2>
                  </div>
                  
                  <div className="h-16 w-16 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={sentimentData}
                          innerRadius="70%"
                          outerRadius="100%"
                          paddingAngle={0}
                          dataKey="value"
                          startAngle={90}
                          endAngle={-270}
                          stroke="none"
                        >
                          <Cell fill={confidenceColor} />
                          <Cell fill="rgba(255,255,255,0.05)" />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
                      <span className="text-[10px] font-bold text-white">{result.confidence}%</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between text-[8px] font-bold text-slate-500 uppercase tracking-widest">
                    <span>Scan Confidence</span>
                    <span className="text-white">{result.confidence}/100</span>
                  </div>
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${result.confidence}%` }}
                      transition={{ duration: 1.5, ease: "circOut" }}
                      className={cn("h-full", getOutlookStyles(result.outlook).color.replace('text-', 'bg-'))}
                    />
                  </div>
                </div>
              </div>
              
              {/* Decorative side accent */}
              <div className={cn("absolute -left-[5px] top-8 bottom-8 w-1 rounded-full", getOutlookStyles(result.outlook).color.replace('text-', 'bg-'))} />
            </div>

            {/* Key Levels Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Target size={12} className="text-brand-primary" />
                  Key Levels
                </h4>
                <span className="text-[8px] font-bold text-slate-600 uppercase tracking-[0.2em]">Validated Price Points</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/10 space-y-1">
                  <p className="text-[9px] font-bold text-rose-400/60 uppercase tracking-widest">Major Resistance</p>
                  <p className="text-sm font-display font-bold text-white tracking-tight">{result.keyLevels.resistance[0] || 'N/A'}</p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 space-y-1">
                  <p className="text-[9px] font-bold text-emerald-400/60 uppercase tracking-widest">Support Zone</p>
                  <p className="text-sm font-display font-bold text-white tracking-tight">{result.keyLevels.support[0] || 'N/A'}</p>
                </div>
              </div>

              {/* Levels Visualization */}
              <div className="relative py-2 space-y-4">
                <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <div className="flex justify-between items-center px-4 relative">
                   <div className="absolute left-1/2 -top-4 -translate-x-1/2 flex flex-col items-center">
                    <div className="w-1 h-3 bg-white/20 rounded-full mb-1" />
                    <span className="text-[8px] font-bold text-slate-600 uppercase">Mid Range</span>
                   </div>
                   
                   <div className="flex flex-col items-center gap-1">
                    <div className="p-1 px-2 rounded-md bg-rose-500/20 text-rose-400 text-[8px] font-bold border border-rose-500/30">MAX SELL</div>
                   </div>
                   <div className="flex flex-col items-center gap-1">
                    <div className="p-1 px-2 rounded-md bg-emerald-500/20 text-emerald-400 text-[8px] font-bold border border-emerald-500/30">MAX BUY</div>
                   </div>
                </div>
              </div>
            </div>

            {/* Insight Analysis */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <Activity size={12} className="text-brand-secondary" />
                Structural Insight
              </h4>
              <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.01] border border-white/5 relative group overflow-hidden">
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-brand-primary/5 rounded-full blur-2xl group-hover:bg-brand-primary/10 transition-colors" />
                <div className="text-[11px] text-slate-400 leading-relaxed font-sans opacity-95 relative z-10 selection:bg-brand-primary/30">
                  <div className="prose prose-invert prose-xs max-w-none">
                    <ReactMarkdown>
                      {result.insight}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>

            {/* Pattern Detection */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <Eye size={12} className="text-indigo-400" />
                Patterns Detected
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.patterns.length > 0 ? result.patterns.map((p, i) => (
                  <motion.span 
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    className="px-3 py-1.5 rounded-lg bg-[#14161a] border border-white/5 text-[9px] font-bold text-slate-300 uppercase tracking-widest shadow-lg flex items-center gap-2"
                  >
                    <div className="w-1 h-1 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                    {p}
                  </motion.span>
                )) : (
                  <span className="text-[9px] text-slate-600 italic">No major patterns identified in current scan.</span>
                )}
              </div>
            </div>

            {/* Risk Warning Disclaimer */}
            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 flex gap-3 items-start">
               <AlertTriangle size={14} className="text-amber-500 shrink-0 mt-0.5" />
               <p className="text-[9px] text-amber-500/70 font-medium leading-relaxed italic">
                 Analysis generated via neural heuristics. Protocols do not constitute financial advice. Exercise operational caution in active markets.
               </p>
            </div>

            {/* Footer Padding */}
            <div className="h-4" />
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

