import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "../../common";
import { useNavigate } from "react-router-dom";
import FormInput from "../../formElements/FormInput";
import Form from "../../formElements/Form";
import { useSignupMutation } from "../../../api/services/auth";
import { validationSchema, type SignupCredentials } from "./formhelpers";

const SignupForm: React.FC = () => {
  const navigate = useNavigate();
  const methods = useForm<SignupCredentials>({
    resolver: yupResolver(validationSchema),
  });

  const [signup, { isLoading, isSuccess }] = useSignupMutation();

  useEffect(() => {
    if (isSuccess) {
      navigate("/login");
    }
  }, [isSuccess, navigate]);

  const onSubmit = async (data: SignupCredentials) => {
    await signup(data).unwrap();
  };

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <FormInput label="Email" inputName="email" />
      <FormInput label="Password" type="password" inputName="password" />
      <Button isLoading={isLoading} className="w-full !bg-blue-500 !text-white">
        Sign Up
      </Button>
    </Form>
  );
};

export default SignupForm;
