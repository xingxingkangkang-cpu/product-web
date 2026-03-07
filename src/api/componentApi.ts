/**
 * API methods for components, scenes and metrics.
 */
import type { ComponentItem, MetricPoint, PatternData, SceneDetailConfig, SceneItem } from '@/types';
import { request } from '@/api/http';

export function getComponents(): Promise<ComponentItem[]> {
  return request<ComponentItem[]>('/api/components');
}

export function getComponentById(componentId: string): Promise<ComponentItem> {
  return request<ComponentItem>(`/api/components/${componentId}`);
}

export function getScenes(componentId?: string): Promise<SceneItem[]> {
  const query = componentId ? `?componentId=${encodeURIComponent(componentId)}` : '';
  return request<SceneItem[]>(`/api/scenes${query}`);
}

export function getPatterns(componentId: string): Promise<PatternData> {
  return request<PatternData>(`/api/patterns/${componentId}`);
}

export function getMetrics(componentId: string): Promise<MetricPoint[]> {
  return request<MetricPoint[]>(`/api/metrics/${componentId}`);
}

export function getSceneConfig(sceneId: string, componentId: string): Promise<SceneDetailConfig> {
  return request<SceneDetailConfig>(`/api/scene-config/${sceneId}/${componentId}`);
}
