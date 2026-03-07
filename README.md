# product-perception-system

产品感知系统演示工程（前端），基于 React 18 + TypeScript + Vite，全部使用模拟数据（MSW）。

## 技术栈

- React 18（函数组件 + Hooks）
- TypeScript（`strict: true`）
- Vite
- Ant Design 5（`antd` + `@ant-design/pro-components`）
- Zustand
- React Router v6
- ECharts 5（`echarts` + `echarts-for-react`）
- Tailwind CSS 3.4
- MSW（模拟 API）
- Framer Motion（路由动画）
- react-countup（数字滚动）
- 图标：`@ant-design/icons` + `lucide-react`

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

## 项目结构

```text
src/
├── api/
├── assets/
├── components/
│   ├── common/
│   ├── charts/
│   └── layout/
├── features/
│   ├── dashboard/
│   ├── component-detail/
│   └── scene-detail/
├── hooks/
├── mock/
│   └── data/
├── stores/
├── types/
├── utils/
├── styles/
├── App.tsx
├── main.tsx
└── index.css
```

## 页面说明

- `Dashboard`：组件总览卡片、筛选栏、实时连接指示器、实时数据更新。
- `ComponentDetail`：三视角切换。
  - 场景感知：Top 场景柱状图 + ProTable。
  - 模式感知：热力图 + 聚类卡片 + 箱线图。
  - 系统感知：双 Y 轴时序图 + 错误码表格 + 拓扑占位区。
- `SceneDetail`：根据场景配置动态渲染筛选表单、表格和图表。

## 模拟数据与接口

数据位置：`src/mock/data/*.json`

接口（MSW 拦截）：
- `GET /api/components`
- `GET /api/components/:id`
- `GET /api/scenes?componentId=...`
- `GET /api/patterns/:componentId`
- `GET /api/metrics/:componentId`
- `GET /api/scene-config/:sceneId/:componentId`

## 视觉与交互

- 全局主题主色：`#1677ff`，圆角：`8px`
- 玻璃拟态容器：`.glass`
- 渐变文本：`.gradient-text`
- 卡片悬停：`.card-hover`
- 路由切换：Framer Motion 淡入淡出 + 位移动画
- 指标数值：`AnimatedNumber`（支持变化高亮）

## 说明

- 当前为 Demo，后端全部为 MSW 模拟。
- 构建时若提示 chunk 体积较大，主要来自 ECharts 与 ProComponents，属于可预期现象。
