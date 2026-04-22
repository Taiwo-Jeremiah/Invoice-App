import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import InvoiceCard from "./components/InvoiceCard";
import { useInvoices } from "./context/useInvoices.js";

function App() {
  const { invoices } = useInvoices();

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg font-spartan transition-colors duration-300">
      <Sidebar />

      {/* Main Content Area */}
      <main className="md:ml-[103px] pt-[72px] md:pt-0 p-4 md:p-0">
        <div className="max-w-[730px] mx-auto py-8 md:py-16 px-4">
          <Routes>
            {/* We will replace this <div> with a real HomePage component soon! */}
            <Route
              path="/"
              element={
                <div>
                  <div className="flex justify-between items-center mb-12">
                    <div>
                      <h1 className="text-heading-l dark:text-white transition-colors">
                        Invoices
                      </h1>
                      <p className="text-gray-blue text-body mt-1">
                        There are {invoices.length} total invoices
                      </p>
                    </div>

                    <button className="bg-primary hover:bg-primary-hover text-white px-2 py-2 pr-4 rounded-full font-bold flex items-center gap-4 transition-all">
                      <div className="bg-white w-8 h-8 rounded-full flex items-center justify-center">
                        <span className="text-primary text-xl">+</span>
                      </div>
                      <span>
                        New <span className="hidden md:inline">Invoice</span>
                      </span>
                    </button>
                  </div>

                  {/* Invoice List Section */}
                  <div className="flex flex-col gap-4">
                    {invoices.map((invoice) => (
                      <InvoiceCard key={invoice.id} invoice={invoice} />
                    ))}
                  </div>
                </div>
              }
            />

            {/* DETAIL PAGE PLACEHOLDER */}
            <Route
              path="/invoice/:id"
              element={
                <div className="dark:text-white">
                  Invoice Detail Page Coming Soon!
                </div>
              }
            />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
