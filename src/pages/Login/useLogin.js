import { useState } from "react";
import Joi from "joi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useRecoilState } from "recoil";
import { authAtom } from "../../atoms/authAtom";
import { useAuth } from "../../services/api";

// Esquema de validación con Joi
const schema = Joi.object({
  email: Joi.string().required().label("Usuario"),
  password: Joi.string().min(6).required().label("Contraseña"),
});

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [auth, setAuth] = useRecoilState(authAtom);
  const navigate = useNavigate();
  const { login } = useAuth();

  const validate = (data) => {
    const { error } = schema.validate(data);
    if (error) return error.details[0].message;
    return null;
  };

  const handleLogin = async (data) => {
    setError(null);

    // Validación de datos
    const validationError = validate(data);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      await login(data);
      navigate("/");
    } catch (err) {
      setError(
        "Error en el inicio de sesión. Por favor, verifica tus credenciales."
      );
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar login con Google
  const handleGoogleLogin = async (googleResponse) => {
    try {
      setLoading(true);

      const response = await axios.post("/api/auth/google", {
        token: googleResponse.credential,
      });
      const { token, user } = response.data;

      // Guardamos token y actualizamos el estado de autenticación
      localStorage.setItem("authToken", token);
      setAuth({ isAuthenticated: true, user });

      navigate("/");
    } catch (err) {
      setError("Error en el inicio de sesión con Google.");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    handleLogin,
    handleGoogleLogin,
  };
};

export default useLogin;
