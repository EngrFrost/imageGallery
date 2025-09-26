import { Skeleton as AntSkeleton } from 'antd';
import type { SkeletonProps } from 'antd';

const Skeleton: React.FC<SkeletonProps> = (props) => {
  return <AntSkeleton {...props} />;
};

export { Skeleton };
