import { Menu as AntMenu } from 'antd';
import type { MenuProps } from 'antd';
import clsx from 'clsx';

const Menu: React.FC<MenuProps> = ({ className, ...props }) => {
  // Default to a dark theme with a transparent background for use in sidebars
  return (
    <AntMenu
      theme="dark"
      className={clsx('!bg-transparent', className)}
      {...props}
    />
  );
};

export { Menu };
