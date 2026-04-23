import { useState } from "react"; // <-- No need to import useEffect anymore!
import { useInvoices } from "../context/useInvoices";

export default function InvoiceForm({ isOpen, onClose, invoiceToEdit = null }) {
  // 1. Bring in BOTH functions from your context (Don't forget updateInvoice!)
  const { addInvoice, updateInvoice } = useInvoices();

  // 2. Initialize state DIRECTLY with the edit data!
  // We use the optional chaining (?.) so it doesn't crash if invoiceToEdit is null
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

  // 3. Initialize the items directly too
  const [items, setItems] = useState(
    invoiceToEdit?.items || [{ name: "", quantity: 1, price: 0, total: 0 }],
  );

  // 1. NEW: State to hold our validation errors
  const [errors, setErrors] = useState({});
  // --- HANDLERS ---

  // Generic handler for all standard text inputs
  const handleInputChange = (e) => {
    // Clear the error for this field when the user starts typing
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
    // NEW: Clear the specific item error when they start typing
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

  // --- NEW: VALIDATION LOGIC ---
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

    // 1. Basic empty checks for all main fields
    requiredFields.forEach((field) => {
      if (!formData[field] || formData[field].trim() === "") {
        newErrors[field] = "can't be empty";
        isValid = false;
      }
    });

    // 2. Email Format Check (Only runs if it's not already completely empty)
    if (formData.clientEmail && formData.clientEmail.trim() !== "") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.clientEmail)) {
        newErrors.clientEmail = "invalid email";
        isValid = false;
      }
    }

    // 3. Item List Validation
    if (items.length === 0) {
      newErrors.items = "An item must be added";
      isValid = false;
    } else {
      // Loop through every item and check if its name is blank
      items.forEach((item, index) => {
        if (!item.name || item.name.trim() === "") {
          // Create a unique error key for this specific item row
          newErrors[`itemName_${index}`] = "can't be empty";
          isValid = false;
        }
      });
    }

    setErrors(newErrors);
    return isValid;
  };

  // --- THE MAGIC SUBMIT FUNCTION ---
  const handleSubmit = (e, status) => {
    e.preventDefault();

    // NEW: Only validate if they are trying to send it!
    if (status === "pending") {
      const isValid = validateForm();
      if (!isValid) return; // This instantly stops the save if there are errors!
    }

    // 1. Calculate the grand total
    const grandTotal = items.reduce((acc, item) => acc + item.total, 0);

    // 2. Fix the Date Logic
    // Grab the date the user picked, or use today's date if they left it blank
    const finalCreatedAt =
      formData.createdAt || new Date().toISOString().split("T")[0];

    // Calculate the actual Due Date by adding the payment terms (e.g., + 30 days)
    const dueDate = new Date(finalCreatedAt);
    dueDate.setDate(dueDate.getDate() + parseInt(formData.paymentTerms));
    const finalPaymentDue = dueDate.toISOString().split("T")[0];

    // 3. Package the data
    const newInvoice = {
      createdAt: finalCreatedAt,
      paymentDue: finalPaymentDue, // <-- Now this will have a real date!
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

    // ... inside handleSubmit, after defining newInvoice ...

    if (invoiceToEdit) {
      // If we are editing, attach the existing ID and update
      updateInvoice({ ...newInvoice, id: invoiceToEdit.id });
    } else {
      // If we are creating, just add it like normal
      addInvoice(newInvoice);
    }

    onClose();
    // console.log("SENDING TO CONTEXT: ", newInvoice);
    // addInvoice(newInvoice);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[40] flex">
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      ></div>

      <div className="relative w-full md:w-[719px] h-full bg-white dark:bg-dark-bg md:pl-[103px] rounded-r-2xl md:rounded-r-[20px] overflow-y-auto transition-transform duration-300 ease-in-out">
        <div className="p-6 md:p-14">
          <h2 className="text-heading-m font-bold mb-12 dark:text-white">
            New Invoice
          </h2>

          <form className="flex flex-col gap-12" id="invoice-form">
            {/* --- BILL FROM --- */}
            <section>
              <h3 className="text-primary text-body font-bold mb-6">
                Bill From
              </h3>
              <div className="flex flex-col gap-6">
                {/* Sender Street */}
                <div className="flex flex-col gap-2 relative">
                  <div className="flex justify-between items-center">
                    <label
                      className={`text-body ${errors.senderStreet ? "text-danger" : "text-gray-blue dark:text-light-blue"}`}
                    >
                      Street Address
                    </label>
                    {errors.senderStreet && (
                      <span className="text-danger text-body text-[10px]">
                        {errors.senderStreet}
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    name="senderStreet"
                    value={formData.senderStreet}
                    onChange={handleInputChange}
                    className={`w-full bg-white dark:bg-dark-surface border rounded px-5 py-4 text-heading-s font-bold dark:text-white focus:outline-none ${
                      errors.senderStreet
                        ? "border-danger focus:border-danger"
                        : "border-border dark:border-[#252945] focus:border-primary"
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {/* Sender City */}
                  <div className="flex flex-col gap-2 relative">
                    <div className="flex justify-between items-center">
                      <label
                        className={`text-body ${errors.senderCity ? "text-danger" : "text-gray-blue dark:text-light-blue"}`}
                      >
                        City
                      </label>
                      {errors.senderCity && (
                        <span className="text-danger text-body text-[10px]">
                          {errors.senderCity}
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      name="senderCity"
                      value={formData.senderCity}
                      onChange={handleInputChange}
                      className={`w-full bg-white dark:bg-dark-surface border rounded px-5 py-4 text-heading-s font-bold dark:text-white focus:outline-none ${
                        errors.senderCity
                          ? "border-danger focus:border-danger"
                          : "border-border dark:border-[#252945] focus:border-primary"
                      }`}
                    />
                  </div>

                  {/* Sender Post Code */}
                  <div className="flex flex-col gap-2 relative">
                    <div className="flex justify-between items-center">
                      <label
                        className={`text-body ${errors.senderPostCode ? "text-danger" : "text-gray-blue dark:text-light-blue"}`}
                      >
                        Post Code
                      </label>
                      {errors.senderPostCode && (
                        <span className="text-danger text-body text-[10px]">
                          {errors.senderPostCode}
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      name="senderPostCode"
                      value={formData.senderPostCode}
                      onChange={handleInputChange}
                      className={`w-full bg-white dark:bg-dark-surface border rounded px-5 py-4 text-heading-s font-bold dark:text-white focus:outline-none ${
                        errors.senderPostCode
                          ? "border-danger focus:border-danger"
                          : "border-border dark:border-[#252945] focus:border-primary"
                      }`}
                    />
                  </div>

                  {/* Sender Country */}
                  <div className="col-span-2 md:col-span-1 flex flex-col gap-2 relative">
                    <div className="flex justify-between items-center">
                      <label
                        className={`text-body ${errors.senderCountry ? "text-danger" : "text-gray-blue dark:text-light-blue"}`}
                      >
                        Country
                      </label>
                      {errors.senderCountry && (
                        <span className="text-danger text-body text-[10px]">
                          {errors.senderCountry}
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      name="senderCountry"
                      value={formData.senderCountry}
                      onChange={handleInputChange}
                      className={`w-full bg-white dark:bg-dark-surface border rounded px-5 py-4 text-heading-s font-bold dark:text-white focus:outline-none ${
                        errors.senderCountry
                          ? "border-danger focus:border-danger"
                          : "border-border dark:border-[#252945] focus:border-primary"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* --- BILL TO --- */}
            <section>
              <h3 className="text-primary text-body font-bold mb-6">Bill To</h3>
              <div className="flex flex-col gap-6">
                {/* Client Name */}
                <div className="flex flex-col gap-2 relative">
                  <div className="flex justify-between items-center">
                    <label
                      className={`text-body ${errors.clientName ? "text-danger" : "text-gray-blue dark:text-light-blue"}`}
                    >
                      Client's Name
                    </label>
                    {errors.clientName && (
                      <span className="text-danger text-body text-[10px]">
                        {errors.clientName}
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleInputChange}
                    className={`w-full bg-white dark:bg-dark-surface border rounded px-5 py-4 text-heading-s font-bold dark:text-white focus:outline-none ${
                      errors.clientName
                        ? "border-danger focus:border-danger"
                        : "border-border dark:border-[#252945] focus:border-primary"
                    }`}
                  />
                </div>

                {/* Client Email */}
                <div className="flex flex-col gap-2 relative">
                  <div className="flex justify-between items-center">
                    <label
                      className={`text-body ${errors.clientEmail ? "text-danger" : "text-gray-blue dark:text-light-blue"}`}
                    >
                      Client's Email
                    </label>
                    {errors.clientEmail && (
                      <span className="text-danger text-body text-[10px]">
                        {errors.clientEmail}
                      </span>
                    )}
                  </div>
                  <input
                    type="email"
                    name="clientEmail"
                    value={formData.clientEmail}
                    onChange={handleInputChange}
                    className={`w-full bg-white dark:bg-dark-surface border rounded px-5 py-4 text-heading-s font-bold dark:text-white focus:outline-none ${
                      errors.clientEmail
                        ? "border-danger focus:border-danger"
                        : "border-border dark:border-[#252945] focus:border-primary"
                    }`}
                  />
                </div>

                {/* Client Street */}
                <div className="flex flex-col gap-2 relative">
                  <div className="flex justify-between items-center">
                    <label
                      className={`text-body ${errors.clientStreet ? "text-danger" : "text-gray-blue dark:text-light-blue"}`}
                    >
                      Street Address
                    </label>
                    {errors.clientStreet && (
                      <span className="text-danger text-body text-[10px]">
                        {errors.clientStreet}
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    name="clientStreet"
                    value={formData.clientStreet}
                    onChange={handleInputChange}
                    className={`w-full bg-white dark:bg-dark-surface border rounded px-5 py-4 text-heading-s font-bold dark:text-white focus:outline-none ${
                      errors.clientStreet
                        ? "border-danger focus:border-danger"
                        : "border-border dark:border-[#252945] focus:border-primary"
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {/* Client City */}
                  <div className="flex flex-col gap-2 relative">
                    <div className="flex justify-between items-center">
                      <label
                        className={`text-body ${errors.clientCity ? "text-danger" : "text-gray-blue dark:text-light-blue"}`}
                      >
                        City
                      </label>
                      {errors.clientCity && (
                        <span className="text-danger text-body text-[10px]">
                          {errors.clientCity}
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      name="clientCity"
                      value={formData.clientCity}
                      onChange={handleInputChange}
                      className={`w-full bg-white dark:bg-dark-surface border rounded px-5 py-4 text-heading-s font-bold dark:text-white focus:outline-none ${
                        errors.clientCity
                          ? "border-danger focus:border-danger"
                          : "border-border dark:border-[#252945] focus:border-primary"
                      }`}
                    />
                  </div>

                  {/* Client Post Code */}
                  <div className="flex flex-col gap-2 relative">
                    <div className="flex justify-between items-center">
                      <label
                        className={`text-body ${errors.clientPostCode ? "text-danger" : "text-gray-blue dark:text-light-blue"}`}
                      >
                        Post Code
                      </label>
                      {errors.clientPostCode && (
                        <span className="text-danger text-body text-[10px]">
                          {errors.clientPostCode}
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      name="clientPostCode"
                      value={formData.clientPostCode}
                      onChange={handleInputChange}
                      className={`w-full bg-white dark:bg-dark-surface border rounded px-5 py-4 text-heading-s font-bold dark:text-white focus:outline-none ${
                        errors.clientPostCode
                          ? "border-danger focus:border-danger"
                          : "border-border dark:border-[#252945] focus:border-primary"
                      }`}
                    />
                  </div>

                  {/* Client Country */}
                  <div className="col-span-2 md:col-span-1 flex flex-col gap-2 relative">
                    <div className="flex justify-between items-center">
                      <label
                        className={`text-body ${errors.clientCountry ? "text-danger" : "text-gray-blue dark:text-light-blue"}`}
                      >
                        Country
                      </label>
                      {errors.clientCountry && (
                        <span className="text-danger text-body text-[10px]">
                          {errors.clientCountry}
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      name="clientCountry"
                      value={formData.clientCountry}
                      onChange={handleInputChange}
                      className={`w-full bg-white dark:bg-dark-surface border rounded px-5 py-4 text-heading-s font-bold dark:text-white focus:outline-none ${
                        errors.clientCountry
                          ? "border-danger focus:border-danger"
                          : "border-border dark:border-[#252945] focus:border-primary"
                      }`}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-6 mt-6">
                  {/* Date and Payment Terms stay exactly as they were, no validation needed! */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2 relative">
                      <label className="text-body text-gray-blue dark:text-light-blue">
                        Invoice Date
                      </label>
                      <input
                        type="date"
                        name="createdAt"
                        value={formData.createdAt}
                        onChange={handleInputChange}
                        max="9999-12-31"
                        className="w-full bg-white dark:bg-dark-surface border border-border dark:border-[#252945] rounded px-5 py-4 text-heading-s font-bold dark:text-white focus:outline-none focus:border-primary cursor-pointer"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-body text-gray-blue dark:text-light-blue">
                        Payment Terms
                      </label>
                      <select
                        name="paymentTerms"
                        value={formData.paymentTerms}
                        onChange={handleInputChange}
                        className="w-full bg-white dark:bg-dark-surface border border-border dark:border-[#252945] rounded px-5 py-4 text-heading-s font-bold dark:text-white focus:outline-none focus:border-primary cursor-pointer"
                      >
                        <option value="1">Net 1 Day</option>
                        <option value="7">Net 7 Days</option>
                        <option value="14">Net 14 Days</option>
                        <option value="30">Net 30 Days</option>
                      </select>
                    </div>
                  </div>

                  {/* Project Description */}
                  <div className="flex flex-col gap-2 relative">
                    <div className="flex justify-between items-center">
                      <label
                        className={`text-body ${errors.description ? "text-danger" : "text-gray-blue dark:text-light-blue"}`}
                      >
                        Project Description
                      </label>
                      {errors.description && (
                        <span className="text-danger text-body text-[10px]">
                          {errors.description}
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className={`w-full bg-white dark:bg-dark-surface border rounded px-5 py-4 text-heading-s font-bold dark:text-white focus:outline-none ${
                        errors.description
                          ? "border-danger focus:border-danger"
                          : "border-border dark:border-[#252945] focus:border-primary"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* --- DYNAMIC ITEM LIST --- */}
            <section className="mt-8 mb-20">
              {/* NEW: Added a flexbox to hold the title and the error message */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-[#777F98] text-[18px] font-bold">
                  Item List
                </h3>
                {errors.items && (
                  <span className="text-danger text-body text-[10px]">
                    {errors.items}
                  </span>
                )}
              </div>
              <div className="hidden md:grid grid-cols-12 gap-4 mb-4 text-body text-gray-blue dark:text-light-blue">
                <div className="col-span-5">Item Name</div>
                <div className="col-span-2">Qty.</div>
                <div className="col-span-3">Price</div>
                <div className="col-span-2">Total</div>
              </div>
              <div className="flex flex-col gap-12 md:gap-4 mb-4">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-4 md:grid-cols-12 gap-4 items-center"
                  >
                    {/* Item Name Column */}
                    <div className="col-span-4 md:col-span-5 flex flex-col gap-2 relative">
                      <div className="flex justify-between items-center">
                        <label
                          className={`text-body md:hidden ${errors[`itemName_${index}`] ? "text-danger" : "text-gray-blue dark:text-light-blue"}`}
                        >
                          Item Name
                        </label>
                        {errors[`itemName_${index}`] && (
                          <span className="text-danger text-body text-[10px] ml-auto">
                            {errors[`itemName_${index}`]}
                          </span>
                        )}
                      </div>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) =>
                          handleItemChange(index, "name", e.target.value)
                        }
                        className={`w-full bg-white dark:bg-dark-surface border rounded px-5 py-4 text-heading-s font-bold dark:text-white focus:outline-none ${
                          errors[`itemName_${index}`]
                            ? "border-danger focus:border-danger"
                            : "border-border dark:border-[#252945] focus:border-primary"
                        }`}
                      />
                    </div>
                    <div className="col-span-1 md:col-span-2 flex flex-col gap-2">
                      <label className="text-body text-gray-blue dark:text-light-blue md:hidden">
                        Qty.
                      </label>
                      <input
                        type="number"
                        min="1"
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
                        min="1"
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
            <button
              type="button"
              onClick={(e) => handleSubmit(e, "draft")}
              className="bg-[#373B53] hover:bg-[#0C0E16] dark:bg-[#373B53] dark:hover:bg-[#1E2139] text-[#888EB0] dark:text-[#DFE3FA] px-6 py-4 rounded-full font-bold transition-colors"
            >
              Save as Draft
            </button>
            <button
              type="button"
              onClick={(e) => handleSubmit(e, "pending")}
              className="bg-primary hover:bg-primary-hover text-white px-6 py-4 rounded-full font-bold transition-colors"
            >
              Save & Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
