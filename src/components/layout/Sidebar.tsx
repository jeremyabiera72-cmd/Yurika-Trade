import { LayoutDashboard, TrendingUp, BookOpen, Settings, BarChart3, Zap, Globe } from 'lucide-react';
import { cn } from '@/src/lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Terminal' },
  { icon: Zap, label: 'Deep Scan' },
  { icon: Globe, label: 'Analytics' },
  { icon: BookOpen, label: 'Academy' },
  { icon: Settings, label: 'Core Config' },
];

interface SidebarProps {
  activeNav: string;
  onNavChange: (label: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeNav, onNavChange }) => {
  return (
    <aside className="w-full h-full flex flex-col py-8 bg-[#0d0f12] border-r border-white/5">
      <div className="px-6 mb-10">
        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.1em] mb-4">Operations</p>
      </div>

      <nav className="flex-grow px-4 space-y-1.5">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => onNavChange(item.label)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group text-sm font-medium",
              activeNav === item.label
                ? "bg-brand-primary/10 text-white border border-brand-primary/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]" 
                : "text-slate-400 hover:text-slate-100 hover:bg-white/[0.03] border border-transparent"
            )}
          >
            <item.icon 
              size={18} 
              className={cn(
                "transition-colors",
                activeNav === item.label ? "text-brand-primary" : "text-slate-500 group-hover:text-slate-300"
              )} 
            />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="px-6 py-6 border-t border-white/5">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <span className="text-[10px] text-slate-500 font-medium">Market Connectivity: High</span>
        </div>
        <p className="text-[10px] text-slate-600 italic">
          Yurika v2.4.9 Stable
        </p>
      </div>
    </aside>
  );
};
