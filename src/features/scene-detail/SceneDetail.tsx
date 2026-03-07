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
    <div className="space-y-4">
      <Breadcrumb
        items={[
          { title: <Link to="/dashboard">首页</Link> },
          { title: <Link to={`/component/${componentId}`}>组件详情</Link> },
          { title: '场景明细' },
        ]}
      />

      <Card className="rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">{config?.title || '场景明细'}</h2>
        <p className="mt-1 text-sm text-slate-500">
          Scene ID: {sceneId} | Component ID: {componentId}
        </p>
      </Card>

      {loading ? (
        <div className="rounded-xl bg-white p-10 text-center shadow-sm">
          <Spin />
        </div>
      ) : config ? (
        <DynamicRenderer config={config} />
      ) : (
        <Card className="rounded-xl border border-slate-200 shadow-sm">
          <Empty description="暂无场景配置" />
        </Card>
      )}
    </div>
  );
}
