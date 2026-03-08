/**
 * API methods for components, scenes and metrics.
 */
import { HttpResponseError, request } from '@/api/http';
import {
  findComponentById,
  findSceneConfig,
  getPatternsData,
  listComponents,
  listMetrics,
  listScenes,
} from '@/mock/repository';
import type { ComponentItem, MetricPoint, PatternData, SceneDetailConfig, SceneItem } from '@/types';

async function requestWithMockFallback<T>(url: string, fallback: () => T): Promise<T> {
  try {
    return await request<T>(url);
  } catch (error) {
    if (error instanceof HttpResponseError || error instanceof TypeError) {
      console.warn(`[API] Falling back to local mock data for ${url}.`, error);
      return fallback();
    }

    throw error;
  }
}

export function getComponents(): Promise<ComponentItem[]> {
  return requestWithMockFallback<ComponentItem[]>('/api/components', () => listComponents());
}

export function getComponentById(componentId: string): Promise<ComponentItem> {
  return requestWithMockFallback<ComponentItem>(`/api/components/${componentId}`, () => {
    return findComponentById(componentId) ?? listComponents()[0];
  });
}

export function getScenes(componentId?: string): Promise<SceneItem[]> {
  const query = componentId ? `?componentId=${encodeURIComponent(componentId)}` : '';

  return requestWithMockFallback<SceneItem[]>(`/api/scenes${query}`, () => listScenes(componentId));
}

export function getPatterns(componentId: string): Promise<PatternData> {
  return requestWithMockFallback<PatternData>(`/api/patterns/${componentId}`, () => getPatternsData());
}

export function getMetrics(componentId: string): Promise<MetricPoint[]> {
  return requestWithMockFallback<MetricPoint[]>(`/api/metrics/${componentId}`, () => listMetrics(componentId));
}

export function getSceneConfig(sceneId: string, componentId: string): Promise<SceneDetailConfig> {
  return requestWithMockFallback<SceneDetailConfig>(`/api/scene-config/${sceneId}/${componentId}`, () => {
    return findSceneConfig(sceneId, componentId);
  });
}
