import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button } from "antd";
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import FormInput from "../../formElements/FormInput";
import Form from "../../formElements/Form";
import type { LoginCredentials } from "./formhelper";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const methods = useForm<LoginCredentials>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: LoginCredentials) => {
    console.log(data);

    await login(data);
    navigate("/");
  };

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <FormInput label="Email" inputName="email" />
      <FormInput label="Password" type="password" inputName="password" />
      <Button type="primary" htmlType="submit">
        Login
      </Button>
    </Form>
  );
};

export default LoginForm;
