import api from "./api";

export const getPhrases = async () => {
  try {
    const response = await api.get("/phrases");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch phrases:", error);
    throw error;
  }
};

export const getPhrasesByTheme = async (id) => {
  try {
    const response = await api.get(`/themes/${id}/phrases/translated`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch phrases by theme:", error);
    throw error;
  }
};

export const createPhrase = async (code, theme) => {
  try {
    const response = await api.post(
      "/phrases",
      { code, theme },
      {
        headers: {
          "Content-Type": "application/ld+json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to create phrase:", error);
    throw error;
  }
};

export const deletePhrase = async (id) => {
  try {
    await api.delete(`/phrases/${id}`);
  } catch (error) {
    console.error(`Failed to delete phrase with ID ${id}:`, error);
    throw error;
  }
};

export const updatePhrase = async (id, data) => {
  try {
    const response = await api.patch(`/phrases/${id}`, data, {
      headers: {
        "Content-Type": "application/merge-patch+json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to update phrase with ID ${id}:`, error);
    throw error;
  }
};
