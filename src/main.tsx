import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./app/App";
import { UiLoadingProvider } from "./components/UiLoadingProvider";
import { LanguageProvider } from "./hooks/useLanguage";
import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <LanguageProvider>
      <UiLoadingProvider>
        <App />
      </UiLoadingProvider>
    </LanguageProvider>
  </BrowserRouter>,
);
