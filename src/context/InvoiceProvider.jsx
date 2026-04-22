import { useState, useEffect } from 'react';
import { InvoiceContext } from './InvoiceContext.js';
import data from '../data.json';

export const InvoiceProvider = ({ children }) => {
  const [invoices, setInvoices] = useState(() => {
    const savedInvoices = localStorage.getItem('invoiceData');
    return savedInvoices ? JSON.parse(savedInvoices) : data;
  });

  useEffect(() => {
    localStorage.setItem('invoiceData', JSON.stringify(invoices));
  }, [invoices]);

  return (
    <InvoiceContext.Provider value={{ invoices, setInvoices }}>
      {children}
    </InvoiceContext.Provider>
  );
};