/**
 * Scene detail page based on dynamic scene configuration.
 */
import { Breadcrumb, Card, Empty, Spin, message } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getSceneConfig } from '@/api/componentApi';
import { DynamicRenderer } from '@/features/scene-detail/DynamicRenderer';
import type { SceneDetailConfig } from '@/types';

export function SceneDetail(): JSX.Element {
  const { sceneId = '', componentId = '' } = useParams<{ sceneId: string; componentId: string }>();

  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<SceneDetailConfig | null>(null);

  useEffect(() => {
    let alive = true;

    const load = async () => {
      setLoading(true);
      try {
        const data = await getSceneConfig(sceneId, componentId);
        if (alive) {
          setConfig(data);
        }
      } catch (error) {
        message.error((error as Error).message || '加载场景配置失败');
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      alive = false;
    };
  }, [sceneId, componentId]);

  return (
    <div className="scene-shell">
      <Breadcrumb
        className="scene-breadcrumb w-fit"
        items={[
          { title: <Link to="/dashboard">首页</Link> },
          { title: <Link to={`/component/${componentId}`}>组件详情</Link> },
          { title: '场景明细' },
        ]}
      />

      <Card className="scene-title-panel rounded-[28px] border-0" styles={{ body: { padding: 24 } }}>
        <p className="label-eyebrow mb-2">Scene Detail</p>
        <h2 className="text-[28px] font-semibold tracking-tight text-slate-900">{config?.title || '场景明细'}</h2>
        <p className="mt-2 text-sm text-slate-500">
          Scene ID: {sceneId} | Component ID: {componentId}
        </p>
      </Card>

      {loading ? (
        <div className="enterprise-panel rounded-[24px] p-10 text-center">
          <Spin />
        </div>
      ) : config ? (
        <DynamicRenderer config={config} />
      ) : (
        <Card className="enterprise-panel rounded-[24px] border-0">
          <Empty description="暂无场景配置" />
        </Card>
      )}
    </div>
  );
}
