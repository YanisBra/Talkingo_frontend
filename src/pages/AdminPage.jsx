import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

import LanguagePanel from "../features/admin/LanguagePanel";
import ThemePanel from "../features/admin/ThemePanel";
import ThemeTranslationPanel from "../features/admin/ThemeTranslationPanel";
import PhrasePanel from "../features/admin/PhrasePanel";
import PhraseTranslationsPanel from "../features/admin/PhraseTranslationPanel";
import GroupPanel from "@/features/admin/GroupPanel";
import UserPanel from "@/features/admin/UserPanel";

export default function AdminPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("languages");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleGoToDashboard = () => {
    navigate("/");
  };

  const renderTab = () => {
    switch (activeTab) {
      case "languages":
        return <LanguagePanel />;
      case "themes":
        return <ThemePanel />;
      case "themeTranslations":
        return <ThemeTranslationPanel />;
      case "phrases":
        return <PhrasePanel />;
      case "phraseTranslations":
        return <PhraseTranslationsPanel />;
      case "groups":
        return <GroupPanel />;
      case "users":
        return <UserPanel />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-yellow-100 via-pink-200 to-purple-200 text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-white/40 backdrop-blur-md p-6 flex flex-col justify-between shadow-md">
        <div>
          <h1
            className="text-3xl font-black mb-8 cursor-pointer "
            onClick={handleGoToDashboard}
          >
            Talkingo
          </h1>
          <nav className="flex flex-col gap-4">
            <button
              onClick={() => setActiveTab("languages")}
              className={`text-left px-4 py-2 rounded-xl transition font-medium ${
                activeTab === "languages"
                  ? "bg-pink-400 text-white"
                  : "hover:bg-pink-400/10 cursor-pointer"
              }`}
            >
              🌍 Languages
            </button>

            <button
              onClick={() => setActiveTab("themes")}
              className={`text-left px-4 py-2 rounded-xl transition font-medium ${
                activeTab === "themes"
                  ? "bg-pink-400 text-white"
                  : "hover:bg-pink-400/10 cursor-pointer"
              }`}
            >
              🗂 Themes
            </button>

            <button
              onClick={() => setActiveTab("themeTranslations")}
              className={`text-left px-4 py-2 rounded-xl transition font-medium ${
                activeTab === "themeTranslations"
                  ? "bg-pink-400 text-white"
                  : "hover:bg-pink-400/10 cursor-pointer"
              }`}
            >
              🗂 Themes Translations
            </button>

            <button
              onClick={() => setActiveTab("phrases")}
              className={`text-left px-4 py-2 rounded-xl transition font-medium ${
                activeTab === "phrases"
                  ? "bg-pink-400 text-white"
                  : "hover:bg-pink-400/10 cursor-pointer"
              }`}
            >
              💬 Phrases
            </button>

            <button
              onClick={() => setActiveTab("phraseTranslations")}
              className={`text-left px-4 py-2 rounded-xl transition font-medium ${
                activeTab === "phraseTranslations"
                  ? "bg-pink-400 text-white"
                  : "hover:bg-pink-400/10 cursor-pointer"
              }`}
            >
              💬 Phrases Translations
            </button>

            <button
              onClick={() => setActiveTab("groups")}
              className={`text-left px-4 py-2 rounded-xl transition font-medium ${
                activeTab === "groups"
                  ? "bg-pink-400 text-white"
                  : "hover:bg-pink-400/10 cursor-pointer"
              }`}
            >
              👥 Groups
            </button>

            <button
              onClick={() => setActiveTab("users")}
              className={`text-left px-4 py-2 rounded-xl transition font-medium ${
                activeTab === "users"
                  ? "bg-pink-400 text-white"
                  : "hover:bg-pink-400/10 cursor-pointer"
              }`}
            >
              👤 Users
            </button>
          </nav>
        </div>

        <div className="flex flex-col gap-2">
         

          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gray-800 text-white rounded-xl shadow-md hover:bg-gray-900 transition cursor-pointer"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        {renderTab()}
      </main>
    </div>
  );
}
