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
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 8,
          colorBgLayout: '#f1f5f9',
          boxShadowSecondary: '0 12px 32px rgba(15, 23, 42, 0.08)',
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
