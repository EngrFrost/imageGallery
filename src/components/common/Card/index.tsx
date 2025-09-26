import { Card as AntCard, type CardProps } from "antd";
import React from "react";

const Card: React.FC<CardProps> = ({ children }) => {
  return <AntCard>{children}</AntCard>;
};

export { Card };
