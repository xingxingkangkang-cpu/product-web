/**
 * ECharts base wrapper with unified visual style.
 */
import type { EChartsOption } from 'echarts';
import ReactECharts from 'echarts-for-react';

export interface BaseChartProps {
  option: EChartsOption;
  height?: number;
  className?: string;
  loading?: boolean;
  onEvents?: Record<string, (params: unknown) => void>;
}

export function BaseChart(props: BaseChartProps): JSX.Element {
  const { option, height = 300, className, loading = false, onEvents } = props;

  const mergedOption: EChartsOption = {
    color: ['#2563eb', '#0891b2', '#0f766e', '#f59e0b', '#dc2626', '#7c3aed'],
    backgroundColor: 'transparent',
    textStyle: {
      color: '#334155',
      fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif',
    },
    grid: {
      top: 40,
      left: 36,
      right: 24,
      bottom: 36,
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15, 23, 42, 0.92)',
      borderColor: 'rgba(148, 163, 184, 0.18)',
      borderWidth: 1,
      padding: 12,
      extraCssText: 'backdrop-filter: blur(12px); border-radius: 16px; box-shadow: 0 18px 42px rgba(15,23,42,0.28);',
      textStyle: {
        color: '#f8fafc',
      },
    },
    legend: {
      itemWidth: 10,
      itemHeight: 10,
      icon: 'roundRect',
      textStyle: {
        color: '#64748b',
        fontSize: 12,
      },
    },
    animation: true,
    animationDuration: 650,
    animationEasing: 'cubicOut',
    ...option,
  };

  return (
    <ReactECharts
      option={mergedOption}
      style={{ height }}
      className={className}
      notMerge
      showLoading={loading}
      onEvents={onEvents}
    />
  );
}
