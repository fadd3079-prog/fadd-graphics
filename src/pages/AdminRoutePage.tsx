import ProtectedAdminRoute from "../components/ProtectedAdminRoute";
import { AdminAuthProvider } from "../hooks/useAdminAuth";
import AdminDashboardPage from "./AdminDashboardPage";
import AdminLoginPage from "./AdminLoginPage";

type AdminRoutePageProps = {
  page: "login" | "dashboard";
};

function AdminRoutePage({ page }: AdminRoutePageProps) {
  return (
    <AdminAuthProvider>
      {page === "login" ? (
        <AdminLoginPage />
      ) : (
        <ProtectedAdminRoute>
          <AdminDashboardPage />
        </ProtectedAdminRoute>
      )}
    </AdminAuthProvider>
  );
}

export default AdminRoutePage;
