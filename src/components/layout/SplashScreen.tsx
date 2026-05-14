import React from 'react';
import { motion } from 'motion/react';
import { Logo } from '../ui/Logo';

export const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[200] bg-[#05070a] flex flex-col items-center justify-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative"
      >
        <Logo size={120} vertical textSize="text-5xl" className="gap-8" />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-6 text-center"
      >
        <p className="text-slate-500 text-[10px] font-bold tracking-[0.2em] uppercase mb-4">
          Welcome to Yurika Trade
        </p>
        <div className="flex gap-1.5 justify-center mt-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ 
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2
              }}
              className="w-1.5 h-1.5 rounded-full bg-brand-primary"
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};
