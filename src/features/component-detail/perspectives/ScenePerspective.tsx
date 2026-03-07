/**
 * Scene perspective with top chart and filtered table.
 */
import { Button, Card, message } from 'antd';
import type { ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import type { EChartsOption } from 'echarts';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getScenes } from '@/api/componentApi';
import { BaseChart } from '@/components/charts/BaseChart';
import type { SceneItem } from '@/types';
import { maskName } from '@/utils/mask';

export interface ScenePerspectiveProps {
  componentId: string;
}

export function ScenePerspective(props: ScenePerspectiveProps): JSX.Element {
  const { componentId } = props;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [scenes, setScenes] = useState<SceneItem[]>([]);
  const [selectedSceneCode, setSelectedSceneCode] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    const load = async () => {
      setLoading(true);
      try {
        const data = await getScenes(componentId);
        if (alive) {
          setScenes(data);
        }
      } catch (error) {
        message.error((error as Error).message || '加载场景数据失败');
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
  }, [componentId]);

  const topScenes = useMemo(() => [...scenes].sort((a, b) => b.todayCalls - a.todayCalls).slice(0, 10), [scenes]);

  const filteredScenes = useMemo(() => {
    if (!selectedSceneCode) return scenes;
    return scenes.filter((item) => item.sceneCode === selectedSceneCode);
  }, [scenes, selectedSceneCode]);

  const chartOption: EChartsOption = {
    xAxis: {
      type: 'category',
      data: topScenes.map((item) => item.sceneCode),
      axisLine: { lineStyle: { color: '#cbd5e1' } },
      axisLabel: { rotate: 20 },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { type: 'dashed', color: '#e2e8f0' } },
    },
    series: [
      {
        type: 'bar',
        data: topScenes.map((item) => item.todayCalls),
        barWidth: 28,
        itemStyle: {
          borderRadius: [6, 6, 0, 0],
          color: '#1677ff',
        },
      },
    ],
  };

  const columns: ProColumns<SceneItem>[] = [
    { title: '场景编码', dataIndex: 'sceneCode', width: 160 },
    { title: '场景名称', dataIndex: 'sceneName', width: 140 },
    {
      title: '负责人',
      dataIndex: 'owner',
      width: 170,
      render: (_, row) => `${maskName(row.businessOwner)} / ${maskName(row.techOwner)}`,
    },
    { title: '今日调用量', dataIndex: 'todayCalls', valueType: 'digit', width: 130 },
    {
      title: '成功率',
      dataIndex: 'successRate',
      width: 100,
      render: (_, row) => `${row.successRate.toFixed(1)}%`,
    },
    { title: '平均延迟(ms)', dataIndex: 'avgLatency', valueType: 'digit', width: 120 },
    {
      title: '操作',
      valueType: 'option',
      width: 120,
      render: (_, row) => [
        <Button
          key="detail"
          size="small"
          type="link"
          onClick={() => window.open(`/scene/${row.sceneId}/${row.componentId}`, '_blank')}
        >
          明细
        </Button>,
        <Button key="inside" size="small" type="link" onClick={() => navigate(`/scene/${row.sceneId}/${row.componentId}`)}>
          打开
        </Button>,
      ],
    },
  ];

  return (
    <div className="space-y-4">
      <Card className="rounded-xl border border-slate-200 shadow-sm" bodyStyle={{ padding: 12 }}>
        <div className="mb-2 flex items-center justify-between">
          <h4 className="text-sm font-medium text-slate-700">Top 10 场景调用量</h4>
          {selectedSceneCode ? (
            <Button size="small" onClick={() => setSelectedSceneCode(null)}>
              清除筛选
            </Button>
          ) : null}
        </div>
        <BaseChart
          option={chartOption}
          height={260}
          loading={loading}
          onEvents={{
            click: (params) => {
              const payload = params as { name?: string };
              if (payload.name) {
                setSelectedSceneCode(payload.name);
              }
            },
          }}
        />
      </Card>

      <ProTable<SceneItem>
        rowKey="sceneId"
        columns={columns}
        dataSource={filteredScenes}
        loading={loading}
        search={false}
        options={false}
        pagination={{ pageSize: 8 }}
        className="rounded-xl"
      />
    </div>
  );
}
