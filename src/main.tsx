import React from "react";
import ReactDOM from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import i18next from "./i18n/i18n.tsx";
import "./index.css";
import "react-tooltip/dist/react-tooltip.css";

// Listen for language change events and update direction
i18next.on("languageChanged", (lng) => {
  document.body.dir = i18next.dir();
  document.body.lang = lng;
});

// Set initial direction and language
document.body.dir = i18next.dir();
document.body.lang = i18next.language;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18next}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </I18nextProvider>
  </React.StrictMode>
);
