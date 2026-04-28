import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./app/App";
import { UiLoadingProvider } from "./components/UiLoadingProvider";
import { AdminAuthProvider } from "./hooks/useAdminAuth";
import { LanguageProvider } from "./hooks/useLanguage";
import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <LanguageProvider>
      <AdminAuthProvider>
        <UiLoadingProvider>
          <App />
        </UiLoadingProvider>
      </AdminAuthProvider>
    </LanguageProvider>
  </BrowserRouter>,
);
