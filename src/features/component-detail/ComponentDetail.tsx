/**
 * Component detail page with compact sidebar switcher and perspective menu.
 */
import { Layout, Menu, Select, Spin, Tag, Typography, message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getComponents } from '@/api/componentApi';
import { PatternPerspective } from '@/features/component-detail/perspectives/PatternPerspective';
import { ScenePerspective } from '@/features/component-detail/perspectives/ScenePerspective';
import { SystemPerspective } from '@/features/component-detail/perspectives/SystemPerspective';
import { useComponentStore } from '@/stores/componentStore';
import type { ComponentItem } from '@/types';
import { formatNumber, formatPercent, formatRelativeTime } from '@/utils/format';

const { Sider, Content } = Layout;

const statusConfig: Record<ComponentItem['status'], { label: string; color: string }> = {
  healthy: { label: '健康', color: 'success' },
  warning: { label: '预警', color: 'warning' },
  error: { label: '异常', color: 'error' },
};

export function ComponentDetail(): JSX.Element {
  const navigate = useNavigate();
  const { componentId = 'comp_001' } = useParams<{ componentId: string }>();
  const [current, setCurrent] = useState<'scene' | 'pattern' | 'system'>('scene');
  const [loadingOptions, setLoadingOptions] = useState(false);

  const components = useComponentStore((state) => state.components);
  const setComponents = useComponentStore((state) => state.setComponents);
  const setSelectedComponentId = useComponentStore((state) => state.setSelectedComponentId);

  useEffect(() => {
    setSelectedComponentId(componentId);
  }, [componentId, setSelectedComponentId]);

  useEffect(() => {
    let alive = true;
    const hasCurrentComponent = components.some((item) => item.componentId === componentId);

    if (components.length > 0 && hasCurrentComponent) {
      return () => {
        alive = false;
      };
    }

    const loadComponents = async () => {
      setLoadingOptions(true);
      try {
        const data = await getComponents();
        if (alive) {
          setComponents(data);
        }
      } catch (error) {
        message.error((error as Error).message || '加载组件信息失败');
      } finally {
        if (alive) {
          setLoadingOptions(false);
        }
      }
    };

    void loadComponents();

    return () => {
      alive = false;
    };
  }, [componentId, components, setComponents]);

  const title = useMemo(() => {
    if (current === 'scene') return '对接场景感知';
    if (current === 'pattern') return '使用模式感知';
    return '系统运行感知';
  }, [current]);

  const currentComponent = useMemo(
    () => components.find((item) => item.componentId === componentId),
    [componentId, components],
  );

  const componentOptions = useMemo(
    () =>
      components.map((item) => ({
        label: `${item.name} · ${item.componentId}`,
        value: item.componentId,
      })),
    [components],
  );

  const handleComponentChange = (nextComponentId: string): void => {
    setSelectedComponentId(nextComponentId);
    navigate(`/component/${nextComponentId}`);
  };

  const statusMeta = currentComponent ? statusConfig[currentComponent.status] : undefined;

  return (
    <Layout className="detail-shell overflow-hidden rounded-[30px] border-0 bg-transparent">
      <Sider width={300} className="!bg-transparent p-0">
        <div className="side-panel mr-0 rounded-[28px] p-4 md:mr-4">
          <div className="enterprise-panel mb-4 rounded-[24px] border-0 p-4 shadow-none">
            <p className="label-eyebrow mb-2">Component Insight</p>
            <Typography.Title level={5} className="!mt-2 !mb-1 !text-slate-950">
              {currentComponent?.name ?? '组件详情'}
            </Typography.Title>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              {statusMeta ? <Tag color={statusMeta.color} className={`app-tag ${statusMeta.color === 'success' ? 'app-tag-success' : statusMeta.color === 'warning' ? 'app-tag-warning' : 'app-tag-neutral'}`}>{statusMeta.label}</Tag> : null}
              {currentComponent ? <Tag color="blue" className="app-tag app-tag-blue">{currentComponent.version}</Tag> : null}
            </div>

            <Select
              className="detail-select w-full"
              showSearch
              value={currentComponent?.componentId ?? componentId}
              options={componentOptions}
              loading={loadingOptions}
              placeholder="切换组件"
              optionFilterProp="label"
              onChange={handleComponentChange}
              notFoundContent={loadingOptions ? <Spin size="small" /> : '暂无组件'}
            />

            <div className="mt-4 space-y-2 rounded-[20px] bg-slate-950/[0.03] p-4 text-xs">
              <div className="flex items-center justify-between gap-2 text-slate-500">
                <span>组件标识</span>
                <span className="font-medium text-slate-800">{componentId}</span>
              </div>
              <div className="flex items-center justify-between gap-2 text-slate-500">
                <span>健康分</span>
                <span className="font-medium text-slate-800">{currentComponent ? `${currentComponent.healthScore} 分` : '--'}</span>
              </div>
              <div className="flex items-center justify-between gap-2 text-slate-500">
                <span>成功率</span>
                <span className="font-medium text-slate-800">
                  {currentComponent ? formatPercent(currentComponent.successRate) : '--'}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 text-slate-500">
                <span>累计调用</span>
                <span className="font-medium text-slate-800">
                  {currentComponent ? formatNumber(currentComponent.totalCalls) : '--'}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 text-slate-500">
                <span>最近更新</span>
                <span className="font-medium text-slate-800">
                  {currentComponent ? formatRelativeTime(currentComponent.lastUpdate) : '等待数据'}
                </span>
              </div>
            </div>
          </div>

          <Menu
            mode="inline"
            selectedKeys={[current]}
            onClick={(event) => setCurrent(event.key as 'scene' | 'pattern' | 'system')}
            items={[
              { key: 'scene', label: '对接场景感知' },
              { key: 'pattern', label: '使用模式感知' },
              { key: 'system', label: '系统运行感知' },
            ]}
            className="side-menu rounded-[24px] border-0 bg-transparent"
          />
        </div>
      </Sider>

      <Content className="min-h-[760px] p-0">
        <div className="enterprise-panel h-full rounded-[28px] border-0 p-6 md:p-7">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/70 pb-4">
            <div>
              <p className="label-eyebrow mb-2">Perspective View</p>
              <Typography.Title level={4} className="!mb-1 !text-slate-950">
                {title}
              </Typography.Title>
              <Typography.Paragraph className="!mb-0 text-slate-500">
                {currentComponent ? `当前组件：${currentComponent.name}` : `当前组件 ID：${componentId}`}
              </Typography.Paragraph>
            </div>
            {statusMeta ? <Tag color={statusMeta.color} className={`app-tag ${statusMeta.color === 'success' ? 'app-tag-success' : statusMeta.color === 'warning' ? 'app-tag-warning' : 'app-tag-neutral'}`}>{statusMeta.label}</Tag> : null}
          </div>

          {current === 'scene' ? <ScenePerspective componentId={componentId} /> : null}
          {current === 'pattern' ? <PatternPerspective componentId={componentId} /> : null}
          {current === 'system' ? <SystemPerspective componentId={componentId} /> : null}
        </div>
      </Content>
    </Layout>
  );
}
