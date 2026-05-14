import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, User, Sparkles } from 'lucide-react';
import { getAIAssistantResponse } from '@/src/services/geminiService';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { Logo } from '../ui/Logo';
import { cn } from '@/src/lib/utils';

export const ChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([
    { role: 'model', text: 'Welcome to YURIKA. How can I assist with your market analysis today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));
      
      const response = await getAIAssistantResponse(userMessage, history);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: 'Connection interrupted. Please refresh and try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-16 sm:bottom-6 right-4 sm:right-6 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-brand-primary text-white flex items-center justify-center shadow-2xl shadow-brand-primary/40 z-40 transition-all hover:scale-110 active:scale-95 group overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        <MessageSquare size={20} className="sm:hidden relative z-10" />
        <MessageSquare size={24} className="hidden sm:block relative z-10" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 100, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.9, y: 100, filter: 'blur(10px)' }}
            className="fixed bottom-28 left-4 right-4 sm:left-auto sm:right-6 sm:w-[400px] h-[450px] sm:h-[600px] max-h-[calc(100vh-140px)] glass rounded-[24px] sm:rounded-[32px] z-50 flex flex-col overflow-hidden shadow-2xl shadow-blue-500/10 border border-white/10"
          >
            {/* Header */}
            <div className="relative p-4 sm:p-6 border-b border-white/5 bg-[#0a0b0d]">
              <div className="flex items-center justify-between relative z-10">
                <Logo size={28} showText={true} textSize="text-base sm:text-lg" />
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                >
                  <X size={20} className="text-slate-400" />
                </button>
              </div>
            </div>

            <div ref={scrollRef} className="flex-grow overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6 no-scrollbar bg-[#0a0b0d]/40">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] group ${m.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-2`}>
                    <div className={cn(
                      "p-3 sm:p-4 rounded-2xl sm:rounded-3xl text-sm leading-relaxed",
                      m.role === 'user' 
                        ? 'bg-brand-primary text-white rounded-tr-sm shadow-lg shadow-brand-primary/20' 
                        : 'bg-white/5 border border-white/10 text-slate-300 rounded-tl-sm'
                    )}>
                      <div className="flex items-center gap-2 mb-1.5 sm:mb-2 opacity-50">
                        {m.role === 'user' ? <User size={10} /> : <Bot size={10} />}
                        <span className="text-[10px] font-bold uppercase tracking-widest">{m.role === 'user' ? 'Operator' : 'Assistant'}</span>
                      </div>
                      <div className="prose prose-invert prose-xs max-w-none text-[13px] sm:text-sm">
                        <ReactMarkdown>{m.text}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 p-4 rounded-3xl">
                     <div className="flex gap-1.5">
                        {[0, 1, 2].map(i => (
                           <motion.div 
                              key={i}
                              animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                              transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                              className="w-1.5 h-1.5 bg-brand-primary rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                           />
                        ))}
                     </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 sm:p-6 border-t border-white/5 bg-[#0a0b0d]/80 backdrop-blur-xl">
              <div className="relative group">
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Inquire technical structure..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 sm:py-4 pl-4 sm:pl-5 pr-12 sm:pr-14 text-sm focus:outline-none focus:border-brand-primary/50 transition-all placeholder:text-slate-600 focus:bg-white/10"
                />
                <button 
                  onClick={handleSend}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-brand-primary text-white rounded-xl hover:scale-105 transition-all shadow-lg shadow-brand-primary/20 disabled:opacity-50"
                  disabled={!input.trim() || isLoading}
                >
                  <Send size={18} />
                </button>
              </div>
              <div className="flex items-center justify-between mt-4">
                 <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">
                    Data connection active
                 </p>
                 <div className="flex gap-2">
                    <div className="w-1 h-1 rounded-full bg-brand-primary" />
                 </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

