import React from 'react';
import { Link } from 'react-router-dom';
import SignupForm from '../components/core/Signup/SignupForm';

const SignupPage: React.FC = () => {
  return (
    <div>
      <h1>Sign Up Page</h1>
      <SignupForm />
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default SignupPage;
