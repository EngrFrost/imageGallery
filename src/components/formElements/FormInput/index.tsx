import type { FC } from "react";
import { Controller, get, useFormContext } from "react-hook-form";

import type { InputProps as AntInputProps } from "antd";

import { cn } from "../../../utils/helpers";

import { Input } from "../../common/Input";

import FormItem from "../FormItem";
import FormLabel from "../FormLabel";
import FormHelpText from "../FormHelpText";

interface IProps extends AntInputProps {
  inputName: string;
  isRequired?: boolean;
  placeholder?: string;
  label?: string | null;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  description?: string;
  className?: string;
  layout?: "vertical" | "horizontal";
  variantSize?: "base" | "md" | "lg";
  "data-testid"?: string;
}

const IFormInput: FC<IProps> = ({
  inputName,
  placeholder = "",
  label,
  isRequired = false,
  className,
  layout = "vertical",
  variantSize = "base",
  "data-testid": dataTestId,
  description,
  ...rest
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const fieldError = get(errors, inputName);

  return (
    <Controller
      control={control}
      name={inputName}
      render={({ field }) => (
        <FormItem
          label={
            label && (
              <FormLabel
                description={description}
                label={label}
                isRequired={isRequired}
              />
            )
          }
          colon={false}
          validateStatus={fieldError ? "error" : ""}
          help={
            fieldError?.message ? (
              <FormHelpText message={fieldError?.message as string} />
            ) : null
          }
          className={cn("m-0", className)}
          layout={layout}
        >
          <Input
            {...rest}
            {...field}
            id={inputName}
            placeholder={placeholder}
            hasError={!!fieldError}
            variantSize={variantSize}
            data-testid={dataTestId}
          />
        </FormItem>
      )}
    />
  );
};

export default IFormInput;
