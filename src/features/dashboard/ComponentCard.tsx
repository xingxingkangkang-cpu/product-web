/**
 * Dashboard card that displays component health and traffic metrics.
 */
import { Tag, Card } from 'antd';
import { Server } from 'lucide-react';
import type { ComponentItem } from '@/types';
import { AnimatedNumber } from '@/components/common/AnimatedNumber';
import { MiniLineChart } from '@/components/charts/MiniLineChart';

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
      className="card-hover h-full rounded-xl border border-slate-200 shadow-sm transition-all"
      styles={{ body: { padding: 18 } }}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex items-start gap-2">
          <div className="mt-1 rounded-lg bg-blue-50 p-1.5 text-blue-600">
            <Server size={16} />
          </div>
          <div>
            <h3 className="mb-1 text-base font-semibold text-slate-900">{component.name}</h3>
            <Tag color="blue" className="rounded-md">
              {component.version}
            </Tag>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <span className={`inline-block h-2.5 w-2.5 rounded-full ${statusConfig[component.status].dotClass}`} />
          {statusConfig[component.status].label}
        </div>
      </div>

      <div className="mb-3 grid grid-cols-2 gap-3">
        <div>
          <p className="mb-1 text-xs text-slate-500">今日调用量</p>
          <p className="text-xl font-semibold text-slate-900">
            <AnimatedNumber value={component.todayCalls} />
          </p>
        </div>
        <div>
          <p className="mb-1 text-xs text-slate-500">成功率</p>
          <p className="text-xl font-semibold text-slate-900">
            <AnimatedNumber value={component.successRate} decimals={1} suffix="%" />
          </p>
        </div>
      </div>

      <div className="mb-3 text-xs text-slate-600">
        健康分:
        <span className="ml-1 text-sm font-semibold text-slate-900">
          <AnimatedNumber value={component.healthScore} />
        </span>
      </div>

      <div className="rounded-lg bg-slate-50 p-2">
        <MiniLineChart data={trend} color={component.status === 'error' ? '#ef4444' : '#1677ff'} />
      </div>
    </Card>
  );
}
