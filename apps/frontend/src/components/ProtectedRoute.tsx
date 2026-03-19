import type React from "react";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = localStorage.getItem("current_user"); // Simpan user yang login di sini

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};