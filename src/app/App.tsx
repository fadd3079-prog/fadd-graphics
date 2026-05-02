import { lazy, Suspense, useEffect, useLayoutEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BackToTop from "../components/BackToTop";
import FirstVisitNotice from "../components/FirstVisitNotice";
import PageLoadingGate from "../components/PageLoadingGate";
import { useTheme } from "../hooks/useTheme";
import { useLanguage } from "../hooks/useLanguage";
import { useResolvedSiteAssets } from "../hooks/useSiteData";
import HomePage from "../pages/HomePage";
import {
  loadAboutPage,
  loadAdminRoutePage,
  loadPortfolioDetailPage,
  loadPortfolioPage,
} from "../lib/route-preload";
import { jumpToTop, setManualScrollRestoration, waitForHashTarget } from "../lib/navigation-scroll";

const AboutPage = lazy(loadAboutPage);
const AdminRoutePage = lazy(loadAdminRoutePage);
const PortfolioDetailPage = lazy(loadPortfolioDetailPage);
const PortfolioPage = lazy(loadPortfolioPage);

function RouteFallback({ isAdminRoute }: { isAdminRoute: boolean }) {
  return <PageLoadingGate className={isAdminRoute ? "min-h-screen" : "section-shell min-h-[56vh] pt-28"} />;
}

function App() {
  const { theme, toggleTheme } = useTheme();
  const { copy } = useLanguage();
  const siteAssets = useResolvedSiteAssets();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  useLayoutEffect(() => {
    setManualScrollRestoration();

    if (location.hash) {
      void waitForHashTarget(location.hash);
      return;
    }

    jumpToTop();
  }, [location.key, location.pathname, location.hash]);

  useEffect(() => {
    if (siteAssets.favicon?.url) {
      const icon = document.querySelector<HTMLLinkElement>("link[rel='icon']");

      if (icon) {
        icon.href = siteAssets.favicon.url;
      }
    }

    if (siteAssets.ogImage?.url) {
      document.querySelector<HTMLMetaElement>("meta[property='og:image']")?.setAttribute("content", siteAssets.ogImage.url);
      document.querySelector<HTMLMetaElement>("meta[property='twitter:image']")?.setAttribute("content", siteAssets.ogImage.url);
    }
  }, [siteAssets.favicon?.url, siteAssets.ogImage?.url]);

  return (
    <div className={`relative isolate min-h-screen overflow-x-hidden ${isAdminRoute ? "bg-bg" : "bg-[linear-gradient(180deg,rgba(255,255,255,0.62),transparent_24%),linear-gradient(180deg,rgba(247,248,249,1),rgba(247,248,249,1))] dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.035),transparent_20%),linear-gradient(180deg,rgba(12,13,15,1),rgba(12,13,15,1))]"}`}>
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-card focus:px-4 focus:py-2"
      >
        {copy.app.skipLink}
      </a>

      {!isAdminRoute ? (
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute left-0 right-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_18%_0%,rgba(116,87,52,0.10),transparent_38%),radial-gradient(circle_at_82%_10%,rgba(73,95,111,0.08),transparent_36%)] dark:bg-[radial-gradient(circle_at_18%_0%,rgba(190,155,98,0.12),transparent_34%),radial-gradient(circle_at_82%_10%,rgba(123,153,162,0.08),transparent_36%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.58),transparent_18%),linear-gradient(to_right,transparent,rgba(255,255,255,0.20),transparent)] dark:bg-[linear-gradient(to_bottom,rgba(255,255,255,0.025),transparent_20%),linear-gradient(to_right,transparent,rgba(255,255,255,0.018),transparent)]" />
        </div>
      ) : null}

      {!isAdminRoute ? <Header theme={theme} onToggleTheme={toggleTheme} /> : null}

      <main id="content" className="relative">
        <Suspense fallback={<RouteFallback isAdminRoute={isAdminRoute} />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/portfolio/:portfolioSlug" element={<PortfolioDetailPage />} />
            <Route path="/admin/login" element={<AdminRoutePage page="login" />} />
            <Route path="/admin" element={<AdminRoutePage page="dashboard" />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>

      {!isAdminRoute ? (
        <>
          <Footer />
          <BackToTop />
          <FirstVisitNotice />
        </>
      ) : null}
    </div>
  );
}

export default App;
