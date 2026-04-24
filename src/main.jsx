import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom"; // <-- Changed to HashRouter!
import { InvoiceProvider } from "./context/InvoiceContext.jsx";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <InvoiceProvider>
      {/* HashRouter doesn't need a basename, it just works! */}
      <HashRouter>
        <App />
      </HashRouter>
    </InvoiceProvider>
  </React.StrictMode>,
);
