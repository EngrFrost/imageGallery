import { Layout as AntLayout } from "antd";
import type { LayoutProps } from "antd";
import clsx from "clsx";

const Layout: React.FC<LayoutProps> & {
  Header: typeof AntLayout.Header;
  Sider: typeof AntLayout.Sider;
  Content: typeof AntLayout.Content;
  Footer: typeof AntLayout.Footer;
} = ({ className, ...props }) => {
  return <AntLayout className={clsx(className)} {...props} />;
};

Layout.Header = AntLayout.Header;
Layout.Sider = AntLayout.Sider;
Layout.Content = AntLayout.Content;
Layout.Footer = AntLayout.Footer;

export { Layout };
