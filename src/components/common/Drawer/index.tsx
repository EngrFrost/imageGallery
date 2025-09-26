import { Drawer as AntDrawer } from 'antd';
import type { DrawerProps } from 'antd';

const Drawer: React.FC<DrawerProps> = (props) => {
  return <AntDrawer {...props} />;
};

export { Drawer };
