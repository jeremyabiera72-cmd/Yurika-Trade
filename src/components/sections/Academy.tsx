import React, { useState, useEffect } from 'react';
import { BookOpen, PlayCircle, Star, Clock, CheckCircle2, Award, Search, RefreshCcw, Check, X as XIcon, HelpCircle, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getDailyTrivia, TriviaQuestion } from '@/src/services/geminiService';
import { cn } from '@/src/lib/utils';

const courses = [
  { 
    id: 1, 
    title: 'Mastering Liquidity Concepts', 
    description: 'A deep dive into institutional liquidity, identifying stop hunts and high-probability reversal zones.',
    level: 'Advanced', 
    duration: '25m', 
    students: 12500, 
    rating: 5.0, 
    progress: 0,
    image: 'https://content.instructables.com/FMJ/M7O9/KP8M9R4H/FMJM7O9KP8M9R4H.jpg?auto=webp&frame=1&width=1024&height=1024&fit=bounds&md=c1f4e1f7d1b3e6a9f7e8a3b5c4d2e1f0',
    videoUrl: 'https://youtu.be/rqwiL8aNYHY?si=_oeSGxvq6_JETMJR',
    type: 'video'
  },
  { 
    id: 2, 
    title: 'Complete Day Trading Guide', 
    description: 'Comprehensive walkthrough for beginners to intermediate traders on navigating daily market cycles.',
    level: 'Beginner', 
    duration: '18m', 
    students: 8400, 
    rating: 4.8, 
    progress: 0,
    image: 'https://i.ytimg.com/vi/ExvoIqNglOk/maxresdefault.jpg',
    videoUrl: 'https://youtu.be/ExvoIqNglOk?si=d62Ti3150_Hdmvzk',
    type: 'video'
  },
  { 
    id: 3, 
    title: 'Pro Trading Strategy', 
    description: 'Mechanical trading rules for consistent execution and risk-defined performance across various timeframes.',
    level: 'Intermediate', 
    duration: '15m', 
    students: 6200, 
    rating: 4.9, 
    progress: 0,
    image: 'https://i.ytimg.com/vi/9AL41xON3hA/maxresdefault.jpg',
    videoUrl: 'https://youtu.be/9AL41xON3hA?si=ADQ_uNWBO64_Lce6',
    type: 'video'
  },
  { 
    id: 4, 
    title: 'Technical Analysis Playbook (PDF)', 
    description: 'A comprehensive documentation of chart patterns, technical indicators, and structural guidelines for professional traders.',
    level: 'Reference', 
    duration: '65 Pages', 
    students: 15200, 
    rating: 4.9, 
    progress: 0,
    image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=800&auto=format&fit=crop',
    videoUrl: 'https://www.tradingview.com/ideas/technicalanalysis/',
    type: 'document'
  },
];

export const Academy: React.FC = () => {
  const [trivia, setTrivia] = useState<TriviaQuestion | null>(null);
  const [loadingTrivia, setLoadingTrivia] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  const fetchTrivia = async () => {
    setLoadingTrivia(true);
    try {
      const q = await getDailyTrivia();
      setTrivia(q);
      
      // Check if user already answered this specific question (by question text hash or similar)
      const saved = localStorage.getItem('yurika_daily_trivia_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.question === q.question) {
          setSelectedIdx(parsed.selectedIdx);
          setHasAnswered(true);
        } else {
          setHasAnswered(false);
          setSelectedIdx(null);
        }
      } else {
        setHasAnswered(false);
        setSelectedIdx(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTrivia(false);
    }
  };

  useEffect(() => {
    fetchTrivia();
  }, []);

  const handleAnswer = (idx: number) => {
    if (hasAnswered || !trivia) return;
    setSelectedIdx(idx);
    setHasAnswered(true);
    
    localStorage.setItem('yurika_daily_trivia_state', JSON.stringify({
      question: trivia.question,
      selectedIdx: idx,
      date: new Date().toDateString()
    }));
  };

  const handleWatchLesson = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-white tracking-tight">Learning Academy</h2>
          <p className="text-sm text-slate-500">Curated masterclasses and technical analysis modules.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input 
            type="text" 
            placeholder="Search lessons..." 
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs font-bold text-white focus:outline-none focus:border-brand-primary"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course) => (
            <motion.div 
              key={course.id}
              whileHover={{ y: -5 }}
              className="glass rounded-3xl p-1 overflow-hidden group cursor-pointer flex flex-col"
              onClick={() => handleWatchLesson(course.videoUrl)}
            >
              <div className="relative h-48 bg-slate-900 overflow-hidden rounded-2xl">
                <img 
                  src={course.image} 
                  alt={course.title}
                  className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-brand-primary/20 text-brand-primary text-[10px] font-bold rounded-full border border-brand-primary/30 uppercase tracking-widest backdrop-blur-md">
                    {course.level}
                  </span>
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-14 h-14 rounded-full bg-brand-primary flex items-center justify-center shadow-2xl shadow-brand-primary/50">
                    {course.type === 'video' ? (
                      <PlayCircle size={32} className="text-white ml-1" />
                    ) : (
                      <FileText size={32} className="text-white" />
                    )}
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-amber-400 fill-amber-400" />
                    <span className="text-xs font-bold">{course.rating}</span>
                  </div>
                </div>
              </div>
              <div className="p-5 flex-grow flex flex-col space-y-3">
                <h3 className="text-lg font-display font-bold text-white group-hover:text-brand-primary transition-colors leading-tight">{course.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{course.description}</p>
                
                <div className="mt-auto pt-4 space-y-4">
                  <div className="flex items-center gap-4 text-slate-500">
                    <div className="flex items-center gap-1.5">
                      {course.type === 'video' ? <Clock size={14} /> : <BookOpen size={14} />}
                      <span className="text-[10px] font-bold uppercase tracking-wider">{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Award size={14} />
                      <span className="text-[10px] font-bold uppercase tracking-wider">{course.students}</span>
                    </div>
                  </div>
                  
                  {course.progress > 0 && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] font-bold text-slate-500">
                        <span>COMPLETION</span>
                        <span className="text-brand-primary">{course.progress}%</span>
                      </div>
                      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-primary" style={{ width: `${course.progress}%` }} />
                      </div>
                    </div>
                  )}

                  <button className="w-full py-2.5 bg-brand-primary/10 hover:bg-brand-primary text-brand-primary hover:text-white rounded-xl text-xs font-bold transition-all border border-brand-primary/20 flex items-center justify-center gap-2">
                    {course.type === 'video' ? <PlayCircle size={14} /> : <FileText size={14} />}
                    {course.type === 'video' ? 'WATCH LESSON' : 'OPEN DOCUMENT'}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="p-6 glass rounded-3xl bg-gradient-to-br from-brand-primary/10 to-transparent border-brand-primary/20">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-brand-primary" />
              LEARNING PATH
            </h3>
            <div className="space-y-6 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-white/10">
              <div className="relative pl-8">
                <div className="absolute left-0 top-0 w-4 h-4 rounded-full bg-brand-primary ring-4 ring-brand-primary/20 flex items-center justify-center">
                  <CheckCircle2 size={10} className="text-white" />
                </div>
                <p className="text-xs font-bold text-white">Candlestick Basics</p>
                <p className="text-[10px] text-slate-500">Completed 2 days ago</p>
              </div>
              <div className="relative pl-8">
                <div className="absolute left-0 top-0 w-4 h-4 rounded-full bg-transparent border-2 border-white/20" />
                <p className="text-xs font-bold text-slate-300">Advanced Price Action</p>
                <p className="text-[10px] text-slate-500">In Progress</p>
              </div>
              <div className="relative pl-8">
                <div className="absolute left-0 top-0 w-4 h-4 rounded-full bg-transparent border-2 border-white/20 opacity-30" />
                <p className="text-xs font-bold text-slate-600">Liquidity Cycles</p>
                <p className="text-[10px] text-slate-700">Locked</p>
              </div>
            </div>
          </div>

          <div className="p-6 glass rounded-3xl space-y-4 border border-white/5 bg-[#0a0b0d]/40">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-bold text-white flex items-center gap-2 uppercase tracking-widest">
                <HelpCircle size={14} className="text-brand-primary" />
                DAILY TRIVIA
              </h3>
              {hasAnswered && (
                <button 
                  onClick={() => {
                    localStorage.removeItem('yurika_daily_trivia_state');
                    fetchTrivia();
                  }}
                  className="p-1 hover:bg-white/5 rounded-lg transition-colors text-slate-500"
                  title="Refresh Challenge"
                >
                  <RefreshCcw size={12} />
                </button>
              )}
            </div>

            {loadingTrivia ? (
              <div className="space-y-3 py-4">
                <div className="h-4 bg-white/5 rounded animate-pulse w-3/4" />
                <div className="h-10 bg-white/5 rounded-xl animate-pulse" />
                <div className="h-10 bg-white/5 rounded-xl animate-pulse" />
              </div>
            ) : trivia ? (
              <div className="space-y-4">
                <p className="text-xs text-slate-300 font-medium leading-relaxed italic">
                  "{trivia.question}"
                </p>
                
                <div className="space-y-2">
                  {trivia.options.map((option, idx) => {
                    const isCorrect = idx === trivia.correctIndex;
                    const isSelected = idx === selectedIdx;
                    
                    return (
                      <button 
                        key={idx}
                        disabled={hasAnswered}
                        onClick={() => handleAnswer(idx)}
                        className={cn(
                          "w-full text-left p-3 rounded-xl text-[10px] font-bold transition-all border outline-none",
                          !hasAnswered && "bg-white/5 border-white/10 hover:border-brand-primary/50 hover:bg-brand-primary/5",
                          hasAnswered && isCorrect && "bg-emerald-500/10 border-emerald-500/30 text-emerald-500",
                          hasAnswered && isSelected && !isCorrect && "bg-rose-500/10 border-rose-500/30 text-rose-500",
                          hasAnswered && !isSelected && !isCorrect && "opacity-40 border-white/5 bg-white/5"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span>{option}</span>
                          {hasAnswered && isCorrect && <Check size={12} />}
                          {hasAnswered && isSelected && !isCorrect && <XIcon size={12} />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <AnimatePresence>
                  {hasAnswered && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="p-4 bg-brand-primary/5 rounded-2xl border border-brand-primary/10"
                    >
                      <p className="text-[10px] font-bold text-brand-primary uppercase tracking-widest mb-1 flex items-center gap-1">
                        Analysis Output
                      </p>
                      <p className="text-[10px] text-slate-400 leading-relaxed">
                        {trivia.explanation}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <p className="text-[10px] text-slate-500">Failed to load trivia. Protocol offline.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
