/**
 * MSW handlers for mock APIs.
 */
import { delay, http, HttpResponse } from 'msw';
import {
  findComponentById,
  findSceneConfig,
  getPatternsData,
  listComponents,
  listMetrics,
  listScenes,
} from '@/mock/repository';

export const handlers = [
  http.get('/api/components', async () => {
    await delay(300);
    return HttpResponse.json(listComponents());
  }),

  http.get('/api/components/:id', async ({ params }) => {
    const componentId = String(params.id ?? '');
    const component = findComponentById(componentId) ?? listComponents()[0];

    await delay(300);
    return HttpResponse.json(component);
  }),

  http.get('/api/scenes', async ({ request }) => {
    const url = new URL(request.url);
    const componentId = url.searchParams.get('componentId') ?? undefined;

    await delay(400);
    return HttpResponse.json(listScenes(componentId));
  }),

  http.get('/api/patterns/:componentId', async () => {
    await delay(200);
    return HttpResponse.json(getPatternsData());
  }),

  http.get('/api/metrics/:componentId', async ({ params }) => {
    const componentId = String(params.componentId ?? '');

    await delay(500);
    return HttpResponse.json(listMetrics(componentId));
  }),

  http.get('/api/scene-config/:sceneId/:componentId', async ({ params }) => {
    const sceneId = String(params.sceneId ?? '');
    const componentId = String(params.componentId ?? '');

    await delay(300);
    return HttpResponse.json(findSceneConfig(sceneId, componentId));
  }),
];
