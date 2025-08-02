import { useState, useEffect } from "react";
import { getLanguages } from "@/services/languagesService";

export default function useLanguage() {
  const [languages, setLanguages] = useState([]);
  const [loadingLanguages, setLoadingLanguages] = useState(true);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const result = await getLanguages();
        setLanguages(result.member || []);
      } catch (err) {
        console.error("Failed to fetch languages", err);
      } finally {
        setLoadingLanguages(false);
      }
    };

    fetchLanguages();
  }, []);

  return { languages, loadingLanguages };
}