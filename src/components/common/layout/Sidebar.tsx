import React from "react";
import { LogoutOutlined, PictureOutlined } from "@ant-design/icons";
import { useAuth } from "../../../hooks/useAuth";
import { useGetProfileQuery } from "../../../api/services/auth";
import { Menu, Button, Avatar, Skeleton } from "../";

const Sidebar: React.FC = () => {
  const { logout } = useAuth();
  const { data: user, isLoading } = useGetProfileQuery();

  return (
    <div className="flex flex-col h-full p-4">
      <div className="text-center pt-0">
        <p className="text-white m-0 text-2xl">ImageGallery</p>
      </div>

      <div className="flex flex-col items-center justify-center p-4 border-t">
        {isLoading ? (
          <Skeleton
            avatar={{ shape: "circle", size: "large" }}
            title={false}
            paragraph={{ rows: 1, width: "50%" }}
            active
            className="w-full"
          />
        ) : user ? (
          <>
            <Avatar
              size="large"
              style={{ backgroundColor: "#f56a00", marginBottom: 8 }}
            >
              {user.email[0].toUpperCase()}
            </Avatar>
            <p className="text-white block">{user.email}</p>
          </>
        ) : null}
      </div>

      <Menu
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

      <div className="p-4">
        <Button
          variant="ghost"
          startIcon={<LogoutOutlined />}
          onClick={logout}
          className="w-full text-gray-500 hover:!text-[#888888] hover:!bg-white-50 hover:!border-none hover:!border-0 hover:!shadow-none focus:!border-none focus:!shadow-none focus:!outline-none"
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
