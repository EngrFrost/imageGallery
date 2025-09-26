import type { SpinProps } from "antd";

export { Spin } from "antd";

export type { SpinProps } from "antd";

const Spin = ({ children, ...props }: SpinProps) => {
  return <Spin {...props}>{children}</Spin>;
};

export default Spin;
