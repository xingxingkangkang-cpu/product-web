/**
 * Main layout shell with top navigation.
 */
import { AppstoreOutlined, DashboardOutlined } from '@ant-design/icons';
import { Layout, Menu, Typography } from 'antd';
import { AnimatePresence, motion } from 'framer-motion';
import { useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const { Header, Content } = Layout;

export function MainLayout(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedKey = useMemo(() => {
    if (location.pathname.startsWith('/component')) {
      return 'component';
    }

    if (location.pathname.startsWith('/scene')) {
      return 'scene';
    }

    return 'dashboard';
  }, [location.pathname]);

  return (
    <Layout className="enterprise-shell min-h-screen bg-transparent">
      <div className="floating-nav-shell">
        <Header className="glass enterprise-header relative z-10 mx-auto rounded-[28px] px-4 md:px-6">
          <div className="mx-auto flex h-full max-w-[1600px] items-center justify-between">
            <div>
              <p className="label-eyebrow mb-1">Enterprise Insight Console</p>
              <Typography.Title level={4} className="!m-0 gradient-text">
                产品感知系统
              </Typography.Title>
            </div>
            <Menu
              mode="horizontal"
              selectedKeys={[selectedKey]}
              items={[
                {
                  key: 'dashboard',
                  icon: <DashboardOutlined />,
                  label: '系统总览',
                  onClick: () => navigate('/dashboard'),
                },
                {
                  key: 'component',
                  icon: <AppstoreOutlined />,
                  label: '组件详情',
                  onClick: () => navigate('/component/comp_001'),
                },
              ]}
              className="nav-menu border-none bg-transparent"
            />
          </div>
        </Header>
      </div>
      <Content className="relative z-0 mx-auto w-full max-w-[1600px] px-4 py-8 md:px-6 md:pt-10">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="pb-6"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </Content>
    </Layout>
  );
}
