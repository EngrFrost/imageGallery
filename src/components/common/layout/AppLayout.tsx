import React, { useState, useEffect } from "react";
import { Layout, Drawer } from "antd";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const { Content } = Layout;

const AppLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <Layout style={{ minHeight: "100vh" }} className="bg-gray-50">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <div className="fixed left-0 top-0 h-full w-64 bg-gray-900 z-20 shadow-xl">
          <Sidebar />
        </div>
      )}

      {/* Mobile Sidebar Drawer */}
      {isMobile && (
        <Drawer
          title={null}
          placement="left"
          onClose={() => setMobileMenuOpen(false)}
          open={mobileMenuOpen}
          width={280}
          className="mobile-sidebar"
          bodyStyle={{ padding: 0, backgroundColor: "#1f2937" }}
        >
          <Sidebar />
        </Drawer>
      )}

      {/* Main Layout */}
      <Layout
        style={{
          marginLeft: isMobile ? 0 : 256,
          minHeight: "100vh",
        }}
        className="bg-transparent"
      >
      
        <Content className="p-4 md:p-6 lg:p-8" >
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
