import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="flex justify-between items-center p-6 relative z-50">
      <h1
        onClick={() => navigate("/")}
        className="text-3xl font-bold cursor-pointer"
      >
        Talkingo
      </h1>

      {/* Burger icon for mobile */}
      <div className="lg:hidden">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-black focus:outline-none"
        >
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path
              d="M4 6h16M4 12h16M4 18h16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {/* Navigation menu */}
      <div
        className={`flex-col gap-4 absolute top-full right-6 bg-white/70 backdrop-blur-md lg:p-0 p-4 rounded-lg shadow-md shadow-pink-400/50transition-transform transform origin-top-right ${
          menuOpen ? "flex" : "hidden"
        } lg:flex lg:static lg:flex-row lg:bg-transparent lg:shadow-none`}
      >
        {user?.roles?.includes("ROLE_ADMIN") && (
          <button
            onClick={() => {
              setMenuOpen(false);
              navigate("/admin");
            }}
            className="px-4 py-2 bg-pink-400 hover:bg-pink-500 text-white font-medium rounded-lg shadow-md transition cursor-pointer lg:bg-white/40 lg:hover:bg-white/60 lg:text-black lg:backdrop-blur-md"
          >
            Back Office
          </button>
        )}  
        <button
          onClick={() => {
            setMenuOpen(false);
            navigate("/groups");
          }}
          className="px-4 py-2 bg-pink-400 hover:bg-pink-500 text-white font-medium rounded-lg shadow-md transition cursor-pointer lg:bg-white/40 lg:hover:bg-white/60 lg:text-black lg:backdrop-blur-md"
        >
          Groups
        </button>
        <button
          onClick={() => {
            setMenuOpen(false);
            navigate("/account");
          }}
          className="px-4 py-2 bg-pink-400 hover:bg-pink-500 text-white font-medium rounded-lg shadow-md transition cursor-pointer lg:bg-white/40 lg:hover:bg-white/60 lg:text-black lg:backdrop-blur-md"
        >
          My Account
        </button>
        <button
          onClick={() => {
            setMenuOpen(false);
            handleLogout();
          }}
          className="px-4 py-2 bg-pink-400 hover:bg-pink-500 text-white font-medium rounded-lg shadow-md transition cursor-pointer lg:bg-white/40 lg:hover:bg-white/60 lg:text-black lg:backdrop-blur-md"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
