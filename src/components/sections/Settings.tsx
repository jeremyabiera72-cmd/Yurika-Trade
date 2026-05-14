import React from 'react';
import { AppSettings } from '@/src/types';
import { Shield, Bell, Layout, Cpu, Database, Palette, Zap, Globe } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';

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

interface SettingsProps {
  settings: AppSettings;
  onUpdate: (settings: AppSettings) => void;
  onOpenPricing: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ settings, onUpdate, onOpenPricing }) => {
  const [activeTab, setActiveTab] = React.useState('Appearance');

  const updateField = (field: keyof AppSettings, value: any) => {
    onUpdate({ ...settings, [field]: value });
  };

  const handleSave = () => {
    localStorage.setItem('yurika_settings', JSON.stringify(settings));
    // Simulation of saving
    const btn = document.getElementById('save-btn');
    if (btn) {
      const originalText = btn.innerText;
      btn.innerText = 'SAVED!';
      btn.className = 'px-8 py-2 bg-emerald-500 rounded-xl text-xs font-bold transition-all text-white shadow-lg shadow-emerald-500/20';
      setTimeout(() => {
        btn.innerText = originalText;
        btn.className = 'px-8 py-2 bg-brand-primary rounded-xl text-xs font-bold transition-all text-white shadow-lg shadow-brand-primary/20';
      }, 2000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-white tracking-tight italic">System Configuration</h2>
          <p className="text-sm text-slate-500 uppercase tracking-widest text-[10px]">Technical Hub & Terminal Preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <aside className="lg:col-span-3 space-y-2">
          {[
            { icon: Layout, label: 'Appearance' },
            { icon: Cpu, label: 'Analysis Engine' },
            { icon: Database, label: 'Data Feeds' },
            { icon: Shield, label: 'Security' },
            { icon: Bell, label: 'System Logs' },
          ].map((item) => (
            <button 
              key={item.label}
              onClick={() => setActiveTab(item.label)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                activeTab === item.label 
                  ? "bg-brand-primary/10 text-brand-primary border border-brand-primary/20" 
                  : "text-slate-500 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </aside>

        <main className="lg:col-span-9 space-y-6">
          <div className="glass rounded-3xl p-8 space-y-8">
            {activeTab === 'Appearance' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-3 uppercase tracking-wider">
                  <Palette className="text-brand-primary" size={16} />
                  Terminal Aesthetics
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Chart Theme</label>
                    <select 
                      value={settings.theme}
                      onChange={(e) => updateField('theme', e.target.value)}
                      className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-primary"
                    >
                      <option>Professional Dark</option>
                      <option>High Contrast Blue</option>
                      <option>Midnight Ledger</option>
                      <option>Classic Light</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Animation Intensity</label>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={settings.animationSpeed}
                      onChange={(e) => updateField('animationSpeed', parseInt(e.target.value))}
                      className="w-full accent-brand-primary" 
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                    <div>
                      <p className="text-sm font-bold text-white">Glassmorphism Effects</p>
                      <p className="text-xs text-slate-500">Enable translucent terminal panels.</p>
                    </div>
                    <button 
                      onClick={() => updateField('glassEffects', !settings.glassEffects)}
                      className={cn(
                        "w-12 h-6 rounded-full relative p-1 transition-colors",
                        settings.glassEffects ? "bg-brand-primary" : "bg-slate-800"
                      )}
                    >
                      <motion.div 
                        animate={{ x: settings.glassEffects ? 24 : 0 }}
                        className="w-4 h-4 bg-white rounded-full" 
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                    <div>
                      <p className="text-sm font-bold text-white">Show Technical Indicators</p>
                      <p className="text-xs text-slate-500">Toggle EMA/SMA overlays on main terminal.</p>
                    </div>
                    <button 
                      onClick={() => updateField('showIndicators', !settings.showIndicators)}
                      className={cn(
                        "w-12 h-6 rounded-full relative p-1 transition-colors",
                        settings.showIndicators ? "bg-brand-primary" : "bg-slate-800"
                      )}
                    >
                      <motion.div 
                        animate={{ x: settings.showIndicators ? 24 : 0 }}
                        className="w-4 h-4 bg-white rounded-full" 
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Analysis Engine' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-3 uppercase tracking-wider">
                  <Cpu className="text-brand-primary" size={16} />
                  Analysis Parameters
                </h3>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Accuracy Threshold</label>
                      <span className="text-xs font-bold text-brand-primary">{settings.aiSensitivity}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="50" 
                      max="95" 
                      value={settings.aiSensitivity}
                      onChange={(e) => updateField('aiSensitivity', parseInt(e.target.value))}
                      className="w-full accent-brand-primary" 
                    />
                    <p className="text-[10px] text-slate-600 uppercase tracking-widest">Wait for higher probability setups before updating panels.</p>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                    <div>
                      <p className="text-sm font-bold text-white">Setup Alerts</p>
                      <p className="text-xs text-slate-500 tracking-wide">Alert me when the analysis engine detects significant setups.</p>
                    </div>
                    <button 
                      onClick={() => updateField('deepScanNotifications', !settings.deepScanNotifications)}
                      className={cn(
                        "w-12 h-6 rounded-full relative p-1 transition-colors",
                        settings.deepScanNotifications ? "bg-brand-primary" : "bg-slate-800"
                      )}
                    >
                      <motion.div 
                        animate={{ x: settings.deepScanNotifications ? 24 : 0 }}
                        className="w-4 h-4 bg-white rounded-full" 
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Data Feeds' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-3 uppercase tracking-wider">
                  <Database className="text-emerald-500" size={16} />
                  API Feed Integration
                </h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Binance API Key</label>
                    <input 
                      type="password"
                      value={settings.binanceApiKey}
                      onChange={(e) => updateField('binanceApiKey', e.target.value)}
                      placeholder="Enter your Read-Only API Key"
                      className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">OpenAI API Key</label>
                    <input 
                      type="password"
                      value={settings.openaiApiKey}
                      onChange={(e) => updateField('openaiApiKey', e.target.value)}
                      placeholder="sk-..."
                      className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-primary"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Security' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-3 uppercase tracking-wider">
                  <Shield className="text-rose-500" size={16} />
                  Terminal Protection
                </h3>
                
                <div className="p-12 border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center text-center">
                  <Shield size={48} className="text-slate-700 mb-4" />
                  <p className="text-sm font-bold text-white">Enhanced Security Active</p>
                  <p className="text-xs text-slate-500 max-w-xs mt-2">All terminal sessions are end-to-end encrypted and localized to your browser environment.</p>
                  <button className="mt-6 px-6 py-2 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold rounded-full uppercase tracking-widest border border-emerald-500/20">
                    Audit Logs Ready
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'System Logs' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                 <h3 className="text-sm font-bold text-white flex items-center gap-3 uppercase tracking-wider">
                  <Bell className="text-amber-500" size={16} />
                  Core Execution Output
                </h3>
                <div className="bg-[#0a0b0d] rounded-2xl p-4 font-mono text-[10px] text-slate-500 space-y-1 h-64 overflow-y-auto no-scrollbar border border-white/5">
                  <p>[{new Date().toLocaleTimeString()}] System: Analysis Engine v2.4 initialized</p>
                  <p>[{new Date().toLocaleTimeString()}] Feed: WebSocket stream connected (BTC/USD)</p>
                  <p>[{new Date().toLocaleTimeString()}] Feed: Accuracy metrics synchronized</p>
                  <p className="text-slate-600">[{new Date().toLocaleTimeString()}] Terminal: Awaiting manual scan input</p>
                  <p>[{new Date().toLocaleTimeString()}] Engine: Ready for structural analysis</p>
                  <p className="text-brand-primary">[{new Date().toLocaleTimeString()}] Logic: Configuration parameters synchronized</p>
                </div>
              </div>
            )}

            <div className="pt-8 border-t border-white/5 flex justify-end gap-4">
              <button 
                onClick={() => onUpdate(DEFAULT_SETTINGS)}
                className="px-6 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold transition-all text-white border border-white/10"
              >
                RESET DEFAULTS
              </button>
              <button 
                id="save-btn"
                onClick={handleSave}
                className="px-8 py-2 bg-brand-primary rounded-xl text-xs font-bold transition-all text-white shadow-lg shadow-brand-primary/20"
              >
                SAVE PARAMS
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
