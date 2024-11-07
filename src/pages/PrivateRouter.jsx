import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { authAtom } from "../atoms/authAtom";

const PrivateRoute = () => {
  const auth = useRecoilValue(authAtom);
  return auth.isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
