import { Bell, User, Cpu, LogOut, Zap, Menu } from 'lucide-react';
import { auth, logout } from '@/src/services/firebase';
import { cn } from '@/src/lib/utils';
import { Logo } from '../ui/Logo';

interface NavbarProps {
  activeNav: string;
  onNavChange: (nav: string) => void;
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeNav, onNavChange, onToggleSidebar }) => {
  const user = auth.currentUser;

  return (
    <header className="fixed top-0 left-0 right-0 h-12 bg-[#0d0f12] z-[150] px-4 md:px-6 flex items-center justify-between border-b border-white/5">
      <div className="flex items-center gap-4">
        <button 
          onClick={onToggleSidebar}
          className="p-1.5 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-colors"
        >
          <Menu size={20} />
        </button>
        
        <Logo 
          size={24} 
          className="cursor-pointer" 
          showText={true} 
        />
      </div>

      <div className="hidden md:flex gap-6 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
        {[
          { label: 'Terminal', key: 'Terminal' },
          { label: 'Market Scan', key: 'Deep Scan' },
          { label: 'Analysis', key: 'Analytics' },
          { label: 'Education', key: 'Academy' }
        ].map((item) => (
          <button 
            key={item.key} 
            onClick={() => onNavChange(item.key)}
            className={cn(
              "h-12 px-2 transition-all border-b-2 flex items-center",
              activeNav === item.key 
                ? "text-white border-brand-primary" 
                : "hover:text-white border-transparent hover:bg-white/[0.02]"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex px-2 py-0.5 bg-brand-primary/10 border border-brand-primary/20 rounded text-[9px] font-medium text-brand-primary uppercase tracking-wider">
          Market Data Connected
        </div>
        
        {user && (
          <div className="flex items-center gap-3 h-12">
            <div className="h-4 w-[1px] bg-white/10 mx-2 hidden sm:block" />
            
            <div className="group relative">
              <button 
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:border-brand-primary transition-all overflow-hidden"
              >
                {user.photoURL ? (
                  <img src={user.photoURL} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-white uppercase">
                    {user.displayName?.charAt(0) || 'A'}
                  </div>
                )}
              </button>

              <div className="absolute top-full right-0 mt-2 w-48 bg-[#16191e] rounded-lg border border-white/10 p-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-xl z-[200]">
                <div className="px-3 py-2 border-b border-white/5 mb-1">
                  <p className="text-[11px] font-bold text-white truncate">{user.displayName}</p>
                  <p className="text-[10px] text-slate-500">Trading Profile</p>
                </div>
                <button 
                  onClick={() => logout()}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-[11px] font-bold text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut size={14} />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
