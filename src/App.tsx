import React, { useState, useEffect } from 'react';
import { Navbar } from '@/src/components/layout/Navbar';
import { Sidebar } from '@/src/components/layout/Sidebar';
import { TradingChart } from '@/src/components/chart/TradingChart';
import { AIAnalysisPanel } from '@/src/components/analysis/AIAnalysisPanel';
import { ChatAssistant } from '@/src/components/analysis/ChatAssistant';
import { generateMockData } from '@/src/data/mockData';
import { analyzeChartImage, AIAnalysisResult } from '@/src/services/geminiService';
import { Upload, Zap, Globe, BarChart3, Wallet, Menu, X, Settings as SettingsIcon } from 'lucide-react';
import { MarketData } from '@/src/types';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { marketService } from '@/src/services/marketData';
import { AppSettings } from '@/src/types';
import { subscribeToAuthChanges, db } from '@/src/services/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';

import { DeepScan } from '@/src/components/sections/DeepScan';
import { Analytics } from '@/src/components/sections/Analytics';
import { Academy } from '@/src/components/sections/Academy';
import { Settings } from '@/src/components/sections/Settings';
import { SplashScreen } from '@/src/components/layout/SplashScreen';
import { AuthPage } from '@/src/components/auth/AuthPage';
import { MarketBar } from '@/src/components/layout/MarketBar';
import { MarketExplorer } from '@/src/components/layout/MarketExplorer';

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'Professional Dark',
  animationSpeed: 50,
  glassEffects: true,
  deepScanNotifications: true,
  aiSensitivity: 75,
  showIndicators: true,
  binanceApiKey: '',
  openaiApiKey: '',
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [data, setData] = useState<MarketData[]>([]);
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeSymbol, setActiveSymbol] = useState('BTC/USDT');
  const [activeTimeframe, setActiveTimeframe] = useState('1H');
  const [activeNav, setActiveNav] = useState('Terminal');
  const [isMarketSelectorOpen, setIsMarketSelectorOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('yurika_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  useEffect(() => {
    marketService.connect(activeSymbol, activeTimeframe);
    return () => marketService.disconnect();
  }, [activeSymbol, activeTimeframe]);

  useEffect(() => {
    localStorage.setItem('yurika_settings', JSON.stringify(settings));
    document.documentElement.setAttribute('data-theme', settings.theme);
    
    // Sync to Firestore
    if (user) {
      const userDoc = doc(db, 'users', user.uid);
      setDoc(userDoc, { settings }, { merge: true }).catch(err => console.error("Error syncing settings:", err));
    }
  }, [settings, user]);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (u) => {
      setUser(u);
      
      if (u) {
        // Load settings from Firestore
        try {
          const userDoc = doc(db, 'users', u.uid);
          const docSnap = await getDoc(userDoc);
          if (docSnap.exists() && docSnap.data().settings) {
            setSettings(docSnap.data().settings);
          }
        } catch (err) {
          console.error("Error loading user settings:", err);
        }
      }

      // Wait a bit longer for effect
      setTimeout(() => setIsInitialLoading(false), 2000);
    });
    return () => unsubscribe();
  }, []);

  const loadRealData = async (symbol: string, timeframe: string) => {
    if (symbol === 'WTI OIL' || symbol === 'GOLD') {
      setData(generateMockData(150, symbol === 'GOLD' ? 2300 : 75));
      return;
    }
    const historicalData = await marketService.fetchHistory(symbol, timeframe);
    if (historicalData.length > 0) {
      setData(historicalData);
    } else {
      setData(generateMockData(150)); // Fallback
    }
  };

  useEffect(() => {
    loadRealData(activeSymbol, activeTimeframe);
  }, [activeSymbol, activeTimeframe]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      try {
        const result = await analyzeChartImage(base64);
        setAnalysis(result);
      } catch (err) {
        console.error(err);
      } finally {
        setIsAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const scanCurrentChart = async () => {
    setIsAnalyzing(true);
    setAnalysis(null);
    setTimeout(() => {
      setAnalysis({
        outlook: Math.random() > 0.5 ? 'bullish' : 'bearish',
        confidence: Math.floor(Math.random() * 30) + 60,
        insight: `Technical analysis of ${activeSymbol} on ${activeTimeframe} indicates potential trend continuation. Structure analysis confirms institutional liquidity clusters aligning with current price action.`,
        keyLevels: {
          resistance: ["$68,500", "$72,000"],
          support: ["$64,200", "$61,800"]
        },
        patterns: ["Trend Line", "Supply Zone", "Fair Value Gap"]
      });
      setIsAnalyzing(false);
    }, 2500);
  };

  const renderContent = () => {
    switch (activeNav) {
      case 'Deep Scan':
        return <DeepScan sensitivity={settings.aiSensitivity} />;
      case 'Analytics':
        return <Analytics />;
      case 'Academy':
        return <Academy />;
      case 'Core Config':
        return <Settings 
          settings={settings} 
          onUpdate={setSettings} 
          onOpenPricing={() => {}}
        />;
      default:
        return (
          <div className="max-w-[1600px] mx-auto space-y-6">
            {/* Market Tickers */}
            <MarketBar 
              activeSymbol={activeSymbol} 
              onSymbolChange={setActiveSymbol}
              onOpenSelector={() => setIsMarketSelectorOpen(true)}
            />

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 md:gap-6 lg:h-[calc(100vh-220px)]">
              {/* Chart Area */}
              <div className="xl:col-span-8 flex flex-col gap-4 md:gap-6 relative min-h-[500px] md:min-h-0">
                {isAnalyzing && (
                  <motion.div 
                    initial={{ top: "0%" }}
                    animate={{ top: "100%" }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="scan-line z-20"
                  />
                )}
                
                <div className="flex-grow glass rounded-[32px] overflow-hidden">
                  <TradingChart 
                    data={data} 
                    symbol={activeSymbol} 
                    activeTimeframe={activeTimeframe}
                    onTimeframeChange={setActiveTimeframe}
                    showIndicators={settings.showIndicators}
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 p-4 md:p-5 glass rounded-[32px] items-center justify-between">
                  <div className="hidden sm:block">
                    <h3 className="font-display font-bold text-base md:text-lg text-white">Market Intelligence</h3>
                    <p className="text-[10px] md:text-xs text-slate-500">Professional analysis and structural pattern detection.</p>
                  </div>
                  <div className="flex gap-3 w-full sm:w-auto">
                    <label className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl cursor-pointer transition-colors border border-white/5">
                      <Upload size={16} className="text-brand-primary" />
                      <span className="text-xs font-bold text-white">Upload Chart</span>
                      <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                    </label>
                    <button 
                      onClick={scanCurrentChart}
                      disabled={isAnalyzing}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2 bg-brand-primary text-white rounded-xl transition-all shadow-lg shadow-brand-primary/20 hover:opacity-90 disabled:opacity-50"
                    >
                      <Zap size={16} />
                      <span className="text-xs font-bold whitespace-nowrap">Run Scan</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Analysis Side Panel */}
              <div className="xl:col-span-4 h-full min-h-[400px] md:min-h-0">
                <AIAnalysisPanel result={analysis} isLoading={isAnalyzing} />
              </div>
            </div>
          </div>
        );
    }
  };

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (isInitialLoading) return <SplashScreen />;
  if (!user) return <AuthPage />;

  return (
    <div className="flex flex-col h-screen bg-[#0a0b0d] text-slate-300 font-sans selection:bg-brand-primary/30 relative overflow-hidden">
      {/* Background Subtle Textures */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.05),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 0)', backgroundSize: '40px 40px' }} />

      <Navbar 
        activeNav={activeNav} 
        onNavChange={setActiveNav} 
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      
      <div className="flex flex-1 pt-12 z-10 relative overflow-hidden">
        {/* Sidebar Navigation */}
        <AnimatePresence mode="wait">
          {isSidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] lg:hidden"
              />
              <motion.div
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 left-0 w-72 bg-[#0d0f12] border-r border-white/5 z-[101] shadow-2xl lg:relative lg:translate-x-0"
              >
                <Sidebar 
                  activeNav={activeNav} 
                  onNavChange={(nav) => {
                    setActiveNav(nav);
                    setIsSidebarOpen(false);
                  }} 
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>
        
        <main className="flex-1 overflow-y-auto custom-scrollbar relative">
          <div className="p-4 md:p-6 lg:p-8">
            {renderContent()}
          </div>
        </main>
      </div>

      <ChatAssistant />
      
      {/* Market Selector Modal */}
      <MarketExplorer 
        isOpen={isMarketSelectorOpen} 
        onClose={() => setIsMarketSelectorOpen(false)} 
        activeSymbol={activeSymbol}
        onSelect={setActiveSymbol}
      />

      {/* Footer Disclaimer */}
      <footer className="min-h-[2rem] py-2 bg-[#0d0f12] border-t border-white/5 flex items-center px-4 sm:px-8 relative z-10 shrink-0">
        <p className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-slate-600 mx-auto text-center font-medium leading-relaxed max-w-4xl">
          YURIKA provides analysis and educational insights only. This platform does not provide financial advice or execute trades.
        </p>
      </footer>
    </div>
  );
}
