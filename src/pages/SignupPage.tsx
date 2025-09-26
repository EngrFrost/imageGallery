import { Link } from "react-router-dom";
import { Card, Col, Row, Typography } from "antd";
import SignupForm from "../components/core/Signup/SignupForm";

const { Title, Text } = Typography;

const SignupPage = () => {
  return (
    <Row
      justify="center"
      align="middle"
      style={{ minHeight: "100vh", background: "#f0f2f5" }}
    >
      <Col xs={22} sm={16} md={12} lg={8} xl={6}>
        <Card>
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <Title level={2}>Create Account</Title>
            <Text type="secondary">
              Please enter your details to create an account
            </Text>
          </div>
          <SignupForm />
          <div style={{ textAlign: "center", marginTop: "16px" }}>
            <Text>
              Already have an account? <Link to="/login">Log in</Link>
            </Text>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default SignupPage;
