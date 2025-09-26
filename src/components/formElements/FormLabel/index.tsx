import type { FC, ReactNode } from "react";

import { cn } from "../../../utils/helpers";

interface IProps {
  label: ReactNode | string;
  isRequired?: boolean;
  className?: string;
  tooltipLabel?: string;
  description?: string;
}

const FormLabel: FC<IProps> = ({ label, isRequired, className }) => (
  <div>
    <div className="flex items-center gap-1">
      <p
        className={cn(
          "flex gap-1 text-sm !mb-0 font-medium text-gray-11",
          className
        )}
      >
        {label}
        {isRequired && <span className=" text-red-600">*</span>}
      </p>
    </div>
  </div>
);

export default FormLabel;
