import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // Add this
import "./index.css";
import App from "./App.jsx";
import { InvoiceProvider } from "./context/InvoiceContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter basename="/Invoice-App">
      {" "}
      {/* Wrap the Provider */}
      <InvoiceProvider>
        <App />
      </InvoiceProvider>
    </BrowserRouter>
  </StrictMode>,
);
