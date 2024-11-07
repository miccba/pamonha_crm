import { useEffect } from "react";
import { useAuth } from "../services/api";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      const response = await logout();
      navigate("/login");
    };
    fetch();
  }, []);

  return <Loader />;
};

export default Logout;
