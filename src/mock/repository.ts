/**
 * Shared mock data accessors for MSW and local fallback.
 */
import componentsData from '@/mock/data/components.json';
import metricsData from '@/mock/data/metrics.json';
import sceneConfigsData from '@/mock/data/scene-configs.json';
import scenesData from '@/mock/data/scenes.json';
import type { ComponentItem, MetricPoint, PatternData, SceneDetailConfig, SceneItem } from '@/types';

const components = componentsData as ComponentItem[];
const scenes = scenesData as SceneItem[];
const metricSets = metricsData as Array<{ componentId: string; data: MetricPoint[] }>;
const sceneConfigs = sceneConfigsData as Array<{
  sceneId: string;
  componentId?: string;
  config: SceneDetailConfig;
}>;

function cloneList<T>(items: T[]): T[] {
  return items.map((item) => ({ ...item }));
}

function cloneObject<T>(value: T): T {
  if (typeof structuredClone === 'function') {
    return structuredClone(value);
  }

  return JSON.parse(JSON.stringify(value)) as T;
}

export function listComponents(): ComponentItem[] {
  return cloneList(components);
}

export function findComponentById(componentId: string): ComponentItem | undefined {
  const component = components.find((item) => item.componentId === componentId);

  return component ? { ...component } : undefined;
}

export function listScenes(componentId?: string): SceneItem[] {
  const filteredScenes = componentId
    ? scenes.filter((item) => item.componentId === componentId)
    : scenes;

  return cloneList(filteredScenes);
}

export function getPatternsData(): PatternData {
  return {
    clusters: [],
    paramDistributions: [],
  };
}

export function listMetrics(componentId: string): MetricPoint[] {
  const match = metricSets.find((item) => item.componentId === componentId);

  return match ? cloneList(match.data) : [];
}

export function findSceneConfig(sceneId: string, componentId: string): SceneDetailConfig {
  const matchedConfig = sceneConfigs.find(
    (item) => item.sceneId === sceneId && (!item.componentId || item.componentId === componentId),
  );

  return matchedConfig
    ? cloneObject(matchedConfig.config)
    : {
        title: '默认配置',
        filters: [],
        table: { columns: [], pageSize: 10 },
        charts: [],
      };
}
