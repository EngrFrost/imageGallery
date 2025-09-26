import React from "react";
import { LogoutOutlined, MenuOutlined } from "@ant-design/icons";
import { Button } from "../Button";
import { useAuth } from "../../../hooks/useAuth";

interface AppHeaderProps {
  onMenuClick: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ onMenuClick }) => {
  const { logout } = useAuth();

  return (
    <header className="sticky top-0 bg-white shadow-sm z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              startIcon={<MenuOutlined />}
              onClick={onMenuClick}
              variant="ghost"
              className="text-gray-500"
            />
          </div>

          {/* Title or Logo - Hidden on mobile for space */}
          <div className="hidden md:flex items-center">
            <h1 className="text-xl font-semibold text-gray-800">
              Image Gallery
            </h1>
          </div>

          {/* Right side content */}
          <div className="flex items-center">
            <Button
              onClick={logout}
              variant="ghost"
              startIcon={<LogoutOutlined />}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
