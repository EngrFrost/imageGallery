import React from "react";
import { Layout, Button, Avatar } from "antd";
import { MenuOutlined, UserOutlined } from "@ant-design/icons";
import { useGetProfileQuery } from "../../../api/services/auth";

const { Header: AntHeader } = Layout;

interface HeaderProps {
  onMenuToggle: () => void;
  isMobile: boolean;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle, isMobile }) => {
  const { data: user } = useGetProfileQuery();

  return (
    <AntHeader className="bg-white shadow-sm border-b border-gray-100 px-4 md:px-6 h-16 flex items-center justify-between sticky top-0 z-50">
      {isMobile && (
        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={onMenuToggle}
          className="flex items-center justify-center w-10 h-10 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
        />
      )}
      
      <div className="flex-1 flex justify-center md:justify-start">
        {!isMobile && (
          <h2 className="text-xl font-semibold text-gray-800 m-0">
            Image Gallery
          </h2>
        )}
        {isMobile && (
          <h2 className="text-lg font-semibold text-gray-800 m-0">
            Gallery
          </h2>
        )}
      </div>

      <div className="flex items-center gap-3">
        {user && !isMobile && (
          <span className="text-sm text-gray-600 hidden sm:block">
            {user.email}
          </span>
        )}
        <Avatar 
          size={isMobile ? "default" : "large"} 
          className="bg-blue-500"
        >
          {user?.email?.[0]?.toUpperCase() || <UserOutlined />}
        </Avatar>
      </div>
    </AntHeader>
  );
};

export default Header;
