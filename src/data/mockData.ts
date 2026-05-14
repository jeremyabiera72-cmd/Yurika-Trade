import { MarketData } from '@/src/types';

export function generateMockData(count: number = 200, basePrice: number = 65000): MarketData[] {
  const data: MarketData[] = [];
  let currentPrice = basePrice;
  let time = new Date(Date.now() - count * 60 * 60 * 1000);

  const vol = basePrice * 0.005; // 0.5% volatility

  for (let i = 0; i < count; i++) {
    const open = currentPrice;
    const high = open + Math.random() * vol;
    const low = open - Math.random() * vol;
    const close = low + Math.random() * (high - low);
    
    data.push({
      time: time.getTime() / 1000,
      open,
      high,
      low,
      close,
    });
    
    currentPrice = close;
    time = new Date(time.getTime() + 60 * 60 * 1000); // 1 hour steps
  }
  
  return data;
}
