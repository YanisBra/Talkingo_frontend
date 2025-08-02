import Navbar from "@/components/Navbar";
import useAccountPage from "@/features/auth/logic/AccountPageLogic";

export default function AccountPage() {
  const {
    form,
    handleFormChange,
    handleSave,
    handleDeleteAccount,
    languages,
    loading,
    saving,
    passwordError,
  } = useAccountPage();

  return (
    <div>
      <Navbar />
      <div className="flex justify-end max-w-4xl mx-auto mt-6 px-4"></div>
      <div className="flex items-center justify-center pt-10 px-4">
        <div className="bg-white/40 backdrop-blur-md p-8 rounded-3xl shadow-xl w-full max-w-md">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
            My Account
          </h2>
          {loading ? (
            <p className="text-center text-sm text-gray-500">Loading...</p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
            >
              <input
                name="name"
                value={form.name}
                onChange={handleFormChange}
                placeholder="Name"
                className="w-full mb-4 p-3 border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400 rounded-xl"
              />
              <input
                name="email"
                value={form.email}
                onChange={handleFormChange}
                placeholder="Email"
                className="w-full mb-4 p-3 border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400 rounded-xl"
              />
              <input
                name="plainPassword"
                value={form.plainPassword}
                onChange={handleFormChange}
                type="password"
                placeholder="New password (optional)"
                className="w-full mb-4 p-3 border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400 rounded-xl"
              />
              {passwordError && (
                <p className="text-sm text-red-600 -mt-2">{passwordError}</p>
              )}
              <select
                name="interfaceLanguage"
                value={form.interfaceLanguage}
                onChange={handleFormChange}
                className="w-full mb-4 p-3 border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400 rounded-xl"
              >
                <option value="">Select interface language</option>
                {languages.map((l) => (
                  <option key={l.id} value={"/api/languages/" + l.id}>
                    {l.label}
                  </option>
                ))}
              </select>
              <select
                name="targetLanguage"
                value={form.targetLanguage}
                onChange={handleFormChange}
                className="w-full mb-4 p-3 border border-pink-300 focus:ring-pink-400  rounded-xl"
              >
                <option value="">Select target language</option>
                {languages.map((l) => (
                  <option key={l.id} value={"/api/languages/" + l.id}>
                    {l.label}
                  </option>
                ))}
              </select>
              <button
                disabled={saving}
                className="w-full py-3 bg-pink-400 hover:bg-pink-500 text-white font-semibold rounded-xl shadow-md shadow-pink-400/50 transition cursor-pointer"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="mt-4 text-sm text-red-500 hover:underline font-medium cursor-pointer text-center w-full"
              >
                Delete my account
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
