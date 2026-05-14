export type MarketOutlook = 'bullish' | 'bearish' | 'neutral';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: string;
}

export interface AnalysisRecord {
  id?: string;
  userId: string;
  symbol: string;
  timeframe: string;
  screenshotUrl?: string;
  insight: string;
  outlook: MarketOutlook;
  confidence: number;
  technicalLevels?: {
    resistance: number[];
    support: number[];
  };
  createdAt: string;
}

export interface MarketData {
  time: string | number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface AppSettings {
  theme: 'Professional Dark' | 'High Contrast Blue' | 'Midnight Ledger' | 'Classic Light';
  animationSpeed: number;
  glassEffects: boolean;
  deepScanNotifications: boolean;
  aiSensitivity: number;
  showIndicators: boolean;
  binanceApiKey: string;
  openaiApiKey: string;
}
