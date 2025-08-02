import { Link } from "react-router-dom";
import RegisterFormLogic from "@/features/auth/logic/RegisterFormLogic";

export default function RegisterPage() {
  const {
    form,
    languages,
    handleChange,
    handleSubmit,
    loading,
    passwordError,
  } = RegisterFormLogic();

  return (
    <div className="min-h-screen py-12 px-4 flex items-center justify-center bg-gradient-to-br from-yellow-100 via-pink-200 to-purple-200">
      <div className="bg-white/40 backdrop-blur-md p-10 rounded-3xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Create your account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block mb-1 font-medium text-gray-700">Name</label>
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <label className="block mb-1 font-medium text-gray-700">Email</label>
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <label className=" block mb-1 font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            name="plainPassword"
            placeholder="Password"
            value={form.plainPassword}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          {passwordError && (
            <p className="text-sm text-red-600 -mt-2">{passwordError}</p>
          )}

          <label className="block mb-1 font-medium text-gray-700">
            Language used in the app interface
          </label>
          <select
            id="interfaceLanguage"
            name="interfaceLanguage"
            value={form.interfaceLanguage}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl border border-pink-300 focus:outline-none outline-0 focus:ring-2 focus:ring-pink-400"
          >
            <option value="">Interface language</option>
            {languages.map((lang) => (
              <option key={lang.id} value={lang["@id"]}>
                {lang.label}
              </option>
            ))}
          </select>

          <label className="block mb-1 font-medium text-gray-700">
            Language you want to learn
          </label>
          <select
            id="targetLanguage"
            name="targetLanguage"
            value={form.targetLanguage}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl border border-pink-300 focus:outline-none outline-0 focus:ring-2 focus:ring-pink-400"
          >
            <option value="">Target language</option>
            {languages.map((lang) => (
              <option key={lang.id} value={lang["@id"]}>
                {lang.label}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="w-full py-3 bg-pink-400 hover:bg-pink-500 text-white font-semibold rounded-xl shadow-md flex items-center justify-center cursor-pointer"
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
            {loading ? "Creating..." : "Sign up"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-700">
          Already have an account?{" "}
          <Link to="/login" className="text-pink-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
