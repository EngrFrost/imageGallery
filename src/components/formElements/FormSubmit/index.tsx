import type { FC } from "react";
import React from "react";

import type { IButtonWithPermissionProps } from "../../common";
import { Button } from "../../common";

interface IProps extends IButtonWithPermissionProps {
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  permissions?: string[];
  "data-testid"?: string;
}

const FormSubmit: FC<IProps> = ({
  children,
  "data-testid": dataTestId = "submit-button",
  ...rest
}) => (
  <Button variant="primary" type="submit" {...rest} data-testid={dataTestId}>
    {children}
  </Button>
);

export default FormSubmit;
