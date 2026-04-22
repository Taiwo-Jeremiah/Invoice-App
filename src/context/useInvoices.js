import { useContext } from 'react';
import { InvoiceContext } from './InvoiceContext.js';

export const useInvoices = () => {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error('useInvoices must be used within an InvoiceProvider');
  }
  return context;
};