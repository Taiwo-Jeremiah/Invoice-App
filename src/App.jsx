import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import InvoiceCard from "./components/InvoiceCard";
import InvoiceDetails from "./components/InvoiceDetails";
import InvoiceForm from "./components/InvoiceForm";
import { useInvoices } from "./context/useInvoices.js";

function App() {
  const { invoices } = useInvoices();
  const [isFormOpen, setIsFormOpen] = useState(false);

  // --- NEW: FILTER STATES ---
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  // UPDATED: Check localStorage first
  const [filterStatuses, setFilterStatuses] = useState(() => {
    const savedFilters = localStorage.getItem("invoiceFilters");
    return savedFilters ? JSON.parse(savedFilters) : [];
  });

  // NEW: Save to localStorage whenever the array changes
  useEffect(() => {
    localStorage.setItem("invoiceFilters", JSON.stringify(filterStatuses));
  }, [filterStatuses]);

  // --- NEW: FILTER LOGIC ---
  const toggleFilter = (status) => {
    // If the status is already checked, remove it from the array. Otherwise, add it!
    if (filterStatuses.includes(status)) {
      setFilterStatuses(filterStatuses.filter((s) => s !== status));
    } else {
      setFilterStatuses([...filterStatuses, status]);
    }
  };

  // Create a new array that only contains invoices matching the selected filters
  const filteredInvoices = invoices.filter((invoice) =>
    filterStatuses.length === 0
      ? true
      : filterStatuses.includes(invoice.status),
  );

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg font-spartan transition-colors duration-300">
      <Sidebar />

      <InvoiceForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />

      <main className="md:ml-[103px] pt-[72px] md:pt-0 p-4 md:p-0">
        <div className="max-w-[730px] mx-auto py-8 md:py-16 px-4">
          <Routes>
            <Route
              path="/"
              element={
                <div>
                  <div className="flex justify-between items-center mb-12">
                    {/* Header Title */}
                    <div>
                      <h1 className="text-heading-l dark:text-white transition-colors">
                        Invoices
                      </h1>
                      <p className="text-gray-blue text-body mt-1">
                        {/* Notice we changed this to use filteredInvoices.length! */}
                        There are {filteredInvoices.length} total invoices
                      </p>
                    </div>

                    {/* NEW: Flex container to hold both the Filter and New button */}
                    <div className="flex items-center gap-4 md:gap-10">
                      {/* --- NEW: FILTER DROPDOWN COMPONENT --- */}
                      <div className="relative">
                        <button
                          onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                          className="flex items-center gap-3 text-heading-s font-bold dark:text-white transition-colors"
                        >
                          Filter{" "}
                          <span className="hidden md:inline">by status</span>
                          {/* A little arrow SVG that flips when the menu opens */}
                          <svg
                            width="11"
                            height="7"
                            xmlns="http://www.w3.org/2000/svg"
                            className={`transform transition-transform ${isFilterMenuOpen ? "rotate-180" : ""}`}
                          >
                            <path
                              d="M1 1l4.228 4.228L9.456 1"
                              stroke="#7C5DFA"
                              strokeWidth="2"
                              fill="none"
                              fillRule="evenodd"
                            />
                          </svg>
                        </button>

                        {/* The Dropdown Menu Box */}
                        {isFilterMenuOpen && (
                          <div className="absolute top-full mt-6 left-1/2 -translate-x-1/2 w-[192px] bg-white dark:bg-[#252945] shadow-[0_10px_20px_rgba(0,0,0,0.25)] rounded-lg p-6 flex flex-col gap-4 z-50">
                            {["draft", "pending", "paid"].map((status) => (
                              <label
                                key={status}
                                className="flex items-center gap-3 cursor-pointer group"
                              >
                                <input
                                  type="checkbox"
                                  checked={filterStatuses.includes(status)}
                                  onChange={() => toggleFilter(status)}
                                  // Tailwind's accent color makes standard checkboxes look great quickly!
                                  className="w-4 h-4 accent-primary cursor-pointer border-transparent bg-[#DFE3FA] dark:bg-[#1E2139]"
                                />
                                <span className="text-heading-s font-bold capitalize dark:text-white group-hover:text-primary transition-colors">
                                  {status}
                                </span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Your existing New Invoice Button */}
                      <button
                        onClick={() => setIsFormOpen(true)}
                        className="bg-primary hover:bg-primary-hover text-white px-2 py-2 pr-4 rounded-full font-bold flex items-center gap-4 transition-all"
                      >
                        <div className="bg-white w-8 h-8 rounded-full flex items-center justify-center">
                          <span className="text-primary text-xl">+</span>
                        </div>
                        <span>
                          New <span className="hidden md:inline">Invoice</span>
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Invoice List Section */}
                  <div className="flex flex-col gap-4">
                    {/* Notice we are mapping over filteredInvoices now, not invoices! */}
                    {filteredInvoices.map((invoice) => (
                      <InvoiceCard key={invoice.id} invoice={invoice} />
                    ))}

                    {/* Beautiful Empty State UI */}
                    {filteredInvoices.length === 0 && (
                      <div className="flex flex-col items-center justify-center text-center mt-16 md:mt-32 px-4 transition-colors">
                        <img
                          // Update this path to wherever your SVG is actually saved!
                          src="src/assets/illustration-empty.svg"
                          alt="No invoices"
                          className="w-[193px] h-[160px] md:w-[242px] md:h-[200px] mb-10 md:mb-16"
                        />
                        <h2 className="text-heading-m font-bold text-dark-bg dark:text-white mb-6">
                          There is nothing here
                        </h2>
                        <p className="text-body text-gray-blue dark:text-light-blue max-w-[220px]">
                          Create an invoice by clicking the{" "}
                          <span className="font-bold">New Invoice</span> button
                          and get started
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              }
            />

            <Route path="/invoice/:id" element={<InvoiceDetails />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
