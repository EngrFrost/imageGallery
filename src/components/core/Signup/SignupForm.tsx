import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button } from "antd";
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import FormInput from "../../formElements/FormInput";
import type { SignupCredentials } from "../../types/auth";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  p: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const SignupForm: React.FC = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const methods = useForm<SignupCredentials>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: SignupCredentials) => {
    try {
      await signup(data);
      navigate("/");
    } catch (error) {
      console.error("Signup failed", error);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <FormInput label="Email" inputName="email" />
        <FormInput label="Password" type="password" inputName="password" />
        <Button type="primary" htmlType="submit">
          Sign Up
        </Button>
      </form>
    </FormProvider>
  );
};

export default SignupForm;
