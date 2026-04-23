// import { useState, useEffect } from "react";
// import { InvoiceContext } from "./InvoiceContext";
// import data from "../data.json";

// export const InvoiceProvider = ({ children }) => {
//   const [invoices, setInvoices] = useState(() => {
//     const savedInvoices = localStorage.getItem("invoiceData");
//     return savedInvoices ? JSON.parse(savedInvoices) : data;
//   });

//   useEffect(() => {
//     localStorage.setItem("invoiceData", JSON.stringify(invoices));
//   }, [invoices]);

//   const addInvoice = (newInvoice) => {
//     setInvoices([...invoices, newInvoice]);
//   };

//   return (
//     <InvoiceContext.Provider value={{ invoices, setInvoices, addInvoice }}>
//       {children}
//     </InvoiceContext.Provider>
//   );
// };
