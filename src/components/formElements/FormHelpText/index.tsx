import { type FC } from "react";

interface IProps {
  message: string;
}

const FormHelpText: FC<IProps> = ({ message }) => (
  <div className="mt-1 text-xs text-left text-red-6">{message}</div>
);

export { FormHelpText };
