import { createContext, useState, useEffect } from "react";
import initialData from "../data.json";

// Tell Vite's linter to ignore this specific export
// eslint-disable-next-line react-refresh/only-export-components
export const InvoiceContext = createContext();

export function InvoiceProvider({ children }) {
  // 1. Initialize with Local Storage OR initial data
  const [invoices, setInvoices] = useState(() => {
    const savedInvoices = localStorage.getItem("invoiceData");
    return savedInvoices ? JSON.parse(savedInvoices) : initialData;
  });

  // 2. Save to Local Storage whenever invoices change
  useEffect(() => {
    localStorage.setItem("invoiceData", JSON.stringify(invoices));
  }, [invoices]);

  // 3. Generate ID helper
  const generateId = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    let id = "";
    for (let i = 0; i < 2; i++) {
      id += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    for (let i = 0; i < 4; i++) {
      id += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    return id;
  };

  // 4. Add Invoice (Generates ID and pushes to TOP)
  const addInvoice = (newInvoiceData) => {
    const newInvoice = {
      ...newInvoiceData,
      id: generateId(),
    };

    setInvoices([newInvoice, ...invoices]);
  };
  // --- NEW LOGIC: DELETE INVOICE ---
  const deleteInvoice = (id) => {
    setInvoices(invoices.filter((invoice) => invoice.id !== id));
  };

  // --- NEW LOGIC: MARK AS PAID ---
  const markAsPaid = (id) => {
    setInvoices(
      invoices.map((invoice) =>
        invoice.id === id ? { ...invoice, status: "paid" } : invoice,
      ),
    );
  };

  // --- NEW LOGIC: UPDATE INVOICE ---
  const updateInvoice = (updatedInvoice) => {
    setInvoices(
      invoices.map((invoice) =>
        invoice.id === updatedInvoice.id ? updatedInvoice : invoice,
      ),
    );
  };

  return (
    // Make sure to add updateInvoice to this list!
    <InvoiceContext.Provider
      value={{
        invoices,
        setInvoices,
        addInvoice,
        deleteInvoice,
        markAsPaid,
        updateInvoice,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
}
