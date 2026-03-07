/**
 * Skeleton placeholder card for dashboard loading.
 */
import { Skeleton } from 'antd';

export interface SkeletonCardProps {
  count?: number;
}

export function SkeletonCard(props: SkeletonCardProps): JSX.Element {
  const { count = 1 } = props;

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={`skeleton-${index}`} className="card-hover rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <Skeleton active title paragraph={{ rows: 1 }} />
          <div className="mt-4">
            <Skeleton.Input active block className="!h-8" />
          </div>
          <div className="mt-3">
            <Skeleton.Input active block className="!h-8" />
          </div>
          <div className="mt-4">
            <Skeleton.Input active block className="!h-16" />
          </div>
        </div>
      ))}
    </>
  );
}
