import { useState } from "react";
import UserThemesProgressLogic from "@/features/theme/logic/UserThemesProgressLogic";
import { useNavigate } from "react-router-dom";
import Navbar from "@/layouts/Navbar";
import SearchBar from "@/components/SearchBar";
import { useAuth } from "@/contexts/AuthContext";
import ThemeProgressCard from "@/components/ThemeProgressCard";

export default function ThemesPage() {
  const { progressData, loading } = UserThemesProgressLogic();
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  if (loading)
    return (
      <p className="text-center text-lg font-medium">
        Loading your progress...
      </p>
    );

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 pt-8">
        <h2 className="text-5xl font-bold tracking-tight mb-4 text-center">
          Welcome back {user?.name}!
        </h2>
        <p className="text-lg text-gray-700 mb-6 text-center">
          Continue learning, practicing, and progressing your survival language
          skills.
        </p>
        <div className="mb-8 max-w-md mx-auto">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search themes..."
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {progressData
            .filter((item) =>
              item.theme.label_interface
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
            )
            .map((item) => (
              <ThemeProgressCard
                key={item.theme.id}
                labelInterface={item.theme.label_interface}
                labelTarget={item.theme.label_target}
                progress={item.progress}
                onClick={() => navigate(`/theme/${item.theme.id}`)}
                progressLabel="completed"
              />
            ))}
        </div>
      </div>
    </div>
  );
}
