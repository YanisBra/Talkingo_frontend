import { useEffect, useState } from "react";
import { getUserThemesProgress } from "@/services/themesService";

export default function UserThemesProgressLogic() {
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const data = await getUserThemesProgress();
        setProgressData(data);
      } catch (error) {
        // console.error("Error loading theme progress:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  return { progressData, loading };
}