import { JSX } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: JSX.Element;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = !!localStorage.getItem("authToken");
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}