import { Link } from "react-router-dom";

export default function InvoiceCard({ invoice }) {
  // Helper to format currency exactly like the Figma design
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(amount);
  };

  // Helper to get the right colors based on the status
  const getStatusColors = (status) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-[#33D69F]/10 text-[#33D69F] dark:bg-[#33D69F]/10";
      case "pending":
        return "bg-[#FF8F00]/10 text-[#FF8F00] dark:bg-[#FF8F00]/10";
      case "draft":
        return "bg-[#373B53]/10 text-[#373B53] dark:bg-[#DFE3FA]/10 dark:text-[#DFE3FA]";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Link
      to={`/invoice/${invoice.id}`}
      className="flex flex-col md:flex-row items-center justify-between p-6 mb-4 bg-white dark:bg-dark-surface rounded-lg shadow-sm hover:border-primary border border-transparent transition-all cursor-pointer group"
    >
      {/* Mobile: Top Row / Desktop: Left Side */}
      <div className="flex justify-between w-full md:w-auto items-center mb-6 md:mb-0 md:gap-10">
        <span className="font-bold text-heading-s dark:text-white">
          <span className="text-ship-cove">#</span>
          {invoice.id}
        </span>

        {/* Client Name (Mobile only - hidden on desktop) */}
        <span className="text-gray-blue text-body dark:text-white md:hidden">
          {invoice.clientName}
        </span>

        {/* Due Date (Desktop only) */}
        <span className="hidden md:inline text-gray-blue text-body dark:text-light-blue w-28">
          Due {invoice.paymentDue}
        </span>

        {/* Client Name (Desktop only) */}
        <span className="hidden md:inline text-gray-blue text-body dark:text-white w-24">
          {invoice.clientName}
        </span>
      </div>

      {/* Mobile: Bottom Row / Desktop: Right Side */}
      <div className="flex justify-between w-full md:w-auto items-center md:gap-10">
        <div className="flex flex-col md:flex-row md:items-center md:gap-10">
          {/* Due Date (Mobile only) */}
          <span className="text-gray-blue text-body dark:text-light-blue md:hidden mb-2">
            Due {invoice.paymentDue}
          </span>

          <span className="font-bold text-heading-s dark:text-white text-left md:text-right w-24">
            {formatCurrency(invoice.total)}
          </span>
        </div>

        <div className="flex items-center gap-5">
          {/* Status Badge */}
          <div
            className={`flex items-center justify-center w-[104px] h-[40px] rounded-md font-bold capitalize ${getStatusColors(invoice.status)}`}
          >
            {/* The little dot next to the status text */}
            <span className="w-2 h-2 rounded-full mr-2 bg-current"></span>
            {invoice.status}
          </div>

          {/* The purple arrow that shows on hover (Desktop only) */}
          <svg
            width="7"
            height="10"
            xmlns="http://www.w3.org/2000/svg"
            className="hidden md:block opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <path
              d="M1 1l4 4-4 4"
              stroke="#7C5DFA"
              strokeWidth="2"
              fill="none"
              fillRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </Link>
  );
}
