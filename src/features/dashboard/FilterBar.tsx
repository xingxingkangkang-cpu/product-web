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
    <div className="hero-panel mb-6 flex flex-col gap-6 rounded-[30px] p-6 md:p-7 lg:flex-row lg:items-center lg:justify-between">
      <div className="space-y-3">
        <div>
          <p className="label-eyebrow">System Overview</p>
          <h1 className="mt-2 text-[30px] font-semibold tracking-tight text-slate-950 md:text-[38px]">系统总览</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 md:text-[15px]">
            集中查看组件规模、调用体量、健康度与当前告警态势，让关键风险与运行趋势在同一视图内完成闭环判断。
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Tag color="blue" className="app-tag app-tag-blue !m-0">
            组件 {componentCount}
          </Tag>
          <Tag
            color={alertCount > 0 ? 'warning' : 'success'}
            className={`app-tag !m-0 ${alertCount > 0 ? 'app-tag-warning' : 'app-tag-success'}`}
          >
            {alertCount > 0 ? `告警 ${alertCount}` : '当前无告警'}
          </Tag>
          <span className="status-chip text-sm">最近更新时间 {formatDateTime(lastUpdatedAt)}</span>
          <span className="status-chip text-sm">{formatRelativeTime(lastUpdatedAt)}</span>
        </div>
      </div>

      <div className="flex flex-col gap-3 lg:min-w-[320px] lg:items-end">
        <RealTimeIndicator text="实时流已接入" />
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 lg:justify-end">
          <span className="status-chip">数据每 3 秒自动刷新</span>
          <Button
            type="default"
            icon={<RefreshCw size={16} />}
            loading={refreshing}
            onClick={onRefresh}
            className="action-button h-11 px-5"
          >
            立即刷新
          </Button>
        </div>
      </div>
    </div>
  );
}
