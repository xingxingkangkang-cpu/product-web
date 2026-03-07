/**
 * Compact line chart used in dashboard cards.
 */
import type { EChartsOption } from 'echarts';
import * as echarts from 'echarts';
import { BaseChart } from '@/components/charts/BaseChart';

export interface MiniLineChartProps {
  data: number[];
  color?: string;
}

export function MiniLineChart(props: MiniLineChartProps): JSX.Element {
  const { data, color = '#1677ff' } = props;

  const option: EChartsOption = {
    grid: {
      top: 4,
      left: 0,
      right: 0,
      bottom: 0,
    },
    xAxis: {
      type: 'category',
      show: false,
      data: data.map((_, index) => `${index}`),
    },
    yAxis: {
      type: 'value',
      show: false,
    },
    tooltip: {
      trigger: 'axis',
    },
    series: [
      {
        type: 'line',
        data,
        smooth: true,
        showSymbol: false,
        lineStyle: {
          width: 2,
          color,
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: `${color}66` },
            { offset: 1, color: `${color}05` },
          ]),
        },
      },
    ],
  };

  return <BaseChart option={option} height={72} className="rounded-lg" />;
}
