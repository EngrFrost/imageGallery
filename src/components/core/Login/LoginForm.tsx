import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button } from "antd";
import FormInput from "../../formElements/FormInput";
import Form from "../../formElements/Form";
import type { LoginCredentials } from "./formhelper";
import { useLoginMutation } from "../../../api/authApi";
import { useNavigate } from "react-router-dom";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const LoginForm: React.FC = () => {
  const methods = useForm<LoginCredentials>({
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();

  const [login, { isLoading, isSuccess }] = useLoginMutation();
  console.log(isSuccess);
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
