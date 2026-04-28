import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "../hooks/useAdminAuth";

function ProtectedAdminRoute({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { isAdmin, isLoading, session } = useAdminAuth();

  if (isLoading) {
    return (
      <section className="section-shell flex min-h-[60vh] items-center justify-center pt-28">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-lineStrong border-t-accent" />
      </section>
    );
  }

  if (!session || !isAdmin) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return children;
}

export default ProtectedAdminRoute;
