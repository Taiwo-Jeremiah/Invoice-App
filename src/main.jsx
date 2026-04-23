import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { InvoiceProvider } from "./context/InvoiceContext.jsx";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* Add the basename right here! */}
    <InvoiceProvider>
      <BrowserRouter basename="/Invoice-App">
        <App />
      </BrowserRouter>
    </InvoiceProvider>
  </React.StrictMode>,
);
