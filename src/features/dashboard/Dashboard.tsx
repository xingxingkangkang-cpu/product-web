/**
 * Dashboard page with filter bar, summary cards and component list.
 */
import { Card, Col, Empty, Row, Tag, message } from 'antd';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getComponents } from '@/api/componentApi';
import { SkeletonCard } from '@/components/common/SkeletonCard';
import { useMockWebSocket } from '@/hooks/useMockWebSocket';
import type { ComponentItem } from '@/types';
import { useComponentStore } from '@/stores/componentStore';
import { ComponentCard } from '@/features/dashboard/ComponentCard';
import { DashboardSummary } from '@/features/dashboard/DashboardSummary';
import { FilterBar } from '@/features/dashboard/FilterBar';

const statusPriority: Record<ComponentItem['status'], number> = {
  error: 0,
  warning: 1,
  healthy: 2,
};

function sortComponents(left: ComponentItem, right: ComponentItem): number {
  return (
    statusPriority[left.status] - statusPriority[right.status] ||
    left.healthScore - right.healthScore ||
    right.todayCalls - left.todayCalls
  );
}

export function Dashboard(): JSX.Element {
  const navigate = useNavigate();
  const mountedRef = useRef(false);
  const components = useComponentStore((state) => state.components);
  const setComponents = useComponentStore((state) => state.setComponents);
  const setSelectedComponentId = useComponentStore((state) => state.setSelectedComponentId);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useMockWebSocket({ enabled: true });

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  const fetchComponents = useCallback(
    async (mode: 'initial' | 'refresh' = 'initial') => {
      if (mode === 'initial') {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      try {
        const data = await getComponents();
        if (mountedRef.current) {
          setComponents(data);
        }
      } catch (error) {
        message.error((error as Error).message || '加载组件数据失败');
      } finally {
        if (!mountedRef.current) {
          return;
        }

        if (mode === 'initial') {
          setLoading(false);
        } else {
          setRefreshing(false);
        }
      }
    },
    [setComponents],
  );

  useEffect(() => {
    void fetchComponents();
  }, [fetchComponents]);

  const latestUpdatedAt = useMemo(() => {
    return components.reduce<string | undefined>((latest, item) => {
      if (!item.lastUpdate) {
        return latest;
      }

      if (!latest) {
        return item.lastUpdate;
      }

      return new Date(item.lastUpdate).getTime() > new Date(latest).getTime() ? item.lastUpdate : latest;
    }, undefined);
  }, [components]);

  const alertComponents = useMemo(() => components.filter((item) => item.status !== 'healthy').sort(sortComponents), [components]);
  const orderedComponents = useMemo(() => [...components].sort(sortComponents), [components]);

  const handleCardClick = (componentId: string): void => {
    setSelectedComponentId(componentId);
    navigate(`/component/${componentId}`);
  };

  return (
    <div className="space-y-5">
      <FilterBar
        componentCount={components.length}
        alertCount={alertComponents.length}
        lastUpdatedAt={latestUpdatedAt}
        refreshing={refreshing}
        onRefresh={() => void fetchComponents('refresh')}
      />

      {!loading ? <DashboardSummary components={components} /> : null}

      {loading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <SkeletonCard count={6} />
        </div>
      ) : components.length === 0 ? (
        <div className="rounded-xl bg-white p-10 shadow-sm">
          <Empty description="暂无组件数据" />
        </div>
      ) : (
        <div className="space-y-5">
          <section className="space-y-3">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">告警组件</h2>
                <p className="text-sm text-slate-500">优先展示当前预警或异常组件，便于第一时间处理。</p>
              </div>
              <Tag color={alertComponents.length > 0 ? 'warning' : 'success'} className="w-fit rounded-md px-2 py-1">
                {alertComponents.length > 0 ? `${alertComponents.length} 个待关注` : '当前无告警'}
              </Tag>
            </div>

            {alertComponents.length > 0 ? (
              <Row gutter={[16, 16]}>
                {alertComponents.map((item) => (
                  <Col key={`alert-${item.componentId}`} xs={24} sm={12} xl={8}>
                    <ComponentCard component={item} onClick={handleCardClick} />
                  </Col>
                ))}
              </Row>
            ) : (
              <Card className="rounded-xl border border-emerald-200 bg-emerald-50/70 shadow-sm" styles={{ body: { padding: 18 } }}>
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-emerald-800">当前暂无告警组件</h3>
                    <p className="mt-1 text-sm text-emerald-700">系统运行平稳，实时流会继续监听新的预警与异常状态。</p>
                  </div>
                  <Tag color="success" className="w-fit rounded-md px-2 py-1">
                    运行平稳
                  </Tag>
                </div>
              </Card>
            )}
          </section>

          <section className="space-y-3">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">全部组件</h2>
                <p className="text-sm text-slate-500">组件列表按状态优先级与健康度排序，告警组件会自动靠前显示。</p>
              </div>
              <Tag color="blue" className="w-fit rounded-md px-2 py-1">
                共 {orderedComponents.length} 个组件
              </Tag>
            </div>

            <Row gutter={[16, 16]}>
              {orderedComponents.map((item) => (
                <Col key={item.componentId} xs={24} sm={12} lg={8}>
                  <ComponentCard component={item} onClick={handleCardClick} />
                </Col>
              ))}
            </Row>
          </section>
        </div>
      )}
    </div>
  );
}
