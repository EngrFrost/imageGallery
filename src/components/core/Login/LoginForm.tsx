import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "antd";
import FormInput from "../../formElements/FormInput";
import Form from "../../formElements/Form";
import { validationSchema, type LoginCredentials } from "./formhelper";
import { useLoginMutation } from "../../../api/services/auth";
import { useNavigate } from "react-router-dom";

const LoginForm: React.FC = () => {
  const navigate = useNavigate();

  const methods = useForm<LoginCredentials>({
    resolver: yupResolver(validationSchema),
  });

  const [login, { isLoading, isSuccess }] = useLoginMutation();

  useEffect(() => {
    if (isSuccess) {
      navigate("/");
    }
  }, [isSuccess]);

  const onSubmit = async (values: LoginCredentials) => {
    await login(values).unwrap();
  };

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <FormInput label="Email" inputName="email" />
      <FormInput label="Password" type="password" inputName="password" />
      <Button loading={isLoading} type="primary" htmlType="submit">
        Login
      </Button>
    </Form>
  );
};

export default LoginForm;
