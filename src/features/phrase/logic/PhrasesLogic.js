import { useEffect, useState } from "react";
import { getPhrasesByTheme } from "@/services/phrasesService";
import {
  markTranslationAsLearn,
  unmarkTranslationAsLearn,
} from "@/services/phraseTranslationsService";
import { useAuth } from "@/contexts/AuthContext";

export default function PhrasesLogic(themeId) {
  const [phrases, setPhrases] = useState([]);
  const [selected, setSelected] = useState(null);
  const [themeLabel, setThemeLabel] = useState("Theme");
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPhrases = async () => {
      try {
        const response = await getPhrasesByTheme(themeId);
        setPhrases(response);
        if (response.length > 0) {
          setThemeLabel(response[0].theme_label || "Theme");
          setSelected(response[0]);
        }
      } catch (err) {
        console.error("Error fetching phrases:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPhrases();
  }, [themeId]);

  const markTranslation = async () => {
    if (!selected || !user) return;
    await markTranslationAsLearn({
      user: `/api/users/${user.id}`,
      phraseTranslation: `/api/phrase_translations/${selected.phrase_translation_id}`,
    });
  };

  const unmarkTranslation = async () => {
    if (!selected) return;
    await unmarkTranslationAsLearn(selected.progress_id);
  };

  return {
    phrases,
    setPhrases,
    selected,
    setSelected,
    themeLabel,
    loading,
    markTranslation,
    unmarkTranslation,
  };
}