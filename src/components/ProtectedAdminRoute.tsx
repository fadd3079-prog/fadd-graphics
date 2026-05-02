import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "../hooks/useAdminAuth";

function ProtectedAdminRoute({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { isAdmin, isLoading, session } = useAdminAuth();

  if (session && isAdmin) {
    return children;
  }

  if (isLoading) {
    return <section className="min-h-screen bg-bg" aria-hidden="true" />;
  }

  return <Navigate to="/admin/login" replace state={{ from: location }} />;
}

export default ProtectedAdminRoute;
