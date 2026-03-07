/**
 * System perspective with metric trends, error codes and topology placeholder.
 */
import { Card, Empty } from 'antd';
import type { ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import type { EChartsOption } from 'echarts';
import { useEffect, useMemo, useState } from 'react';
import { getMetrics } from '@/api/componentApi';
import { BaseChart } from '@/components/charts/BaseChart';
import type { MetricPoint } from '@/types';
import { formatHourLabel } from '@/utils/format';

export interface SystemPerspectiveProps {
  componentId: string;
}

interface ErrorCodeRow {
  errorCode: string;
  count: number;
  firstSeen: string;
  lastSeen: string;
}

export function SystemPerspective(props: SystemPerspectiveProps): JSX.Element {
  const { componentId } = props;
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState<MetricPoint[]>([]);

  useEffect(() => {
    let alive = true;

    const load = async () => {
      setLoading(true);
      try {
        const data = await getMetrics(componentId);
        if (alive) {
          setMetrics(data);
        }
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      alive = false;
    };
  }, [componentId]);

  const lineOption: EChartsOption = useMemo(
    () => ({
      xAxis: {
        type: 'category',
        data: metrics.map((item) => formatHourLabel(item.timestamp)),
        axisLine: { lineStyle: { color: '#cbd5e1' } },
      },
      yAxis: [
        {
          type: 'value',
          name: 'QPS / 延迟',
          splitLine: { lineStyle: { type: 'dashed', color: '#e2e8f0' } },
        },
        {
          type: 'value',
          name: '错误率',
          min: 0,
          max: 0.03,
          axisLabel: {
            formatter: (value: number) => `${(value * 100).toFixed(1)}%`,
          },
          splitLine: { show: false },
        },
      ],
      legend: {
        top: 4,
        data: ['QPS', 'P95(ms)', '错误率'],
      },
      series: [
        {
          name: 'QPS',
          type: 'line',
          smooth: true,
          data: metrics.map((item) => item.qps),
          yAxisIndex: 0,
          lineStyle: { width: 2, color: '#1677ff' },
        },
        {
          name: 'P95(ms)',
          type: 'line',
          smooth: true,
          data: metrics.map((item) => item.p95),
          yAxisIndex: 0,
          lineStyle: { width: 2, color: '#fa8c16' },
        },
        {
          name: '错误率',
          type: 'line',
          smooth: true,
          data: metrics.map((item) => item.errorRate),
          yAxisIndex: 1,
          lineStyle: { width: 2, color: '#ef4444' },
        },
      ],
    }),
    [metrics],
  );

  const errorCodes: ErrorCodeRow[] = [
    { errorCode: 'AUTH_401', count: 31, firstSeen: '2026-03-04 08:12', lastSeen: '2026-03-04 18:25' },
    { errorCode: 'DB_503', count: 12, firstSeen: '2026-03-04 10:41', lastSeen: '2026-03-04 11:08' },
    { errorCode: 'UPSTREAM_504', count: 7, firstSeen: '2026-03-04 14:03', lastSeen: '2026-03-04 15:27' },
  ];

  const columns: ProColumns<ErrorCodeRow>[] = [
    { title: '错误码', dataIndex: 'errorCode' },
    { title: '次数', dataIndex: 'count', valueType: 'digit' },
    { title: '首次出现', dataIndex: 'firstSeen' },
    { title: '末次出现', dataIndex: 'lastSeen' },
  ];

  return (
    <div className="space-y-4">
      <Card className="rounded-xl border border-slate-200 shadow-sm" bodyStyle={{ padding: 12 }}>
        <h4 className="mb-2 text-sm font-medium text-slate-700">核心时序指标</h4>
        {metrics.length === 0 ? <Empty description="暂无时序数据" /> : <BaseChart option={lineOption} height={320} loading={loading} />}
      </Card>

      <ProTable<ErrorCodeRow>
        rowKey="errorCode"
        columns={columns}
        dataSource={errorCodes}
        search={false}
        options={false}
        pagination={false}
      />

      <Card className="rounded-xl border border-dashed border-slate-300 bg-slate-50 shadow-sm">
        <h4 className="mb-2 text-sm font-medium text-slate-700">依赖拓扑</h4>
        <p className="text-sm text-slate-500">当前为占位模块，可接入 Graph / G6 进行服务依赖拓扑渲染。</p>
      </Card>
    </div>
  );
}
