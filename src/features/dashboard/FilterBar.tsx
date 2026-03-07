/**
 * Dashboard toolbar with overview status and refresh actions.
 */
import { Button, Tag } from 'antd';
import { RefreshCw } from 'lucide-react';
import { RealTimeIndicator } from '@/components/common/RealTimeIndicator';
import { formatDateTime, formatRelativeTime } from '@/utils/format';

export interface FilterBarProps {
  componentCount: number;
  alertCount: number;
  lastUpdatedAt?: string;
  refreshing?: boolean;
  onRefresh: () => void;
}

export function FilterBar(props: FilterBarProps): JSX.Element {
  const { componentCount, alertCount, lastUpdatedAt, refreshing = false, onRefresh } = props;

  return (
    <div className="glass mb-5 flex flex-col gap-4 rounded-2xl border border-slate-200/70 p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
      <div className="space-y-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">System Overview</p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900 md:text-3xl">系统总览</h1>
          <p className="mt-2 text-sm text-slate-600">集中查看组件规模、调用体量、健康度与当前告警态势。</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Tag color="blue" className="rounded-md px-2 py-1">
            组件 {componentCount}
          </Tag>
          <Tag color={alertCount > 0 ? 'warning' : 'success'} className="rounded-md px-2 py-1">
            {alertCount > 0 ? `告警 ${alertCount}` : '当前无告警'}
          </Tag>
          <span className="text-sm text-slate-500">最近更新时间 {formatDateTime(lastUpdatedAt)}</span>
          <span className="text-sm text-slate-400">{formatRelativeTime(lastUpdatedAt)}</span>
        </div>
      </div>

      <div className="flex flex-col gap-3 lg:items-end">
        <RealTimeIndicator text="实时流已接入" />
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 lg:justify-end">
          <span>数据每 3 秒自动刷新，可手动拉取最新全量快照</span>
          <Button type="default" icon={<RefreshCw size={16} />} loading={refreshing} onClick={onRefresh}>
            立即刷新
          </Button>
        </div>
      </div>
    </div>
  );
}
