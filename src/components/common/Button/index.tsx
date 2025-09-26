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
          "text-white bg-blue-6 active:bg-blue-7 hover:bg-blue-5 disabled:bg-gray-2 disabled:text-gray-4 disabled:border disabled:border-gray-4",
        secondary:
          "text-gray-11 bg-white border border-gray-4 hover:bg-gray-2 active:bg-gray-4 disabled:bg-gray-2 disabled:text-gray-5",
        tertiary:
          "bg-transparent text-gray-11 border-none hover:bg-gray-2 active:bg-gray-4 disabled:bg-white disabled:text-gray-5",
        ghost:
          "bg-transparent text-blue-6 hover:text-blue-5 hover:bg-transparent active:text-blue-7 active:bg-transparent disabled:text-gray-5 disabled:bg-transparent",
        "danger-primary":
          "text-white bg-red-6 active:bg-red-7 hover:bg-red-5 disabled:bg-gray-2 disabled:text-gray-4 disabled:border disabled:border-gray-4",
        "danger-secondary":
          "text-red-6 bg-white border border-red-6 hover:text-red-5 hover:border-red-5 active:text-red-7 active:border-red-7 disabled:text-gray-4 disabled:bg-white disabled:border-gray-4",
        "danger-tertiary":
          "text-red-6 bg-white border-none hover:bg-red-1 hover:text-red-5 active:bg-red-2 active:text-red-7 disabled:bg-white disabled:text-gray-5",
        "danger-ghost":
          "bg-transparent text-red-6 hover:text-red-5 hover:bg-transparent active:text-red-7 active:bg-transparent disabled:text-gray-4 disabled:bg-transparent",
        warning:
          "text-white bg-orange-6 active:bg-orange-7 hover:bg-orange-5 disabled:bg-gray-2 disabled:text-gray-4 disabled:border disabled:border-gray-4",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        base: "h-8 px-4 py-1 text-sm",
        md: "h-9 px-4 py-1 text-sm",
        lg: "h-10 px-4 text-sm",
        xl: "h-12 px-10 text-base",
        icon: "h-6 w-6",
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
