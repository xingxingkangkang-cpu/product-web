/**
 * Application routes and global providers.
 */
import { ConfigProvider } from 'antd';
import { Navigate, Route, Routes } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { ComponentDetail } from '@/features/component-detail/ComponentDetail';
import { Dashboard } from '@/features/dashboard/Dashboard';
import { SceneDetail } from '@/features/scene-detail/SceneDetail';

export default function App(): JSX.Element {
  return (
    <ConfigProvider
      theme={{
        cssVar: true,
        token: {
          colorPrimary: '#2563eb',
          colorInfo: '#2563eb',
          colorSuccess: '#059669',
          colorWarning: '#d97706',
          colorError: '#dc2626',
          colorText: '#0f172a',
          colorTextSecondary: '#475569',
          colorBorder: 'rgba(148, 163, 184, 0.2)',
          colorBgLayout: '#edf3f9',
          colorBgContainer: 'rgba(255, 255, 255, 0.84)',
          borderRadius: 18,
          borderRadiusLG: 24,
          boxShadowSecondary: '0 24px 60px rgba(15, 23, 42, 0.12)',
        },
        components: {
          Card: {
            borderRadiusLG: 24,
          },
          Button: {
            controlHeight: 40,
            borderRadius: 14,
          },
          Select: {
            controlHeight: 42,
            borderRadius: 14,
          },
          Menu: {
            itemBorderRadius: 14,
            activeBarHeight: 0,
          },
          Tag: {
            borderRadiusSM: 999,
          },
        },
      }}
    >
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="component/:componentId" element={<ComponentDetail />} />
          <Route path="scene/:sceneId/:componentId" element={<SceneDetail />} />
        </Route>
      </Routes>
    </ConfigProvider>
  );
}
