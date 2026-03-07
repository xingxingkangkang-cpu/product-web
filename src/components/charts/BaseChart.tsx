/**
 * ECharts base wrapper with unified visual style.
 */
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';

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
    backgroundColor: 'transparent',
    textStyle: {
      color: '#1f2937',
      fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif',
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
      backgroundColor: 'rgba(15,23,42,0.92)',
      borderWidth: 0,
      textStyle: {
        color: '#f8fafc',
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
