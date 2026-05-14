import React from 'react';
import { BarChart3, TrendingUp, PieChart, Activity, Info, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const data = [
  { name: 'Mon', vol: 4000, sent: 2400 },
  { name: 'Tue', vol: 3000, sent: 1398 },
  { name: 'Wed', vol: 2000, sent: 9800 },
  { name: 'Thu', vol: 2780, sent: 3908 },
  { name: 'Fri', vol: 1890, sent: 4800 },
  { name: 'Sat', vol: 2390, sent: 3800 },
  { name: 'Sun', vol: 3490, sent: 4300 },
];

export const Analytics: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-white tracking-tight">Market Analytics</h2>
          <p className="text-sm text-slate-500">Cross-asset correlations and volatility indices.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 glass rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Fear & Greed</span>
            <PieChart size={16} className="text-brand-primary" />
          </div>
          <div className="flex flex-col items-center py-4">
            <div className="text-4xl font-display font-black text-white">74</div>
            <p className="text-xs font-bold text-emerald-400 mt-2 uppercase tracking-widest">Greed</p>
          </div>
          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-rose-500 via-emerald-400 to-brand-primary w-[74%]" />
          </div>
        </div>

        <div className="p-6 glass rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Volatility Index</span>
            <Activity size={16} className="text-brand-primary" />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-display font-bold text-white">2.41%</span>
            <span className="text-xs text-rose-400 mb-1 flex items-center"><ArrowUpRight size={12} /> High</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-relaxed uppercase tracking-widest">Expected price swing range for 24H</p>
        </div>

        <div className="p-6 glass rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Net Flow</span>
            <TrendingUp size={16} className="text-emerald-500" />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-display font-bold text-white">+$840M</span>
            <span className="text-xs text-emerald-400 mb-1 flex items-center"><ArrowUpRight size={12} /> Inflow</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-relaxed uppercase tracking-widest">BTC Exchange Netflow (24H)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-[400px] glass rounded-3xl p-6">
          <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">Volume Distribution</h3>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorVol" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                itemStyle={{ fontSize: '12px' }}
              />
              <Area type="monotone" dataKey="vol" stroke="#3b82f6" fillOpacity={1} fill="url(#colorVol)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="h-[400px] glass rounded-3xl p-6">
          <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">Market Sentiment Score</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                itemStyle={{ fontSize: '12px' }}
              />
              <Bar dataKey="sent" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
