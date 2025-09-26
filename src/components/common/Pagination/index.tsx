import { Pagination as AntPagination, type PaginationProps } from "antd";

const Pagination: React.FC<PaginationProps> = (props) => {
  return <AntPagination {...props} />;
};

export { Pagination };
