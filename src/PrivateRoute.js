import { Outlet, Navigate } from "react-router-dom";

export default function PrivateRoutes() {
  let user = localStorage.getItem("tokan") ? true : false;
  return user ? <Outlet /> : <Navigate to="/" />;
}
