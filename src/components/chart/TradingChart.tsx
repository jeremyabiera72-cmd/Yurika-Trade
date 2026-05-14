import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, IChartApi, ISeriesApi, CandlestickSeries, LineSeries } from 'lightweight-charts';
import { MarketData } from '@/src/types';
import { cn } from '@/src/lib/utils';
import { marketService } from '@/src/services/marketData';

interface TradingChartProps {
  data: MarketData[];
  symbol?: string;
  activeTimeframe?: string;
  onTimeframeChange?: (tf: string) => void;
  showIndicators?: boolean;
}

export const TradingChart: React.FC<TradingChartProps> = ({ 
  data, 
  symbol = 'BTC/USDT', 
  activeTimeframe = '1H',
  onTimeframeChange,
  showIndicators = true
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const ema20Ref = useRef<ISeriesApi<"Line"> | null>(null);
  const ema50Ref = useRef<ISeriesApi<"Line"> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#64748b',
        fontSize: 10,
        fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.02)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.02)' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 500,
      timeScale: {
        borderColor: 'rgba(255, 255, 255, 0.05)',
        timeVisible: true,
      },
      rightPriceScale: {
        borderColor: 'rgba(255, 255, 255, 0.05)',
      },
      crosshair: {
        vertLine: { color: 'rgba(255, 255, 255, 0.1)', labelBackgroundColor: '#0a0b0d' },
        horzLine: { color: 'rgba(255, 255, 255, 0.1)', labelBackgroundColor: '#0a0b0d' },
      }
    });

    const series = chart.addSeries(CandlestickSeries, {
      upColor: '#10B981',
      downColor: '#F43F5E',
      borderVisible: false,
      wickUpColor: '#10B981',
      wickDownColor: '#F43F5E',
    });

    const ema20 = chart.addSeries(LineSeries, {
      color: '#3b82f6',
      lineWidth: 1,
      priceLineVisible: false,
      lastValueVisible: false,
      visible: showIndicators,
    });

    const ema50 = chart.addSeries(LineSeries, {
      color: '#64748b',
      lineWidth: 1,
      priceLineVisible: false,
      lastValueVisible: false,
      visible: showIndicators,
    });

    series.setData(data as any);
    
    chartRef.current = chart;
    seriesRef.current = series;
    ema20Ref.current = ema20;
    ema50Ref.current = ema50;

    const handleResize = (entries: ResizeObserverEntry[]) => {
      const entry = entries[0];
      if (entry && chartRef.current) {
        chartRef.current.applyOptions({ 
          width: entry.contentRect.width,
        });
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(chartContainerRef.current);

    // Initial indicators
    if (showIndicators) {
      updateIndicators(data);
    }

    return () => {
      resizeObserver.disconnect();
      chart.remove();
    };
  }, []);

  const updateIndicators = (chartData: MarketData[]) => {
    if (!ema20Ref.current || !ema50Ref.current || chartData.length === 0) return;

    const calcEMA = (period: number) => {
      const k = 2 / (period + 1);
      let ema = chartData[0].close;
      return chartData.map(d => {
        ema = d.close * k + ema * (1 - k);
        return { time: d.time, value: ema };
      });
    };

    ema20Ref.current.setData(calcEMA(20) as any);
    ema50Ref.current.setData(calcEMA(50) as any);
  };

  useEffect(() => {
    if (seriesRef.current && data.length > 0) {
      seriesRef.current.setData(data as any);
      if (showIndicators) updateIndicators(data);
    }
  }, [data, showIndicators]);

  useEffect(() => {
    const unsubscribe = marketService.subscribe((tick) => {
      if (seriesRef.current) {
        seriesRef.current.update(tick as any);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [symbol]);

  const currentPrice = data.length > 0 ? data[data.length - 1].close.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '0.00';

  return (
    <div className="flex flex-col w-full h-full bg-[#16191e]/40 border border-white/5 overflow-hidden group rounded-xl">
      <div className="flex items-center justify-between p-3 border-b border-white/5 bg-[#0a0b0d]">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="font-bold text-xs tracking-tight text-white">{symbol}</span>
            <span className="text-[9px] text-slate-500 uppercase tracking-widest">Market Feed</span>
          </div>
          <div className="h-4 w-[1px] bg-white/10" />
          <span className="text-xs font-bold text-brand-primary">{currentPrice}</span>
        </div>
        <div className="flex gap-1">
          {['1m', '5m', '15m', '1H', '4H', '1D'].map((tf) => (
            <button 
              key={tf} 
              onClick={() => onTimeframeChange?.(tf)}
              className={cn(
                "px-2 py-0.5 rounded text-[9px] font-bold transition-all",
                activeTimeframe === tf 
                  ? "bg-brand-primary/20 text-brand-primary border border-brand-primary/20" 
                  : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
              )}
            >
              {tf.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      <div ref={chartContainerRef} className="w-full flex-grow relative" id="chart-viewport" />
      
      {/* Chart Footer Info */}
      <div className="flex items-center gap-6 px-4 py-1.5 border-t border-white/5 bg-[#0d0f12] text-[9px] font-bold uppercase tracking-widest text-slate-500">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Feed: Live</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span>Latency: 24ms</span>
        </div>
        <div className="ml-auto">
          <span>Accuracy: 99.8%</span>
        </div>
      </div>
    </div>
  );
};
