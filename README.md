# product-perception-system

产品感知系统前端演示工程，基于 React 18、TypeScript 和 Vite 构建，当前使用 MSW 模拟接口数据，并在拦截不可用时自动回退到本地 mock 数据，适合用于原型展示、界面联调和前端能力验证。

## 项目特性

- 组件总览首页，支持筛选、实时状态展示和指标卡片浏览
- 组件详情页，支持场景感知、模式感知、系统感知三类视角切换
- 场景详情页，根据配置动态渲染筛选项、表格和图表
- 使用 MSW 拦截接口请求，并在拦截不可用时自动回退到本地 mock 数据
- 结合 Ant Design、ECharts 和 Framer Motion 提供较完整的交互体验

## 技术栈

- React 18（函数组件 + Hooks）
- TypeScript（`strict: true`）
- Vite
- React Router v6
- Ant Design 5（`antd` + `@ant-design/pro-components`）
- Zustand
- ECharts 5（`echarts` + `echarts-for-react`）
- Tailwind CSS 3.4
- MSW
- Framer Motion
- react-countup
- `@ant-design/icons`、`lucide-react`

## 快速开始

```bash
npm install
npm run dev
```

开发地址默认：`http://localhost:5173`

## 常用命令

```bash
npm run dev        # 启动开发环境
npm run typecheck  # TypeScript 类型检查
npm run lint       # ESLint 检查
npm run build      # 生产构建
npm run preview    # 预览构建产物
```

## 路由说明

- `/dashboard`：组件总览页
- `/component/:componentId`：组件详情页
- `/scene/:sceneId/:componentId`：场景详情页

## 项目结构

```text
public/
└── mockServiceWorker.js

src/
├── api/
├── components/
│   ├── charts/
│   ├── common/
│   └── layout/
├── features/
│   ├── component-detail/
│   ├── dashboard/
│   └── scene-detail/
├── hooks/
├── mock/
│   └── data/
├── stores/
├── styles/
├── types/
├── utils/
├── App.tsx
├── index.css
└── main.tsx
```

## 页面说明

- `Dashboard`：组件总览卡片、筛选栏、实时连接指示器、实时数据更新
- `ComponentDetail`：三视角切换
- 场景感知：Top 场景柱状图 + ProTable
- 模式感知：热力图 + 聚类卡片 + 箱线图
- 系统感知：双 Y 轴时序图 + 错误码表格 + 拓扑占位区
- `SceneDetail`：根据场景配置动态渲染筛选表单、表格和图表

## 模拟数据与接口

模拟数据位于 `src/mock/data/`，开发环境中优先由 MSW 拦截请求；若当前运行环境未成功拦截 `/api/*`，前端会自动回退到同一份本地 mock 数据。

当前接口包括：

- `GET /api/components`
- `GET /api/components/:id`
- `GET /api/scenes?componentId=...`
- `GET /api/patterns/:componentId`
- `GET /api/metrics/:componentId`
- `GET /api/scene-config/:sceneId/:componentId`

## 开发说明

- `src/main.tsx` 中仅在开发环境启动 MSW；接口层同时内置本地 mock fallback，避免静态预览时将 HTML 误当 JSON 解析
- `public/mockServiceWorker.js` 为 MSW Worker 文件，需要保留在仓库中
- `dist/`、`node_modules/`、`*.tsbuildinfo` 等构建产物或缓存文件不应提交

## 说明

- 当前为 Demo 工程，后端数据全部为模拟数据
- 若生产构建提示 chunk 体积较大，主要来自 ECharts 与 ProComponents，属于可预期现象
