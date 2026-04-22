import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./app/App";
import { UiLoadingProvider } from "./components/UiLoadingProvider";
import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <UiLoadingProvider>
      <App />
    </UiLoadingProvider>
  </BrowserRouter>,
);
