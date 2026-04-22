import { useState } from "react";

export default function InvoiceForm({ isOpen, onClose }) {
  // Your state
  const [items, setItems] = useState([
    { name: "", quantity: 1, price: 0, total: 0 },
  ]);

  // --- LOGIC ---
  const handleAddItem = () => {
    setItems([...items, { name: "", quantity: 1, price: 0, total: 0 }]);
  };

  const handleRemoveItem = (indexToRemove) => {
    setItems(items.filter((_, index) => index !== indexToRemove));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];

    if (field === "quantity" || field === "price") {
      const numValue = parseFloat(value) || 0;
      newItems[index][field] = numValue;
      newItems[index].total = newItems[index].quantity * newItems[index].price;
    } else {
      newItems[index][field] = value;
    }

    setItems(newItems);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[40] flex">
      {/* Dark Overlay */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* The Form Drawer */}
      <div className="relative w-full md:w-[719px] h-full bg-white dark:bg-dark-bg md:pl-[103px] rounded-r-2xl md:rounded-r-[20px] overflow-y-auto transition-transform duration-300 ease-in-out">
        <div className="p-6 md:p-14">
          <h2 className="text-heading-m font-bold mb-12 dark:text-white">
            New Invoice
          </h2>

          <form className="flex flex-col gap-12">
            {/* --- BILL FROM --- */}
            <section>
              <h3 className="text-primary text-body font-bold mb-6">
                Bill From
              </h3>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-body text-gray-blue dark:text-light-blue">
                    Street Address
                  </label>
                  <input
                    type="text"
                    className="w-full bg-white dark:bg-dark-surface border border-border dark:border-[#252945] rounded px-5 py-4 text-heading-s font-bold dark:text-white focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-body text-gray-blue dark:text-light-blue">
                      City
                    </label>
                    <input
                      type="text"
                      className="w-full bg-white dark:bg-dark-surface border border-border dark:border-[#252945] rounded px-5 py-4 text-heading-s font-bold dark:text-white focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-body text-gray-blue dark:text-light-blue">
                      Post Code
                    </label>
                    <input
                      type="text"
                      className="w-full bg-white dark:bg-dark-surface border border-border dark:border-[#252945] rounded px-5 py-4 text-heading-s font-bold dark:text-white focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="col-span-2 md:col-span-1 flex flex-col gap-2">
                    <label className="text-body text-gray-blue dark:text-light-blue">
                      Country
                    </label>
                    <input
                      type="text"
                      className="w-full bg-white dark:bg-dark-surface border border-border dark:border-[#252945] rounded px-5 py-4 text-heading-s font-bold dark:text-white focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* --- BILL TO --- */}
            <section>
              <h3 className="text-primary text-body font-bold mb-6">Bill To</h3>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-body text-gray-blue dark:text-light-blue">
                    Client's Name
                  </label>
                  <input
                    type="text"
                    className="w-full bg-white dark:bg-dark-surface border border-border dark:border-[#252945] rounded px-5 py-4 text-heading-s font-bold dark:text-white focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-body text-gray-blue dark:text-light-blue">
                    Client's Email
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. email@example.com"
                    className="w-full bg-white dark:bg-dark-surface border border-border dark:border-[#252945] rounded px-5 py-4 text-heading-s font-bold dark:text-white focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-body text-gray-blue dark:text-light-blue">
                    Street Address
                  </label>
                  <input
                    type="text"
                    className="w-full bg-white dark:bg-dark-surface border border-border dark:border-[#252945] rounded px-5 py-4 text-heading-s font-bold dark:text-white focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-body text-gray-blue dark:text-light-blue">
                      City
                    </label>
                    <input
                      type="text"
                      className="w-full bg-white dark:bg-dark-surface border border-border dark:border-[#252945] rounded px-5 py-4 text-heading-s font-bold dark:text-white focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-body text-gray-blue dark:text-light-blue">
                      Post Code
                    </label>
                    <input
                      type="text"
                      className="w-full bg-white dark:bg-dark-surface border border-border dark:border-[#252945] rounded px-5 py-4 text-heading-s font-bold dark:text-white focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="col-span-2 md:col-span-1 flex flex-col gap-2">
                    <label className="text-body text-gray-blue dark:text-light-blue">
                      Country
                    </label>
                    <input
                      type="text"
                      className="w-full bg-white dark:bg-dark-surface border border-border dark:border-[#252945] rounded px-5 py-4 text-heading-s font-bold dark:text-white focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                {/* --- INVOICE DETAILS --- */}
                <div className="flex flex-col gap-6 mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2 relative">
                      <label className="text-body text-gray-blue dark:text-light-blue">
                        Invoice Date
                      </label>
                      <input
                        type="date"
                        max="9999-12-31"
                        className="w-full bg-white dark:bg-dark-surface border border-border dark:border-[#252945] rounded px-5 py-4 text-heading-s font-bold dark:text-white focus:outline-none focus:border-primary cursor-pointer"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-body text-gray-blue dark:text-light-blue">
                        Payment Terms
                      </label>
                      <select className="w-full bg-white dark:bg-dark-surface border border-border dark:border-[#252945] rounded px-5 py-4 text-heading-s font-bold dark:text-white focus:outline-none focus:border-primary cursor-pointer">
                        <option value="1">Net 1 Day</option>
                        <option value="7">Net 7 Days</option>
                        <option value="14">Net 14 Days</option>
                        <option value="30">Net 30 Days</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-body text-gray-blue dark:text-light-blue">
                      Project Description
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Graphic Design"
                      className="w-full bg-white dark:bg-dark-surface border border-border dark:border-[#252945] rounded px-5 py-4 text-heading-s font-bold dark:text-white focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* --- DYNAMIC ITEM LIST --- */}
            <section className="mt-8 mb-20">
              <h3 className="text-[#777F98] text-[18px] font-bold mb-6">
                Item List
              </h3>

              {/* Desktop Column Headers */}
              <div className="hidden md:grid grid-cols-12 gap-4 mb-4 text-body text-gray-blue dark:text-light-blue">
                <div className="col-span-5">Item Name</div>
                <div className="col-span-2">Qty.</div>
                <div className="col-span-3">Price</div>
                <div className="col-span-2">Total</div>
              </div>

              {/* Dynamic Item Rows */}
              <div className="flex flex-col gap-12 md:gap-4 mb-4">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-4 md:grid-cols-12 gap-4 items-center"
                  >
                    <div className="col-span-4 md:col-span-5 flex flex-col gap-2">
                      <label className="text-body text-gray-blue dark:text-light-blue md:hidden">
                        Item Name
                      </label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) =>
                          handleItemChange(index, "name", e.target.value)
                        }
                        className="w-full bg-white dark:bg-dark-surface border border-border dark:border-[#252945] rounded px-5 py-4 text-heading-s font-bold dark:text-white focus:outline-none focus:border-primary"
                      />
                    </div>

                    <div className="col-span-1 md:col-span-2 flex flex-col gap-2">
                      <label className="text-body text-gray-blue dark:text-light-blue md:hidden">
                        Qty.
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(index, "quantity", e.target.value)
                        }
                        className="w-full bg-white dark:bg-dark-surface border border-border dark:border-[#252945] rounded px-5 py-4 text-heading-s font-bold dark:text-white focus:outline-none focus:border-primary text-center"
                      />
                    </div>

                    <div className="col-span-2 md:col-span-3 flex flex-col gap-2">
                      <label className="text-body text-gray-blue dark:text-light-blue md:hidden">
                        Price
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.price}
                        onChange={(e) =>
                          handleItemChange(index, "price", e.target.value)
                        }
                        className="w-full bg-white dark:bg-dark-surface border border-border dark:border-[#252945] rounded px-5 py-4 text-heading-s font-bold dark:text-white focus:outline-none focus:border-primary"
                      />
                    </div>

                    <div className="col-span-1 md:col-span-2 flex items-center justify-between">
                      <div className="flex flex-col gap-2 w-full">
                        <label className="text-body text-gray-blue dark:text-light-blue md:hidden">
                          Total
                        </label>
                        <div className="py-4 text-heading-s font-bold text-gray-blue dark:text-light-blue bg-transparent border border-transparent">
                          {item.total.toFixed(2)}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="mt-6 md:mt-0 p-2 text-[#888EB0] hover:text-danger transition-colors"
                      >
                        <svg
                          width="13"
                          height="16"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M11.583 3.556v10.666c0 .982-.795 1.778-1.777 1.778H2.694a1.777 1.777 0 01-1.777-1.778V3.556h10.666zM8.473 0l.888.889h3.111v1.778H.028V.889h3.11L4.029 0h4.444z"
                            fill="currentColor"
                            fillRule="nonzero"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleAddItem}
                className="w-full bg-[#F9FAFE] dark:bg-[#252945] hover:bg-[#DFE3FA] text-[#7E88C3] dark:text-[#DFE3FA] py-4 rounded-full font-bold transition-colors mt-4"
              >
                + Add New Item
              </button>
            </section>
          </form>
        </div>

        {/* --- BOTTOM ACTION BAR --- */}
        <div className="fixed bottom-0 left-0 w-full md:w-[719px] md:pl-[103px] p-6 bg-white dark:bg-dark-bg shadow-[0_-10px_20px_rgba(0,0,0,0.05)] flex justify-between rounded-br-2xl">
          <button
            onClick={onClose}
            className="bg-[#F9FAFE] hover:bg-[#DFE3FA] dark:bg-[#252945] dark:hover:bg-white dark:hover:text-gray-blue text-[#7E88C3] dark:text-[#DFE3FA] px-6 py-4 rounded-full font-bold transition-colors"
          >
            Discard
          </button>
          <div className="flex gap-2">
            <button className="bg-[#373B53] hover:bg-[#0C0E16] dark:bg-[#373B53] dark:hover:bg-[#1E2139] text-[#888EB0] dark:text-[#DFE3FA] px-6 py-4 rounded-full font-bold transition-colors">
              Save as Draft
            </button>
            <button className="bg-primary hover:bg-primary-hover text-white px-6 py-4 rounded-full font-bold transition-colors">
              Save & Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
