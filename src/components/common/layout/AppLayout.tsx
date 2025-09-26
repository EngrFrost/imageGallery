import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Drawer } from "../Drawer";
import { Layout } from "./";
import Sidebar from "./Sidebar";
import { cn } from "../../../utils/helpers";
import AppHeader from "./AppHeader";

const { Content } = Layout;

const AppLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setMobileMenuOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <Layout className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar */}
      {isMobile ? (
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
      ) : (
        <div className="fixed left-0 top-0 h-full w-64 bg-gray-900 z-20 shadow-xl">
          <Sidebar />
        </div>
      )}

      <Layout
        className={cn("bg-transparent", {
          "ml-0": isMobile,
          "ml-64": !isMobile,
        })}
      >
        {isMobile && <AppHeader onMenuClick={() => setMobileMenuOpen(true)} />}

        <Content className="p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
