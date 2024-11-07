import ReactDOM from "react-dom/client";
import { RecoilRoot } from "recoil";
import "./index.css";
import App from "./App";

import { ConfigProvider, theme, App as AntdApp } from "antd";

const { getDesignToken } = theme;

// Configuración de los tokens de color
const config = {
  token: {
    colorPrimary: "#4D9D2C", // Aquí defines el color primario
    "btn-primary-bg": "green", // Fondo del botón primario
    "btn-primary-border": "green", // Borde del botón primario
    "btn-text-color": "white", // Color del texto dentro del botón primario
  },
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <ConfigProvider theme={config}>
    <AntdApp>
      <RecoilRoot>
        <App />
      </RecoilRoot>
    </AntdApp>
  </ConfigProvider>
);
