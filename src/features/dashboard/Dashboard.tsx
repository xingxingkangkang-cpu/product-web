/**
 * Dashboard page with filter bar, summary cards and component list.
 */
import { Col, Empty, Row, Tag, message } from 'antd';
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

  const alertCount = useMemo(() => components.filter((item) => item.status !== 'healthy').length, [components]);
  const orderedComponents = useMemo(() => [...components].sort(sortComponents), [components]);

  const handleCardClick = (componentId: string): void => {
    setSelectedComponentId(componentId);
    navigate(`/component/${componentId}`);
  };

  return (
    <div className="space-y-4">
      <FilterBar
        componentCount={components.length}
        alertCount={alertCount}
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
        <div className="enterprise-panel rounded-[24px] p-10">
          <Empty description="暂无组件数据" />
        </div>
      ) : (
        <div className="space-y-5">
          <section className="space-y-3">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="section-title">全部组件</h2>
                <p className="section-description">组件列表按状态优先级与健康度排序，便于直接查看最需要关注的组件。</p>
              </div>
              <Tag color="blue" className="app-tag app-tag-blue w-fit">
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
