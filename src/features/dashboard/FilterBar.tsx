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
    <div className="hero-panel mb-4 flex flex-col gap-4 rounded-[24px] px-5 py-4 md:px-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="min-w-0 space-y-2">
        <div className="flex flex-col gap-2 xl:flex-row xl:items-center xl:gap-3">
          <h1 className="text-[22px] font-semibold tracking-tight text-slate-950 md:text-[26px]">系统总览</h1>

          <div className="flex flex-wrap items-center gap-2">
            <Tag color="blue" className="app-tag app-tag-blue !m-0">
              组件 {componentCount}
            </Tag>
            <Tag
              color={alertCount > 0 ? 'warning' : 'success'}
              className={`app-tag !m-0 ${alertCount > 0 ? 'app-tag-warning' : 'app-tag-success'}`}
            >
              {alertCount > 0 ? `告警 ${alertCount}` : '当前无告警'}
            </Tag>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="status-chip status-chip-compact text-xs">最近更新时间 {formatDateTime(lastUpdatedAt)}</span>
          <span className="status-chip status-chip-compact text-xs">{formatRelativeTime(lastUpdatedAt)}</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 lg:justify-end">
        <RealTimeIndicator text="实时流已接入" compact />
        <span className="status-chip status-chip-compact text-xs">3 秒自动刷新</span>
        <Button
          type="default"
          icon={<RefreshCw size={14} />}
          loading={refreshing}
          onClick={onRefresh}
          className="action-button action-button-compact px-4"
        >
          刷新
        </Button>
      </div>
    </div>
  );
}
