import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "../hooks/useAdminAuth";
import PageLoadingGate from "./PageLoadingGate";

function ProtectedAdminRoute({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { isAdmin, isLoading, session } = useAdminAuth();

  if (isLoading) {
    return <PageLoadingGate />;
  }

  if (!session || !isAdmin) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return children;
}

export default ProtectedAdminRoute;
