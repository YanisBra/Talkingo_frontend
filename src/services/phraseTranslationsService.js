import api from "./api";

export const getPhraseTranslations = async () => {
  try {
    const response = await api.get("/phrase_translations");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch phrase translations:", error);
    throw error;
  }
};

export const getPhraseTranslationsByPhrase = async (id) => {
  try {
    const response = await api.get(`/phrase_translations?phrase=${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch phrases translations by phrase:", error);
    throw error;
  }
};

export const createPhraseTranslation = async ({ text, phrase, language }) => {
  try {
    const response = await api.post(
      "/phrase_translations",
      { text, phrase, language },
      {
        headers: {
          "Content-Type": "application/ld+json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to create phrase translation:", error);
    throw error;
  }
};

export const deletePhraseTranslation = async (id) => {
  try {
    await api.delete(`/phrase_translations/${id}`);
  } catch (error) {
    console.error(`Failed to delete phrase translation with ID ${id}:`, error);
    throw error;
  }
};

export const updatePhraseTranslation = async (id, data) => {
  try {
    const response = await api.patch(`/phrase_translations/${id}`, data, {
      headers: {
        "Content-Type": "application/merge-patch+json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to update phrase translation with ID ${id}:`, error);
    throw error;
  }
};

export const markTranslationAsLearn = async ({ user, phraseTranslation }) => {
  try {
    const response = await api.post(
      "/user_phrase_progresses",
      { user, phraseTranslation },
      {
        headers: {
          "Content-Type": "application/ld+json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to mark phrase as learn", error);
    throw error;
  }
};

export const unmarkTranslationAsLearn = async (id) => {
  try {
    await api.delete(`/user_phrase_progresses/${id}`);
  } catch (error) {
    console.error(`Failed to unmark phrase ID ${id}: as learn`, error);
    throw error;
  }
};
