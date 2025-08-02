import api from "./api";

export const getThemeTranslations = async () => {
  try {
    const response = await api.get("/theme_translations");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch theme translations:", error);
    throw error;
  }
};

export const getThemeTranslationsByTheme = async (id) => {
  try {
    const response = await api.get(`/theme_translations?theme=${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch theme translations by theme:", error);
    throw error;
  }
};

export const createThemeTranslation = async ({ label, theme, language }) => {
  try {
    const response = await api.post(
      "/theme_translations",
      { label, theme, language },
      {
        headers: {
          "Content-Type": "application/ld+json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to create theme translation:", error);
    throw error;
  }
};

export const deleteThemeTranslation = async (id) => {
  try {
    await api.delete(`/theme_translations/${id}`);
  } catch (error) {
    console.error(`Failed to delete theme translation with ID ${id}:`, error);
    throw error;
  }
};

export const updateThemeTranslation = async (id, data) => {
  try {
    const response = await api.patch(`/theme_translations/${id}`, data, {
      headers: {
        "Content-Type": "application/merge-patch+json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to update theme translation with ID ${id}:`, error);
    throw error;
  }
};
