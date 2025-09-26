import * as React from "react";

import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "../../../utils/helpers";
import { SpinnerIcon } from "../Icon";

const buttonVariants = cva(
  "inline-flex gap-2 items-center justify-center whitespace-nowrap rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 select-none disabled:cursor-not-allowed disabled:pointer-events-auto disabled:text-destructive-muted",
  {
    variants: {
      variant: {
        primary:
          "text-white bg-blue-500 active:bg-blue-700 hover:bg-blue-500 disabled:bg-gray-200 disabled:text-gray-400 disabled:border disabled:border-gray-400",
        secondary:
          "text-gray-11 bg-white border border-gray-400 hover:bg-gray-200 active:bg-gray-400 disabled:bg-gray-200 disabled:text-gray-500",
        tertiary:
          "bg-transparent text-gray-11 border-none hover:bg-gray-200 active:bg-gray-400 disabled:bg-white disabled:text-gray-500",
        ghost:
          "bg-transparent text-blue-600 hover:text-blue-500 hover:bg-transparent active:text-blue-700 active:bg-transparent disabled:text-gray-500 disabled:bg-transparent",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        base: "h-8 px-4 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "base",
    },
  }
);

interface IButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  component?: string;
  tooltipContent?: string;
  tooltipPlacement?: "top" | "bottom" | "left" | "right";
  temporaryTooltip?: string;
  temporaryTooltipDuration?: number;
}

const Button = React.forwardRef<HTMLButtonElement, IButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading,
      fullWidth,
      disabled,
      startIcon,
      endIcon,
      component = "button",
      onClick,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : component;

    const isDisabled = disabled || isLoading;
    const disabledProps =
      component === "button" ? { disabled: isDisabled } : {};

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (onClick) {
        onClick(e);
      }
    };

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }), {
          "w-full": fullWidth,
          // Remove opacity and pointer-events when just loading
          "cursor-default opacity-100": isLoading && !disabled,
          relative: isLoading,
        })}
        {...disabledProps}
        ref={ref}
        onClick={handleClick}
        {...props}
      >
        <>
          {startIcon && (
            <span
              className={cn("flex items-center", {
                invisible: isLoading,
              })}
            >
              {startIcon}
            </span>
          )}
          {isLoading && (
            <span className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center">
              <SpinnerIcon className="h-4 w-4 animate-spin" />
            </span>
          )}
          <span
            className={cn("inline-flex items-center", {
              invisible: isLoading,
            })}
          >
            {props.children}
          </span>
          {endIcon && (
            <span
              className={cn("flex items-center", {
                invisible: isLoading,
              })}
            >
              {endIcon}
            </span>
          )}
        </>
      </Comp>
    );
  }
);

Button.displayName = "Button";

export interface IButtonWithPermissionProps extends IButtonProps {
  permissions?: string[];
  "data-testid"?: string;
}

export { Button as Button, type IButtonProps };
