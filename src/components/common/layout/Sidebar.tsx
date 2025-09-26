import React from "react";
import { Avatar, Button, Menu, Skeleton, Typography } from "antd";
import { LogoutOutlined, PictureOutlined } from "@ant-design/icons";
import { useAuth } from "../../../hooks/useAuth";
import { useGetProfileQuery } from "../../../api/services/auth";

const { Title, Text } = Typography;

const Sidebar: React.FC = () => {
  const { logout } = useAuth();
  const { data: user, isLoading } = useGetProfileQuery();

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

      <div className="flex flex-col items-center justify-center p-4 border-t">
        {isLoading ? (
          <Skeleton
            avatar={{ shape: "circle" }}
            paragraph={{ rows: 1 }}
            active
          />
        ) : user ? (
          <>
            <Avatar
              size="large"
              style={{ backgroundColor: "#f56a00", marginBottom: 8 }}
            >
              {user.email[0].toUpperCase()}
            </Avatar>
            <Text style={{ color: "white", display: "block" }}>
              {user.email}
            </Text>
          </>
        ) : null}
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
          className="w-full !text-[#a9a9a9] hover:!text-[#888888] hover:!bg-transparent hover:!border-none hover:!border-0 hover:!shadow-none focus:!border-none focus:!shadow-none focus:!outline-none"
          style={{
            border: 'none',
            boxShadow: 'none',
            outline: 'none'
          }}
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
