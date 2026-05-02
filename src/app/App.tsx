import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BackToTop from "../components/BackToTop";
import FirstVisitNotice from "../components/FirstVisitNotice";
import ProtectedAdminRoute from "../components/ProtectedAdminRoute";
import { useTheme } from "../hooks/useTheme";
import { useLanguage } from "../hooks/useLanguage";
import AdminDashboardPage from "../pages/AdminDashboardPage";
import AdminLoginPage from "../pages/AdminLoginPage";
import AboutPage from "../pages/AboutPage";
import HomePage from "../pages/HomePage";
import PortfolioDetailPage from "../pages/PortfolioDetailPage";
import PortfolioPage from "../pages/PortfolioPage";

function App() {
  const { theme, toggleTheme } = useTheme();
  const { copy } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      requestAnimationFrame(() => {
        document.getElementById(location.hash.slice(1))?.scrollIntoView({ block: "start" });
      });
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname, location.hash]);

  return (
    <div className="relative isolate overflow-x-hidden bg-[linear-gradient(180deg,rgba(255,255,255,0.62),transparent_24%),linear-gradient(180deg,rgba(247,248,249,1),rgba(247,248,249,1))] dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.035),transparent_20%),linear-gradient(180deg,rgba(12,13,15,1),rgba(12,13,15,1))]">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-card focus:px-4 focus:py-2"
      >
        {copy.app.skipLink}
      </a>

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-0 right-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_18%_0%,rgba(116,87,52,0.10),transparent_38%),radial-gradient(circle_at_82%_10%,rgba(73,95,111,0.08),transparent_36%)] dark:bg-[radial-gradient(circle_at_18%_0%,rgba(190,155,98,0.12),transparent_34%),radial-gradient(circle_at_82%_10%,rgba(123,153,162,0.08),transparent_36%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.58),transparent_18%),linear-gradient(to_right,transparent,rgba(255,255,255,0.20),transparent)] dark:bg-[linear-gradient(to_bottom,rgba(255,255,255,0.025),transparent_20%),linear-gradient(to_right,transparent,rgba(255,255,255,0.018),transparent)]" />
      </div>

      <Header theme={theme} onToggleTheme={toggleTheme} />

      <main id="content" className="relative">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/portfolio/:portfolioSlug" element={<PortfolioDetailPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminDashboardPage />
              </ProtectedAdminRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
      <BackToTop />
      <FirstVisitNotice />
    </div>
  );
}

export default App;
