import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ApplicationsProvider } from "./context/ApplicationsProvider";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApplicationsProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ApplicationsProvider>
  </StrictMode>,
);
