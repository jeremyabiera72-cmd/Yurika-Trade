import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Zap, Shield, Globe, ArrowRight, Chrome } from 'lucide-react';
import { signInWithGoogle } from '@/src/services/firebase';
import { cn } from '@/src/lib/utils';
import { Logo } from '../ui/Logo';

export const AuthPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070a] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-primary/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-secondary/10 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay" />
      </div>

      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center relative z-10">
        {/* Mobile Header */}
        <div className="lg:hidden flex flex-col items-center text-center space-y-6 mb-4">
          <Logo 
            size={80} 
            showText={true} 
            vertical 
            textSize="text-4xl" 
          />
          <p className="text-slate-400 text-sm max-w-xs mx-auto">
            Advanced market intelligence and technical analysis engine.
          </p>
        </div>

        {/* Left Side: Branding (Desktop) */}
        <div className="hidden lg:block space-y-12">
          <Logo size={56} showText={true} textSize="text-2xl" />

          <div className="space-y-6">
            <h1 className="text-6xl font-display font-bold text-white leading-[1.1] tracking-tighter">
              Technical <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-blue-400">Intelligence</span> for Modern Markets.
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed max-w-md">
              Harness advanced technical analysis and deep scan technology for real-time institutional-grade market insights.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 pt-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white font-bold">
                <Shield size={16} className="text-brand-primary" />
                <span className="text-xs uppercase tracking-widest">Secure</span>
              </div>
              <p className="text-xs text-slate-500">End-to-end encrypted technical analytics.</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white font-bold">
                <Globe size={16} className="text-brand-primary" />
                <span className="text-xs uppercase tracking-widest">Global</span>
              </div>
              <p className="text-xs text-slate-500">Access data from all major global exchanges.</p>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass rounded-[32px] md:rounded-[40px] p-6 md:p-12 border-white/10 shadow-2xl relative overflow-hidden"
        >
          <div className="space-y-8">
            <div className="text-center lg:text-left space-y-2">
              <h3 className="text-2xl md:text-3xl font-display font-bold text-white">Unified Terminal</h3>
            <p className="text-sm md:text-base text-slate-500">Access professional analysis infrastructure.</p>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full flex items-center justify-between p-4 bg-white text-black rounded-xl md:rounded-2xl font-bold transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <Chrome size={20} />
                  <span className="text-sm md:text-base">Continue with Google</span>
                </div>
                <ArrowRight size={18} />
              </button>
              
              <div className="relative flex items-center gap-4 py-4">
                <div className="h-[1px] flex-1 bg-white/5" />
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest italic">Secure Feed Sync</span>
                <div className="h-[1px] flex-1 bg-white/5" />
              </div>

              <div className="space-y-3">
                <p className="text-center text-[10px] md:text-xs text-slate-600 leading-relaxed uppercase tracking-widest">
                  By connecting, you agree to our <span className="text-white hover:underline cursor-pointer">Terms of Service</span> and <span className="text-white hover:underline cursor-pointer">Security Policies</span>.
                </p>
              </div>
            </div>
          </div>

          {/* Card Accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 blur-[40px] rounded-full -mr-16 -mt-16" />
        </motion.div>
      </div>
    </div>
  );
};
