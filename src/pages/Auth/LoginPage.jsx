import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login(email, password); 
      navigate("/"); 
    } catch (error) {
      const message = error?.response?.data?.message || "Login failed";
      if (message.includes("Too many failed login attempts")) {
        toast.error("Too many login attempts. Please try again later.");
      } else if (message.includes("Invalid credentials")) {
        toast.error("Incorrect email or password.");
      } else {
        toast.error("Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 flex items-center justify-center bg-gradient-to-br from-yellow-100 via-pink-200 to-purple-200">
      <div className="bg-white/40 backdrop-blur-md p-8 rounded-3xl shadow-xl max-w-md w-full">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Welcome back 👋
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-pink-300 focus:ring-pink-400 focus:outline-none focus:ring-2 "
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <button
            type="submit"
            className="w-full py-3 bg-pink-400  hover:bg-pink-500 text-white font-semibold rounded-xl shadow-md shadow-pink-400/50 transition flex items-center justify-center cursor-pointer"
            disabled={loading}
          >
            {loading && (
              <svg
                className="mr-3 h-5 w-5 animate-spin text-white"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3.536-3.536A9.953 9.953 0 0122 12h-4a8 8 0 01-8 8v-4l-3.536 3.536A9.953 9.953 0 012 12h4z"
                />
              </svg>
            )}
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="text-center mt-6 text-sm text-gray-600 cusor-pointer">
          No account?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-pink-600 hover:underline font-medium cursor-pointer"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
