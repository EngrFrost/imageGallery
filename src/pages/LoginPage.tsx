import { Link } from "react-router-dom";
import { Col, Row, Card } from "../components/common";
import LoginForm from "../components/core/Login/LoginForm";

const LoginPage = () => {
  return (
    <Row
      justify="center"
      align="middle"
      style={{ minHeight: "100vh", background: "#f0f2f5" }}
    >
      <Col xs={22} sm={16} md={12} lg={8} xl={6}>
        <Card>
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <p className="text-2xl font-bold">Welcome Back</p>
            <p className="text-gray-500">
              Please enter your credentials to login
            </p>
          </div>
          <LoginForm />
          <div style={{ textAlign: "center", marginTop: "16px" }}>
            <p className="text-gray-500">
              Don't have an account? <Link to="/signup">Sign up</Link>
            </p>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default LoginPage;
