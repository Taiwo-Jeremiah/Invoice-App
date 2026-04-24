import { useState } from "react";
import { useInvoices } from "../context/useInvoices";

export default function InvoiceForm({ isOpen, onClose, invoiceToEdit = null }) {
  const { addInvoice, updateInvoice } = useInvoices();

  const [formData, setFormData] = useState({
    senderStreet: invoiceToEdit?.senderAddress?.street || "",
    senderCity: invoiceToEdit?.senderAddress?.city || "",
    senderPostCode: invoiceToEdit?.senderAddress?.postCode || "",
    senderCountry: invoiceToEdit?.senderAddress?.country || "",
    clientName: invoiceToEdit?.clientName || "",
    clientEmail: invoiceToEdit?.clientEmail || "",
    clientStreet: invoiceToEdit?.clientAddress?.street || "",
    clientCity: invoiceToEdit?.clientAddress?.city || "",
    clientPostCode: invoiceToEdit?.clientAddress?.postCode || "",
    clientCountry: invoiceToEdit?.clientAddress?.country || "",
    createdAt: invoiceToEdit?.createdAt || "",
    paymentTerms: invoiceToEdit?.paymentTerms || "30",
    description: invoiceToEdit?.description || "",
  });

  const [items, setItems] = useState(
    invoiceToEdit?.items || [{ name: "", quantity: 1, price: 0, total: 0 }],
  );

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddItem = () =>
    setItems([...items, { name: "", quantity: 1, price: 0, total: 0 }]);

  const handleRemoveItem = (indexToRemove) =>
    setItems(items.filter((_, i) => i !== indexToRemove));

  const handleItemChange = (index, field, value) => {
    if (field === "name" && errors[`itemName_${index}`]) {
      setErrors({ ...errors, [`itemName_${index}`]: "" });
    }
    const newItems = [...items];
    if (field === "quantity" || field === "price") {
      const numValue = Math.max(0, parseFloat(value) || 0);
      newItems[index][field] = numValue;
      newItems[index].total = newItems[index].quantity * newItems[index].price;
    } else {
      newItems[index][field] = value;
    }
    setItems(newItems);
  };

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    const requiredFields = [
      "senderStreet",
      "senderCity",
      "senderPostCode",
      "senderCountry",
      "clientName",
      "clientEmail",
      "clientStreet",
      "clientCity",
      "clientPostCode",
      "clientCountry",
      "description",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field] || formData[field].trim() === "") {
        newErrors[field] = "can't be empty";
        isValid = false;
      }
    });

    if (formData.clientEmail && formData.clientEmail.trim() !== "") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.clientEmail)) {
        newErrors.clientEmail = "invalid email";
        isValid = false;
      }
    }

    if (items.length === 0) {
      newErrors.items = "An item must be added";
      isValid = false;
    } else {
      items.forEach((item, index) => {
        if (!item.name || item.name.trim() === "") {
          newErrors[`itemName_${index}`] = "can't be empty";
          isValid = false;
        }
      });
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e, status) => {
    e.preventDefault();

    if (status !== "draft") {
      const isValid = validateForm();
      if (!isValid) return;
    }

    const grandTotal = items.reduce((acc, item) => acc + item.total, 0);
    const finalCreatedAt =
      formData.createdAt || new Date().toISOString().split("T")[0];
    const dueDate = new Date(finalCreatedAt);
    dueDate.setDate(dueDate.getDate() + parseInt(formData.paymentTerms));
    const finalPaymentDue = dueDate.toISOString().split("T")[0];

    const newInvoice = {
      createdAt: finalCreatedAt,
      paymentDue: finalPaymentDue,
      description: formData.description,
      paymentTerms: parseInt(formData.paymentTerms),
      clientName: formData.clientName,
      clientEmail: formData.clientEmail,
      status: status,
      senderAddress: {
        street: formData.senderStreet,
        city: formData.senderCity,
        postCode: formData.senderPostCode,
        country: formData.senderCountry,
      },
      clientAddress: {
        street: formData.clientStreet,
        city: formData.clientCity,
        postCode: formData.clientPostCode,
        country: formData.clientCountry,
      },
      items: items,
      total: grandTotal,
    };

    if (invoiceToEdit) {
      updateInvoice({ ...newInvoice, id: invoiceToEdit.id });
    } else {
      addInvoice(newInvoice);
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[40] flex">
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      ></div>

      <div className="relative w-full md:w-[719px] h-full bg-white dark:bg-[#141625] md:pl-[103px] rounded-r-2xl md:rounded-r-[20px] overflow-y-auto transition-colors duration-300">
        <div className="p-6 md:p-14">
          <h2 className="text-heading-m font-bold mb-12 text-[#0C0E16] dark:text-white transition-colors">
            {invoiceToEdit?.id ? (
              <>
                Edit <span className="text-[#7E88C3]">#</span>
                {invoiceToEdit.id}
              </>
            ) : (
              "New Invoice"
            )}
          </h2>

          <form className="flex flex-col gap-12 pb-32">
            {/* --- BILL FROM --- */}
            <section>
              <h3 className="text-primary text-body font-bold mb-6">
                Bill From
              </h3>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label
                    className={`text-body font-medium ${errors.senderStreet ? "text-danger" : "text-[#7E88C3] dark:text-light-blue"}`}
                  >
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="senderStreet"
                    value={formData.senderStreet}
                    onChange={handleInputChange}
                    className={`w-full bg-white dark:bg-[#1E2139] border rounded px-5 py-4 text-heading-s font-bold text-[#0C0E16] dark:text-white focus:outline-none ${errors.senderStreet ? "border-danger" : "border-[#DFE3FA] dark:border-[#252945] focus:border-primary"}`}
                  />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[#7E88C3] dark:text-light-blue text-body">
                      City
                    </label>
                    <input
                      type="text"
                      name="senderCity"
                      value={formData.senderCity}
                      onChange={handleInputChange}
                      className="w-full bg-white dark:bg-[#1E2139] border border-[#DFE3FA] dark:border-[#252945] rounded px-5 py-4 text-heading-s font-bold text-[#0C0E16] dark:text-white"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[#7E88C3] dark:text-light-blue text-body">
                      Post Code
                    </label>
                    <input
                      type="text"
                      name="senderPostCode"
                      value={formData.senderPostCode}
                      onChange={handleInputChange}
                      className="w-full bg-white dark:bg-[#1E2139] border border-[#DFE3FA] dark:border-[#252945] rounded px-5 py-4 text-heading-s font-bold text-[#0C0E16] dark:text-white"
                    />
                  </div>
                  <div className="col-span-2 md:col-span-1 flex flex-col gap-2">
                    <label className="text-[#7E88C3] dark:text-light-blue text-body">
                      Country
                    </label>
                    <input
                      type="text"
                      name="senderCountry"
                      value={formData.senderCountry}
                      onChange={handleInputChange}
                      className="w-full bg-white dark:bg-[#1E2139] border border-[#DFE3FA] dark:border-[#252945] rounded px-5 py-4 text-heading-s font-bold text-[#0C0E16] dark:text-white"
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
                  <label className="text-[#7E88C3] dark:text-light-blue text-body">
                    Client's Name
                  </label>
                  <input
                    type="text"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleInputChange}
                    className="w-full bg-white dark:bg-[#1E2139] border border-[#DFE3FA] dark:border-[#252945] rounded px-5 py-4 text-heading-s font-bold text-[#0C0E16] dark:text-white"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[#7E88C3] dark:text-light-blue text-body">
                    Client's Email
                  </label>
                  <input
                    type="email"
                    name="clientEmail"
                    value={formData.clientEmail}
                    onChange={handleInputChange}
                    className="w-full bg-white dark:bg-[#1E2139] border border-[#DFE3FA] dark:border-[#252945] rounded px-5 py-4 text-heading-s font-bold text-[#0C0E16] dark:text-white"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[#7E88C3] dark:text-light-blue text-body">
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="clientStreet"
                    value={formData.clientStreet}
                    onChange={handleInputChange}
                    className="w-full bg-white dark:bg-[#1E2139] border border-[#DFE3FA] dark:border-[#252945] rounded px-5 py-4 text-heading-s font-bold text-[#0C0E16] dark:text-white"
                  />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[#7E88C3] dark:text-light-blue text-body">
                      City
                    </label>
                    <input
                      type="text"
                      name="clientCity"
                      value={formData.clientCity}
                      onChange={handleInputChange}
                      className="w-full bg-white dark:bg-[#1E2139] border border-[#DFE3FA] dark:border-[#252945] rounded px-5 py-4 text-heading-s font-bold text-[#0C0E16] dark:text-white"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[#7E88C3] dark:text-light-blue text-body">
                      Post Code
                    </label>
                    <input
                      type="text"
                      name="clientPostCode"
                      value={formData.clientPostCode}
                      onChange={handleInputChange}
                      className="w-full bg-white dark:bg-[#1E2139] border border-[#DFE3FA] dark:border-[#252945] rounded px-5 py-4 text-heading-s font-bold text-[#0C0E16] dark:text-white"
                    />
                  </div>
                  <div className="col-span-2 md:col-span-1 flex flex-col gap-2">
                    <label className="text-[#7E88C3] dark:text-light-blue text-body">
                      Country
                    </label>
                    <input
                      type="text"
                      name="clientCountry"
                      value={formData.clientCountry}
                      onChange={handleInputChange}
                      className="w-full bg-white dark:bg-[#1E2139] border border-[#DFE3FA] dark:border-[#252945] rounded px-5 py-4 text-heading-s font-bold text-[#0C0E16] dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[#7E88C3] dark:text-light-blue text-body">
                  Invoice Date
                </label>
                <input
                  type="date"
                  name="createdAt"
                  value={formData.createdAt}
                  onChange={handleInputChange}
                  className="w-full bg-white dark:bg-[#1E2139] border border-[#DFE3FA] dark:border-[#252945] rounded px-5 py-4 text-heading-s font-bold text-[#0C0E16] dark:text-white"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[#7E88C3] dark:text-light-blue text-body">
                  Payment Terms
                </label>
                <select
                  name="paymentTerms"
                  value={formData.paymentTerms}
                  onChange={handleInputChange}
                  className="w-full bg-white dark:bg-[#1E2139] border border-[#DFE3FA] dark:border-[#252945] rounded px-5 py-4 text-heading-s font-bold text-[#0C0E16] dark:text-white"
                >
                  <option value="1">Net 1 Day</option>
                  <option value="7">Net 7 Days</option>
                  <option value="14">Net 14 Days</option>
                  <option value="30">Net 30 Days</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[#7E88C3] dark:text-light-blue text-body">
                Project Description
              </label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full bg-white dark:bg-[#1E2139] border border-[#DFE3FA] dark:border-[#252945] rounded px-5 py-4 text-heading-s font-bold text-[#0C0E16] dark:text-white"
              />
            </div>

            {/* --- ITEM LIST --- */}
            <section className="mt-8">
              <h3 className="text-[#777F98] text-[18px] font-bold mb-6">
                Item List
              </h3>
              <div className="flex flex-col gap-4">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-4 md:grid-cols-12 gap-4 items-center"
                  >
                    <div className="col-span-4 md:col-span-5 flex flex-col gap-2">
                      <label className="text-[#7E88C3] dark:text-light-blue text-body md:hidden">
                        Item Name
                      </label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) =>
                          handleItemChange(index, "name", e.target.value)
                        }
                        className="w-full bg-white dark:bg-[#1E2139] border border-[#DFE3FA] dark:border-[#252945] rounded px-5 py-4 text-heading-s font-bold text-[#0C0E16] dark:text-white"
                      />
                    </div>
                    <div className="col-span-1 md:col-span-2 flex flex-col gap-2">
                      <label className="text-[#7E88C3] dark:text-light-blue text-body md:hidden">
                        Qty.
                      </label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(index, "quantity", e.target.value)
                        }
                        className="w-full bg-white dark:bg-[#1E2139] border border-[#DFE3FA] dark:border-[#252945] rounded px-5 py-4 text-heading-s font-bold text-[#0C0E16] dark:text-white text-center"
                      />
                    </div>
                    <div className="col-span-2 md:col-span-3 flex flex-col gap-2">
                      <label className="text-[#7E88C3] dark:text-light-blue text-body md:hidden">
                        Price
                      </label>
                      <input
                        type="number"
                        value={item.price}
                        onChange={(e) =>
                          handleItemChange(index, "price", e.target.value)
                        }
                        className="w-full bg-white dark:bg-[#1E2139] border border-[#DFE3FA] dark:border-[#252945] rounded px-5 py-4 text-heading-s font-bold text-[#0C0E16] dark:text-white"
                      />
                    </div>
                    <div className="col-span-1 md:col-span-2 flex items-center justify-between">
                      <div className="flex flex-col gap-2">
                        <label className="text-[#7E88C3] dark:text-light-blue text-body md:hidden">
                          Total
                        </label>
                        <div className="py-4 text-heading-s font-bold text-[#7E88C3]">
                          {item.total.toFixed(2)}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="p-2 text-[#888EB0] hover:text-danger"
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
                className="w-full bg-[#F9FAFE] dark:bg-[#252945] text-[#7E88C3] dark:text-[#DFE3FA] py-4 rounded-full font-bold mt-4"
              >
                + Add New Item
              </button>
            </section>
          </form>
        </div>

        {/* --- DYNAMIC ACTION BAR --- */}
        <div className="fixed bottom-0 left-0 w-full md:w-[719px] md:pl-[103px] p-6 bg-white dark:bg-[#141625] shadow-[0_-10px_20px_rgba(0,0,0,0.1)] flex justify-between rounded-br-2xl items-center transition-colors">
          {invoiceToEdit?.id ? (
            <div className="flex justify-end gap-2 w-full">
              <button
                type="button"
                onClick={onClose}
                className="bg-[#F9FAFE] hover:bg-[#DFE3FA] dark:bg-[#252945] dark:hover:bg-white dark:hover:text-[#7E88C3] text-[#7E88C3] dark:text-[#DFE3FA] px-6 py-4 rounded-full font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={(e) => handleSubmit(e, invoiceToEdit.status)}
                className="bg-primary hover:bg-primary-hover text-white px-6 py-4 rounded-full font-bold"
              >
                Save Changes
              </button>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={onClose}
                className="bg-[#F9FAFE] hover:bg-[#DFE3FA] dark:bg-[#252945] dark:hover:bg-white dark:hover:text-[#7E88C3] text-[#7E88C3] dark:text-[#DFE3FA] px-6 py-4 rounded-full font-bold"
              >
                Discard
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e, "draft")}
                  className="bg-[#373B53] hover:bg-[#0C0E16] text-[#888EB0] dark:text-[#DFE3FA] px-6 py-4 rounded-full font-bold"
                >
                  Save as Draft
                </button>
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e, "pending")}
                  className="bg-primary hover:bg-primary-hover text-white px-6 py-4 rounded-full font-bold"
                >
                  Save & Send
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
