import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { InvoiceProvider } from './context/InvoiceProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <InvoiceProvider>
      <App />
    </InvoiceProvider>
  </StrictMode>,
)


//  refresh only works when a file only exports components. Move your React context(s) to a separate file.eslint(react-refresh/only-export-components)
// const InvoiceContext: Context<any>