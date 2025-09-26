import React from "react";
import { Button, Menu, Typography } from "antd";
import { LogoutOutlined, PictureOutlined } from "@ant-design/icons";
import { useAuth } from "../../../hooks/useAuth";

const { Title } = Typography;

const Sidebar: React.FC = () => {
  const { logout } = useAuth();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        padding: "16px 0",
      }}
    >
      <div style={{ textAlign: "center", padding: "0 16px 24px" }}>
        <Title level={4} style={{ color: "white", margin: 0 }}>
          ImageGallery
        </Title>
      </div>

      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={["gallery"]}
        style={{ flex: 1, borderRight: 0 }}
        items={[
          {
            key: "gallery",
            icon: <PictureOutlined />,
            label: "My Gallery",
          },
        ]}
      />

      <div style={{ padding: "16px" }}>
        <Button
          type="text"
          danger
          icon={<LogoutOutlined />}
          onClick={logout}
          style={{ width: "100%", color: "#a9a9a9" }}
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
