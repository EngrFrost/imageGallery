import React, { useState } from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useGetImagesQuery } from "../../../api/imageApi";

const { Content, Sider } = Layout;

const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { refetch } = useGetImagesQuery({});

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        breakpoint="lg"
        collapsedWidth={collapsed ? 80 : 0}
        onBreakpoint={(broken) => {
          setCollapsed(broken);
        }}
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={250}
        theme="dark"
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <Sidebar onUpload={refetch} />
      </Sider>
      <Layout
        style={{
          marginLeft: collapsed ? 0 : 250,
          transition: "margin-left 0.2s",
        }}
      >
        <Header collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
        <Content style={{ padding: "24px", margin: 0, overflow: "initial" }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
