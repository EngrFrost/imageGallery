import { Avatar as AntAvatar } from 'antd';
import type { AvatarProps } from 'antd';

const Avatar: React.FC<AvatarProps> = (props) => {
  return <AntAvatar {...props} />;
};

export { Avatar };
