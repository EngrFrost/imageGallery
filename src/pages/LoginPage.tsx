import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../components/core/Login/LoginForm';

const LoginPage: React.FC = () => {
  return (
    <div>
      <h1>Login Page</h1>
      <LoginForm />
      <p>
        Don't have an account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
};

export default LoginPage;
