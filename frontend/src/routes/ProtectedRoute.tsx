import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  // Wait until we know if the user is logged in
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  // Not logged in → go to login page
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Logged in → show requested page
  return <>{children}</>;
}