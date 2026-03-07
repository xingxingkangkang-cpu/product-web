/**
 * Shared type definitions for product perception system.
 */

export type ComponentStatus = 'healthy' | 'warning' | 'error';

export interface ComponentItem {
  componentId: string;
  name: string;
  version: string;
  status: ComponentStatus;
  healthScore: number;
  todayCalls: number;
  totalCalls: number;
  successRate: number;
  avgLatency: number;
  lastUpdate: string;
}

export interface SceneItem {
  sceneId: string;
  componentId: string;
  sceneCode: string;
  sceneName: string;
  businessOwner: string;
  techOwner: string;
  todayCalls: number;
  totalCalls: number;
  successRate: number;
  avgLatency: number;
}

export interface MetricPoint {
  timestamp: string;
  qps: number;
  p50: number;
  p95: number;
  p99: number;
  errorRate: number;
  cpu: number;
  memory: number;
}

export interface PatternCluster {
  label: string;
  scenes: string[];
  latencyBox: [number, number, number, number, number];
}

export interface PatternData {
  clusters: PatternCluster[];
  paramDistributions: Array<{
    scene: string;
    param: string;
    value: number;
  }>;
}

export interface SceneFilterConfig {
  field: string;
  label: string;
  type: 'input' | 'daterange' | 'select';
  placeholder?: string;
  options?: Array<{ label: string; value: string }>;
}

export interface SceneTableColumnConfig {
  field: string;
  label: string;
  width?: number;
  render?: 'json';
  sorter?: boolean;
}

export interface SceneChartConfig {
  type: 'line' | 'pie';
  x: string;
  y: string;
  title: string;
}

export interface SceneDetailConfig {
  title: string;
  filters: SceneFilterConfig[];
  table: {
    columns: SceneTableColumnConfig[];
    pageSize: number;
  };
  charts: SceneChartConfig[];
}
