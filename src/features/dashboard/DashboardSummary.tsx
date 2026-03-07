/**
 * Dashboard summary cards for component fleet overview.
 */
import { Card, Tag } from 'antd';
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Boxes,
  Minus,
  ShieldCheck,
  Waves,
} from 'lucide-react';
import { useEffect, useMemo, useRef } from 'react';
import { AnimatedNumber } from '@/components/common/AnimatedNumber';
import type { ComponentItem } from '@/types';
import { formatNumber, formatPercent } from '@/utils/format';

export interface DashboardSummaryProps {
  components: ComponentItem[];
}

interface DashboardSnapshot {
  totalComponents: number;
  healthyCount: number;
  warningCount: number;
  errorCount: number;
  alertCount: number;
  averageHealthScore: number;
  totalCalls: number;
  todayCalls: number;
  weightedSuccessRate: number;
}

interface TrendConfig {
  positiveGood?: boolean;
  decimals?: number;
  suffix?: string;
}

function formatDelta(delta: number, decimals: number, suffix: string): string {
  const prefix = delta > 0 ? '+' : '-';

  if (decimals > 0) {
    return `${prefix}${Math.abs(delta).toFixed(decimals)}${suffix}`;
  }

  return `${prefix}${formatNumber(Math.round(Math.abs(delta)))}${suffix}`;
}

function SummaryTrend(props: {
  current: number;
  previous?: number;
  positiveGood?: boolean;
  decimals?: number;
  suffix?: string;
}): JSX.Element {
  const { current, previous, positiveGood = true, decimals = 0, suffix = '' } = props;

  if (previous === undefined) {
    return <p className="mt-3 text-xs text-slate-400">等待下一轮刷新后展示环比趋势</p>;
  }

  const delta = Number((current - previous).toFixed(Math.max(decimals, 0) + 1));
  if (delta === 0) {
    return (
      <div className="mt-3 flex items-center gap-1 text-xs text-slate-400">
        <Minus size={14} />
        <span>环比上一轮持平</span>
      </div>
    );
  }

  const isUp = delta > 0;
  const isGood = positiveGood ? isUp : !isUp;
  const Icon = isUp ? ArrowUpRight : ArrowDownRight;

  return (
    <div className={`mt-3 flex items-center gap-1 text-xs ${isGood ? 'text-emerald-600' : 'text-rose-500'}`}>
      <Icon size={14} />
      <span>环比上一轮 {formatDelta(delta, decimals, suffix)}</span>
    </div>
  );
}

export function DashboardSummary(props: DashboardSummaryProps): JSX.Element {
  const { components } = props;
  const previousSummaryRef = useRef<DashboardSnapshot>();

  const summary = useMemo<DashboardSnapshot>(() => {
    const totalComponents = components.length;
    const healthyCount = components.filter((item) => item.status === 'healthy').length;
    const warningCount = components.filter((item) => item.status === 'warning').length;
    const errorCount = components.filter((item) => item.status === 'error').length;
    const alertCount = warningCount + errorCount;
    const averageHealthScore =
      totalComponents > 0 ? components.reduce((sum, item) => sum + item.healthScore, 0) / totalComponents : 0;
    const totalCalls = components.reduce((sum, item) => sum + item.totalCalls, 0);
    const todayCalls = components.reduce((sum, item) => sum + item.todayCalls, 0);
    const totalWeightedCalls = components.reduce((sum, item) => sum + item.todayCalls, 0);
    const weightedSuccessRate =
      totalWeightedCalls > 0
        ? components.reduce((sum, item) => sum + item.successRate * item.todayCalls, 0) / totalWeightedCalls
        : 0;

    return {
      totalComponents,
      healthyCount,
      warningCount,
      errorCount,
      alertCount,
      averageHealthScore,
      totalCalls,
      todayCalls,
      weightedSuccessRate,
    };
  }, [components]);

  useEffect(() => {
    previousSummaryRef.current = summary;
  }, [summary]);

  const previousSummary = previousSummaryRef.current;
  const hasAlert = summary.alertCount > 0;

  return (
    <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Card className="rounded-xl border border-slate-200 shadow-sm" styles={{ body: { padding: 18 } }}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">组件总数</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">
              <AnimatedNumber value={summary.totalComponents} suffix=" 个" />
            </p>
          </div>
          <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
            <Boxes size={20} />
          </div>
        </div>
        <SummaryTrend current={summary.totalComponents} previous={previousSummary?.totalComponents} suffix=" 个" />
        <p className="mt-2 text-sm text-slate-600">健康组件 {formatNumber(summary.healthyCount)} 个</p>
      </Card>

      <Card className="rounded-xl border border-slate-200 shadow-sm" styles={{ body: { padding: 18 } }}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">整体健康度</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">
              <AnimatedNumber value={summary.averageHealthScore} decimals={1} suffix=" 分" />
            </p>
          </div>
          <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
            <ShieldCheck size={20} />
          </div>
        </div>
        <SummaryTrend
          current={summary.averageHealthScore}
          previous={previousSummary?.averageHealthScore}
          decimals={1}
          suffix=" 分"
        />
        <p className="mt-2 text-sm text-slate-600">整体成功率 {formatPercent(summary.weightedSuccessRate)}</p>
      </Card>

      <Card className="rounded-xl border border-slate-200 shadow-sm" styles={{ body: { padding: 18 } }}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">累计调用量</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">
              <AnimatedNumber value={summary.totalCalls} />
            </p>
          </div>
          <div className="rounded-xl bg-cyan-50 p-3 text-cyan-600">
            <Waves size={20} />
          </div>
        </div>
        <SummaryTrend current={summary.totalCalls} previous={previousSummary?.totalCalls} suffix=" 次" />
        <p className="mt-2 text-sm text-slate-600">今日总调用 {formatNumber(summary.todayCalls)}</p>
      </Card>

      <Card className="rounded-xl border border-slate-200 shadow-sm" styles={{ body: { padding: 18 } }}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">告警状态</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">
              <AnimatedNumber value={summary.alertCount} suffix=" 个" />
            </p>
          </div>
          <div className={`rounded-xl p-3 ${hasAlert ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>
            <AlertTriangle size={20} />
          </div>
        </div>
        <SummaryTrend
          current={summary.alertCount}
          previous={previousSummary?.alertCount}
          suffix=" 个"
          positiveGood={false}
        />
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Tag color={hasAlert ? 'warning' : 'success'} className="rounded-md">
            {hasAlert ? '当前有告警' : '运行平稳'}
          </Tag>
          <span className="text-sm text-slate-600">预警 {summary.warningCount} / 异常 {summary.errorCount}</span>
        </div>
      </Card>
    </div>
  );
}

