/**
 * Pattern perspective with heatmap and cluster cards.
 */
import { Card, Col, Empty, Row, Tag, message } from 'antd';
import type { EChartsOption } from 'echarts';
import { useEffect, useMemo, useState } from 'react';
import { getPatterns, getScenes } from '@/api/componentApi';
import { BaseChart } from '@/components/charts/BaseChart';
import type { PatternCluster, PatternData, SceneItem } from '@/types';

export interface PatternPerspectiveProps {
  componentId: string;
}

function buildFallbackPattern(scenes: SceneItem[]): PatternData {
  const params = ['region', 'channel', 'platform', 'vipLevel'];
  const distributions = scenes.flatMap((scene, rowIndex) =>
    params.map((param, colIndex) => ({
      scene: scene.sceneCode,
      param,
      value: (rowIndex + 1) * (colIndex + 2) * 8,
    })),
  );

  const clusters: PatternCluster[] = [
    {
      label: '低延迟稳定型',
      scenes: scenes.slice(0, 2).map((item) => item.sceneName),
      latencyBox: [15, 24, 32, 40, 56],
    },
    {
      label: '高峰波动型',
      scenes: scenes.slice(2, 4).map((item) => item.sceneName),
      latencyBox: [40, 75, 130, 190, 280],
    },
  ];

  return {
    clusters,
    paramDistributions: distributions,
  };
}

export function PatternPerspective(props: PatternPerspectiveProps): JSX.Element {
  const { componentId } = props;
  const [loading, setLoading] = useState(false);
  const [patternData, setPatternData] = useState<PatternData>({ clusters: [], paramDistributions: [] });

  useEffect(() => {
    let alive = true;

    const load = async () => {
      setLoading(true);
      try {
        const [patterns, scenes] = await Promise.all([getPatterns(componentId), getScenes(componentId)]);

        if (!alive) return;

        if (patterns.paramDistributions.length === 0 && patterns.clusters.length === 0) {
          setPatternData(buildFallbackPattern(scenes));
        } else {
          setPatternData(patterns);
        }
      } catch (error) {
        message.error((error as Error).message || '加载使用模式数据失败');
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

  const heatmapMeta = useMemo(() => {
    const xAxis = Array.from(new Set(patternData.paramDistributions.map((item) => item.param)));
    const yAxis = Array.from(new Set(patternData.paramDistributions.map((item) => item.scene)));

    const data = patternData.paramDistributions.map((item) => [xAxis.indexOf(item.param), yAxis.indexOf(item.scene), item.value]);

    return { xAxis, yAxis, data };
  }, [patternData]);

  const heatmapOption: EChartsOption = {
    xAxis: {
      type: 'category',
      data: heatmapMeta.xAxis,
      splitArea: { show: true },
    },
    yAxis: {
      type: 'category',
      data: heatmapMeta.yAxis,
      splitArea: { show: true },
    },
    visualMap: {
      min: 0,
      max: 120,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: 0,
      inRange: {
        color: ['#e2e8f0', '#93c5fd', '#1677ff'],
      },
    },
    series: [
      {
        name: '调用次数',
        type: 'heatmap',
        data: heatmapMeta.data,
        label: { show: false },
      },
    ],
  };

  return (
    <div className="space-y-4">
      <Card className="rounded-xl border border-slate-200 shadow-sm" bodyStyle={{ padding: 12 }}>
        <h4 className="mb-2 text-sm font-medium text-slate-700">参数调用热力图</h4>
        {heatmapMeta.data.length === 0 ? (
          <Empty description="暂无热力图数据" />
        ) : (
          <BaseChart option={heatmapOption} height={300} loading={loading} />
        )}
      </Card>

      <Row gutter={[16, 16]}>
        {patternData.clusters.length === 0 ? (
          <Col span={24}>
            <Card className="rounded-xl border border-slate-200 shadow-sm">
              <Empty description="暂无聚类数据" />
            </Card>
          </Col>
        ) : (
          patternData.clusters.map((cluster) => {
            const boxOption: EChartsOption = {
              xAxis: {
                type: 'category',
                data: ['延迟分布'],
              },
              yAxis: {
                type: 'value',
                splitLine: { lineStyle: { type: 'dashed', color: '#e2e8f0' } },
              },
              series: [
                {
                  type: 'boxplot',
                  data: [cluster.latencyBox],
                  itemStyle: {
                    color: '#bae0ff',
                    borderColor: '#1677ff',
                  },
                },
              ],
            };

            return (
              <Col xs={24} md={12} key={cluster.label}>
                <Card className="card-hover rounded-xl border border-slate-200 shadow-sm" bodyStyle={{ padding: 12 }}>
                  <div className="mb-2 flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-slate-800">{cluster.label}</h4>
                    <Tag color="blue">聚类</Tag>
                  </div>
                  <div className="mb-2 flex flex-wrap gap-1.5">
                    {cluster.scenes.map((scene) => (
                      <Tag key={scene} className="rounded-md">
                        {scene}
                      </Tag>
                    ))}
                  </div>
                  <BaseChart option={boxOption} height={220} />
                </Card>
              </Col>
            );
          })
        )}
      </Row>
    </div>
  );
}
