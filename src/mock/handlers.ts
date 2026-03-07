/**
 * MSW handlers for mock APIs.
 */
import { http, HttpResponse, delay } from 'msw';
import components from '@/mock/data/components.json';
import scenes from '@/mock/data/scenes.json';
import metrics from '@/mock/data/metrics.json';
import sceneConfigs from '@/mock/data/scene-configs.json';

export const handlers = [
  // 组件列表
  http.get('/api/components', async () => {
    await delay(300);
    return HttpResponse.json(components);
  }),

  // 组件详情（简单返回列表中的第一个）
  http.get('/api/components/:id', async ({ params }) => {
    const id = String(params.id ?? '');
    const component =
      (components as Array<Record<string, unknown>>).find((c) => c.componentId === id) ?? components[0];
    await delay(300);
    return HttpResponse.json(component);
  }),

  // 场景列表（按组件过滤）
  http.get('/api/scenes', async ({ request }) => {
    const url = new URL(request.url);
    const componentId = url.searchParams.get('componentId');
    const filtered = componentId
      ? (scenes as Array<Record<string, unknown>>).filter((s) => s.componentId === componentId)
      : scenes;
    await delay(400);
    return HttpResponse.json(filtered);
  }),

  // 使用模式数据（简化：返回空对象即可，前端可以不显示或显示占位）
  http.get('/api/patterns/:componentId', async () => {
    await delay(200);
    return HttpResponse.json({ clusters: [], paramDistributions: [] });
  }),

  // 时序指标数据
  http.get('/api/metrics/:componentId', async ({ params }) => {
    const componentId = String(params.componentId ?? '');
    const item = (metrics as Array<{ componentId: string; data: unknown[] }>).find(
      (m) => m.componentId === componentId,
    );
    await delay(500);
    return HttpResponse.json(item ? item.data : []);
  }),

  // 场景配置
  http.get('/api/scene-config/:sceneId/:componentId', async ({ params }) => {
    const sceneId = String(params.sceneId ?? '');
    const config = (sceneConfigs as Array<{ sceneId: string; config: Record<string, unknown> }>).find(
      (c) => c.sceneId === sceneId,
    );
    await delay(300);
    return HttpResponse.json(
      config
        ? config.config
        : {
            title: '默认配置',
            filters: [],
            table: { columns: [], pageSize: 10 },
            charts: [],
          },
    );
  }),
];
