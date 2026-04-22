import { useParams, Link } from "react-router-dom";
import { useInvoices } from "../context/useInvoices";

export default function InvoiceDetails() {
  // useParams grabs the ":id" from the URL
  const { id } = useParams();
  const { invoices } = useInvoices();

  // Find the specific invoice from our global state
  const invoice = invoices.find((inv) => inv.id === id);

  // Fallback UI if someone types a bad ID in the URL
  if (!invoice) {
    return (
      <div className="text-center mt-20 dark:text-white">
        <h2 className="text-heading-m">Invoice not found</h2>
        <Link
          to="/"
          className="text-primary hover:text-primary-hover mt-4 inline-block"
        >
          Go back to Home
        </Link>
      </div>
    );
  }

  // Formatting helpers
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(amount);
  };

  const getStatusColors = (status) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-[#33D69F]/10 text-[#33D69F]";
      case "pending":
        return "bg-[#FF8F00]/10 text-[#FF8F00]";
      case "draft":
        return "bg-[#373B53]/10 text-[#373B53] dark:bg-[#DFE3FA]/10 dark:text-[#DFE3FA]";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="w-full">
      {/* Back Button */}
      <Link
        to="/"
        className="flex items-center gap-6 mb-8 hover:text-gray-blue dark:text-white transition-colors group w-fit"
      >
        <svg width="7" height="10" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M6.342.886L2.114 5.114l4.228 4.228"
            stroke="#9277FF"
            strokeWidth="2"
            fill="none"
            fillRule="evenodd"
          />
        </svg>
        <span className="font-bold pt-1">Go back</span>
      </Link>

      {/* Action Header Card */}
      <div className="bg-white dark:bg-dark-surface flex flex-row items-center justify-between p-6 md:px-8 rounded-lg shadow-sm mb-6 transition-colors">
        <div className="flex justify-between items-center w-full md:w-auto md:gap-4">
          <span className="text-gray-blue dark:text-light-blue text-body">
            Status
          </span>
          <div
            className={`flex items-center justify-center w-[104px] h-[40px] rounded-md font-bold capitalize ${getStatusColors(invoice.status)}`}
          >
            <span className="w-2 h-2 rounded-full mr-2 bg-current"></span>
            {invoice.status}
          </div>
        </div>

        {/* Desktop Buttons (Hidden on mobile) */}
        <div className="hidden md:flex gap-2">
          <button className="bg-[#F9FAFE] hover:bg-[#DFE3FA] dark:bg-[#252945] dark:hover:bg-white dark:hover:text-gray-blue text-[#7E88C3] dark:text-[#DFE3FA] px-6 py-4 rounded-full font-bold transition-colors">
            Edit
          </button>
          <button className="bg-danger hover:bg-danger-hover text-white px-6 py-4 rounded-full font-bold transition-colors">
            Delete
          </button>
          {invoice.status !== "paid" && (
            <button className="bg-primary hover:bg-primary-hover text-white px-6 py-4 rounded-full font-bold transition-colors">
              Mark as Paid
            </button>
          )}
        </div>
      </div>

      {/* Invoice Details Card */}
      <div className="bg-white dark:bg-dark-surface p-6 md:p-12 rounded-lg shadow-sm transition-colors">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row md:justify-between mb-8 md:mb-12">
          <div className="mb-8 md:mb-0">
            <h1 className="text-heading-s font-bold dark:text-white">
              <span className="text-ship-cove">#</span>
              {invoice.id}
            </h1>
            <p className="text-gray-blue dark:text-light-blue text-body mt-2">
              {invoice.description}
            </p>
          </div>
          <div className="text-gray-blue dark:text-light-blue text-body text-left md:text-right">
            <p>{invoice.senderAddress.street}</p>
            <p>{invoice.senderAddress.city}</p>
            <p>{invoice.senderAddress.postCode}</p>
            <p>{invoice.senderAddress.country}</p>
          </div>
        </div>

        {/* Middle Section (Grid) */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-12">
          <div className="flex flex-col justify-between">
            <div>
              <p className="text-gray-blue dark:text-light-blue text-body mb-3">
                Invoice Date
              </p>
              <p className="text-heading-s font-bold dark:text-white">
                {invoice.createdAt}
              </p>
            </div>
            <div>
              <p className="text-gray-blue dark:text-light-blue text-body mb-3 mt-8">
                Payment Due
              </p>
              <p className="text-heading-s font-bold dark:text-white">
                {invoice.paymentDue}
              </p>
            </div>
          </div>

          <div>
            <p className="text-gray-blue dark:text-light-blue text-body mb-3">
              Bill To
            </p>
            <p className="text-heading-s font-bold dark:text-white mb-2">
              {invoice.clientName}
            </p>
            <div className="text-gray-blue dark:text-light-blue text-body">
              <p>{invoice.clientAddress.street}</p>
              <p>{invoice.clientAddress.city}</p>
              <p>{invoice.clientAddress.postCode}</p>
              <p>{invoice.clientAddress.country}</p>
            </div>
          </div>

          <div className="col-span-2 md:col-span-1 mt-8 md:mt-0">
            <p className="text-gray-blue dark:text-light-blue text-body mb-3">
              Sent To
            </p>
            <p className="text-heading-s font-bold dark:text-white">
              {invoice.clientEmail}
            </p>
          </div>
        </div>

        {/* Items Table */}
        <div className="bg-[#F9FAFE] dark:bg-[#252945] rounded-t-lg p-6 md:p-8 transition-colors">
          {/* Table Header (Desktop only) */}
          <div className="hidden md:grid grid-cols-5 gap-4 mb-6 text-gray-blue dark:text-light-blue text-body">
            <div className="col-span-2">Item Name</div>
            <div className="text-center">QTY.</div>
            <div className="text-right">Price</div>
            <div className="text-right">Total</div>
          </div>

          {/* Item Rows */}
          {invoice.items.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center md:grid md:grid-cols-5 md:gap-4 mb-6 last:mb-0"
            >
              <div className="md:col-span-2 font-bold text-heading-s dark:text-white">
                {item.name}
                {/* Mobile Qty & Price */}
                <div className="md:hidden text-gray-blue dark:text-light-blue text-body mt-2 font-bold">
                  {item.quantity} x {formatCurrency(item.price)}
                </div>
              </div>
              <div className="hidden md:block text-center font-bold text-gray-blue dark:text-light-blue">
                {item.quantity}
              </div>
              <div className="hidden md:block text-right font-bold text-gray-blue dark:text-light-blue">
                {formatCurrency(item.price)}
              </div>
              <div className="text-right font-bold text-heading-s dark:text-white">
                {formatCurrency(item.total)}
              </div>
            </div>
          ))}
        </div>

        {/* Grand Total */}
        <div className="bg-[#373B53] dark:bg-[#0C0E16] rounded-b-lg p-6 md:p-8 flex justify-between items-center transition-colors">
          <p className="text-white text-body">Amount Due</p>
          <p className="text-white text-2xl font-bold">
            {formatCurrency(invoice.total)}
          </p>
        </div>
      </div>

      {/* Mobile Buttons (Shows below card on mobile) */}
      <div className="md:hidden bg-white dark:bg-dark-surface p-6 mt-6 flex justify-center gap-2 rounded-lg shadow-sm transition-colors">
        <button className="bg-[#F9FAFE] hover:bg-[#DFE3FA] dark:bg-[#252945] dark:hover:bg-white dark:hover:text-gray-blue text-[#7E88C3] dark:text-[#DFE3FA] px-6 py-4 rounded-full font-bold transition-colors">
          Edit
        </button>
        <button className="bg-danger hover:bg-danger-hover text-white px-6 py-4 rounded-full font-bold transition-colors">
          Delete
        </button>
        {invoice.status !== "paid" && (
          <button className="bg-primary hover:bg-primary-hover text-white px-6 py-4 rounded-full font-bold transition-colors">
            Mark as Paid
          </button>
        )}
      </div>
    </div>
  );
}
