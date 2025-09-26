import type { MessageInstance } from "antd/es/message/interface";

export const messageApi: {
  current: MessageInstance | null;
} = {
  current: null,
};
