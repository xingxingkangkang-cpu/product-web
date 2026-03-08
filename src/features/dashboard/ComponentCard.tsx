/**
 * Dashboard card that displays component health and traffic metrics.
 */
import { Card, Tag } from 'antd';
import { Server } from 'lucide-react';
import { MiniLineChart } from '@/components/charts/MiniLineChart';
import { AnimatedNumber } from '@/components/common/AnimatedNumber';
import type { ComponentItem } from '@/types';

export interface ComponentCardProps {
  component: ComponentItem;
  onClick: (componentId: string) => void;
}

const statusConfig: Record<ComponentItem['status'], { label: string; dotClass: string }> = {
  healthy: { label: '健康', dotClass: 'bg-emerald-500' },
  warning: { label: '预警', dotClass: 'bg-amber-500' },
  error: { label: '异常', dotClass: 'bg-rose-500' },
};

export function ComponentCard(props: ComponentCardProps): JSX.Element {
  const { component, onClick } = props;

  const trendSeed = component.todayCalls % 100;
  const trend = [
    trendSeed + 4,
    trendSeed + 12,
    trendSeed + 8,
    trendSeed + 16,
    trendSeed + 10,
    trendSeed + 18,
    trendSeed + 14,
  ];

  return (
    <Card
      hoverable
      onClick={() => onClick(component.componentId)}
      className="enterprise-panel card-hover h-full rounded-[26px] border-0 transition-all"
      styles={{ body: { padding: 22 } }}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="metric-icon metric-icon-blue mt-0.5 h-11 w-11 rounded-[16px]">
            <Server size={16} />
          </div>
          <div>
            <p className="label-eyebrow mb-2">Component Node</p>
            <h3 className="mb-2 text-base font-semibold tracking-tight text-slate-950">{component.name}</h3>
            <Tag color="blue" className="app-tag app-tag-blue">
              {component.version}
            </Tag>
          </div>
        </div>
        <div className="status-chip text-xs">
          <span className={`inline-block h-2.5 w-2.5 rounded-full ${statusConfig[component.status].dotClass}`} />
          {statusConfig[component.status].label}
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className="surface-muted rounded-[20px] p-4">
          <p className="mb-1 text-xs text-slate-500">今日调用量</p>
          <p className="text-2xl font-semibold tracking-tight text-slate-950">
            <AnimatedNumber value={component.todayCalls} />
          </p>
        </div>
        <div className="surface-muted rounded-[20px] p-4">
          <p className="mb-1 text-xs text-slate-500">成功率</p>
          <p className="text-2xl font-semibold tracking-tight text-slate-950">
            <AnimatedNumber value={component.successRate} decimals={1} suffix="%" />
          </p>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between rounded-[18px] bg-slate-950/[0.03] px-4 py-3 text-xs text-slate-600">
        <span>健康分</span>
        <span className="text-sm font-semibold text-slate-950">
          <AnimatedNumber value={component.healthScore} />
        </span>
      </div>

      <div className="rounded-[20px] border border-slate-200/70 bg-white/60 p-3">
        <MiniLineChart data={trend} color={component.status === 'error' ? '#ef4444' : '#2563eb'} />
      </div>
    </Card>
  );
}
