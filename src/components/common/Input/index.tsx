import { forwardRef } from "react";

import type { InputProps as AntInputProps, InputRef } from "antd";
import { Input as AntInput } from "antd";
import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "../../../utils/helpers";

const inputVariants = cva("w-full", {
  variants: {
    variantSize: {
      base: "h-8",
      md: "h-9",
      lg: "h-10",
    },
  },

  defaultVariants: {
    variantSize: "base",
  },
});

interface IInputProps
  extends Omit<AntInputProps, "size">,
    VariantProps<typeof inputVariants> {
  hasError?: boolean;
}

const Input = forwardRef<InputRef, IInputProps>(
  ({ className, variantSize = "base", type, ...props }, ref) => {
    const inputClassName = cn(inputVariants({ variantSize, className }));

    if (type === "password") {
      return (
        <AntInput.Password
          ref={ref}
          className={inputClassName}
          type={type}
          {...props}
        />
      );
    }

    return (
      <AntInput ref={ref} className={inputClassName} type={type} {...props} />
    );
  }
);

Input.displayName = "Input";

export { Input, type IInputProps };
