import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { Button, Card, Form, Input, Typography, Divider, Alert } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import useLogin from "./useLogin";
import Logo from "../../assets/logo.png";

const { Title, Text } = Typography;

const Login = () => {
  const { loading, error, handleLogin, handleGoogleLogin } = useLogin();

  const onFinish = (values) => {
    handleLogin(values);
  };

  return (
    <GoogleOAuthProvider clientId="TU_CLIENT_ID_DE_GOOGLE">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#f0f2f5",
        }}
      >
        <Card
          style={{
            width: 400,
            textAlign: "center",
            borderRadius: 8,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
        >
          <img src={Logo} width={150} />
          <Title level={3}>Pamonha-Jet</Title>
          <Text type="secondary">
            Insira suas credenciais ou use o Google para continuar
          </Text>

          {error && (
            <Alert message={error} type="error" style={{ marginBottom: 16 }} />
          )}

          <Form
            name="login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            style={{ marginTop: 20 }}
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Por favor digite seu usuário!" },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Usuário" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Por favor digite sua senha!" },
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Senha" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{ width: "100%" }}
              >
                Entrar
              </Button>
            </Form.Item>
          </Form>

          {/*
           <Divider>O</Divider>

          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => console.log("Login Failed")}
            render={(renderProps) => (
              <Button
                type="default"
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
                style={{ width: "100%", fontWeight: "bold" }}
              >
                Faça login com o Google
              </Button>
            )}
          />
          */}
        </Card>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
