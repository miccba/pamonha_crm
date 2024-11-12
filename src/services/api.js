import axios from "axios";
import { useRecoilState, useRecoilValue } from "recoil";
import { authAtom } from "../atoms/authAtom";

const api = axios.create({
  baseURL: "https://brasil.hubify.com.ar",
  //baseURL: "http://localhost:5174",
  headers: {
    "Content-Type": "application/json",
  },
});

export const useAuth = () => {
  const [auth, setAuth] = useRecoilState(authAtom);

  const getUsers = async () => {
    try {
      if (auth.token) {
        api.defaults.headers.common["Authorization"] = auth.token;
      }
      const response = await api.get("/users");
      return response.data;
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      return [];
    }
  };

  const getProducts = async () => {
    try {
      if (auth.token) {
        api.defaults.headers.common["Authorization"] = auth.token;
      }
      const response = await api.get("/products");
      return response.data;
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      return [];
    }
  };

  const getOrders = async () => {
    try {
      if (auth.token) {
        api.defaults.headers.common["Authorization"] = auth.token;
      }
      const response = await api.get("/orders");
      return response.data;
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      return [];
    }
  };

  const login = async (data) => {
    try {
      const response = await api.post("/users/login", data);
      const { token, user } = response.data;
      localStorage.setItem("authToken", token);

      setAuth({
        isAuthenticated: true,
        token: token,
        user: user,
      });

      return response.data;
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      return null;
    }
  };

  // Función para login con Google OAuth
  const loginWithGoogle = async (googleToken) => {
    try {
      const response = await api.post("/auth/google", { token: googleToken });
      const { token, user } = response.data;

      // Guardamos el token en localStorage y actualizamos el estado
      localStorage.setItem("authToken", token);
      setAuth({ isAuthenticated: true, user });

      return response.data;
    } catch (error) {
      console.error("Error en el login con Google:", error);
      return null;
    }
  };

  // Función para logout
  const logout = async () => {
    try {
      if (auth.token) {
        api.defaults.headers.common["Authorization"] = auth.token;
        await api.post("/users/logout");
        localStorage.removeItem("authToken");
        setAuth({ isAuthenticated: false, user: null });
        console.log("Sesión cerrada correctamente.");
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const changeStatusOrder = async ({ data }) => {
    try {
      if (auth.token) {
        api.defaults.headers.common["Authorization"] = auth.token;
      }
      const response = await api.patch(`/orders/status`, data);
      return response.data;
    } catch (error) {
      console.error("Error al status", error);
      return null;
    }
  };

  const updateProduct = async (id, { data }) => {
    try {
      if (auth.token) {
        api.defaults.headers.common["Authorization"] = auth.token;
      }
      const response = await api.patch(`/products/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error al status", error);
      return null;
    }
  };

  const updateUser = async (id, { data }) => {
    try {
      if (auth.token) {
        api.defaults.headers.common["Authorization"] = auth.token;
      }
      const response = await api.patch(`/users/user/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error al status", error);
      return null;
    }
  };

  const getStats = async () => {
    try {
      if (auth.token) {
        api.defaults.headers.common["Authorization"] = auth.token;
      }
      const response = await api.get(`/stats`);
      return response.data;
    } catch (error) {
      console.error("Error al status", error);
      return null;
    }
  };

  return {
    auth,
    getUsers,
    login,
    loginWithGoogle,
    logout,
    getProducts,
    getOrders,
    changeStatusOrder,
    updateProduct,
    updateUser,
    getStats,
  };
};
