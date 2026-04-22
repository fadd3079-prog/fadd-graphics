import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BackToTop from "../components/BackToTop";
import FirstVisitNotice from "../components/FirstVisitNotice";
import { useTheme } from "../hooks/useTheme";
import HomePage from "../pages/HomePage";
import PortfolioPage from "../pages/PortfolioPage";

function App() {
  const { theme, toggleTheme } = useTheme();
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
    <div className="relative isolate overflow-x-hidden bg-[linear-gradient(180deg,rgba(255,255,255,0.52),transparent_22%),linear-gradient(180deg,rgba(246,248,251,1),rgba(246,248,251,1))] dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.03),transparent_18%),linear-gradient(180deg,rgba(13,18,24,1),rgba(13,18,24,1))]">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-card focus:px-4 focus:py-2"
      >
        Lewati ke konten utama
      </a>

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-0 right-0 top-0 h-[32rem] bg-[radial-gradient(circle_at_top,rgba(41,92,118,0.08),transparent_58%)] dark:bg-[radial-gradient(circle_at_top,rgba(129,181,204,0.09),transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.58),transparent_18%),linear-gradient(to_right,transparent,rgba(255,255,255,0.28),transparent)] dark:bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent_20%),linear-gradient(to_right,transparent,rgba(255,255,255,0.02),transparent)]" />
      </div>

      <Header theme={theme} onToggleTheme={toggleTheme} />

      <main id="content" className="relative">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
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
