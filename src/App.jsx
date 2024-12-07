import React, { useEffect, useState } from "react";
import {
  DesktopOutlined,
  FileOutlined,
  LogoutOutlined,
  PieChartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Spin, theme } from "antd";
import {
  Link,
  BrowserRouter as Router,
  useLocation,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Users from "./pages/Users";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Login from "./pages/Login/Login";
import PrivateRoute from "./pages/PrivateRouter";
import { useRecoilState } from "recoil";
import { authAtom } from "./atoms/authAtom";
import Loader from "./components/Loader";
import Logo from "./assets/logo.png";
import Logout from "./pages/Logout";
import Stats from "./pages/Stats";
import Notifications from "./services/Notifications";
import Order from "./pages/order/Order";

const { Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children, link) {
  return {
    key,
    icon,
    children,
    label: <Link to={link || "#"}>{label}</Link>,
  };
}

const items = [
  getItem("Dashboard", "1", <PieChartOutlined />, null, "/"),
  getItem("Usuários", "2", <UserOutlined />, null, "/users"),
  getItem("Produtos", "3", <DesktopOutlined />, null, "/products"),
  getItem("Pedidos", "4", <FileOutlined />, null, "/orders"),
  getItem("Gerar pedido", "5", <FileOutlined />, null, "/order"),
  getItem("Desconectar", "6", <LogoutOutlined />, null, "/logout"),
];

const AppLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const location = useLocation(); // Obtiene la ruta actual

  const selectedKey =
    items.find((item) => location.pathname === item.label.props.to)?.key || "1";

  return (
    <Layout style={{ minHeight: "100vh", maxHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div
          className="demo-logo-vertical"
          style={{
            margin: "16px",
            display: "flex",
            gap: "10px",
          }}
        >
          <img width={50} src={Logo} />
          <p style={{ color: "#FFF" }}>Pamonha-Jet</p>
        </div>
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          selectedKeys={[selectedKey]}
          items={items}
        />
        <Notifications />
      </Sider>

      <Layout style={{ overflow: "auto", maxHeight: "100vh" }}>
        <Content
          style={{
            margin: "16px",
            display: "flex",
            flexDirection: "column",
            flex: 1,
            maxWidth: "100%", // Controla el máximo de ancho
            overflow: "auto", // Maneja el desbordamiento si el contenido es demasiado grande
            padding: "16px",
          }}
        >
          {children}
        </Content>

        <Footer style={{ textAlign: "center", background: colorBgContainer }}>
          Powered Nodes In Motion ©{new Date().getFullYear()}
        </Footer>
      </Layout>
    </Layout>
  );
};

const App = () => {
  const [auth, setAuth] = useRecoilState(authAtom);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem("authToken");
      setAuth({ isAuthenticated: !!token, token: token });
      setLoading(false);
    };

    verifyAuth();
  }, [setAuth]);

  if (loading) {
    return <Loader />;
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
      <Route element={<PrivateRoute />}>
        <Route
          path="/"
          element={
            <AppLayout>
              <Stats />
            </AppLayout>
          }
        />
        <Route
          path="/users"
          element={
            <AppLayout>
              <Users />
            </AppLayout>
          }
        />
        <Route
          path="/products"
          element={
            <AppLayout>
              <Products />
            </AppLayout>
          }
        />
        <Route
          path="/orders"
          element={
            <AppLayout>
              <Orders />
            </AppLayout>
          }
        />
        <Route
          path="/order"
          element={
            <AppLayout>
              <Order />
            </AppLayout>
          }
        />
      </Route>
    </Routes>
  );
};

// Colocamos BrowserRouter en el nivel más alto, envolviendo toda la aplicación
const RootApp = () => (
  <Router>
    <App />
  </Router>
);

export default RootApp;
