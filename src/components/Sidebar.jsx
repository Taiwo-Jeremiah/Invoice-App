import { Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Sidebar() {
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme") === "dark",
  );

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  return (
    <aside className="fixed z-50 flex flex-row items-center justify-between w-full h-[72px] bg-[#373B53] md:flex-col md:w-[103px] md:h-screen md:rounded-r-3xl transition-all">
      {/* Logo Section */}
      <Link
        to="/"
        className="relative flex items-center justify-center w-[72px] h-[72px] bg-primary rounded-r-2xl md:w-full md:h-[103px] overflow-hidden"
      >
        <div className="absolute bottom-0 w-full h-1/2 bg-primary-hover rounded-tl-2xl" />
        <div className="relative z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center">
          <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-primary border-b-[8px] border-b-transparent ml-1" />
        </div>
      </Link>

      <div className="flex flex-row items-center md:flex-col">
        {/* Theme Toggle */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-6 md:p-8 text-ship-cove hover:text-light-blue transition-colors outline-none"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Divider */}
        <div className="w-px h-[72px] bg-[#494E6E] md:w-full md:h-px" />

        {/* Avatar */}
        <div className="p-6 md:p-6">
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jeremiah"
            alt="Avatar"
            className="w-8 h-8 rounded-full border-2 border-transparent hover:border-primary transition-all cursor-pointer"
          />
        </div>
      </div>
    </aside>
  );
}
