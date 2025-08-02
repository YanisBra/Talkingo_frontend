import api from "./api";

export const getThemes = async () => {
  try {
    const response = await api.get("/themes");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch themes:", error);
    throw error;
  }
};

export const getUserThemesProgress = async () => {
  try {
    const response = await api.get(`/users/me/themes/progress`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch themes progress:", error);
    throw error;
  }
};

export const createTheme = async (code) => {
  try {
    const response = await api.post(
      "/themes",
      { code },
      {
        headers: {
          "Content-Type": "application/ld+json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to create theme:", error);
    throw error;
  }
};

export const deleteTheme = async (id) => {
  try {
    await api.delete(`/themes/${id}`);
  } catch (error) {
    console.error(`Failed to delete theme with ID ${id}:`, error);
    throw error;
  }
};

export const updateTheme = async (id, code) => {
  try {
    const response = await api.patch(
      `/themes/${id}`,
      { code },
      {
        headers: {
          "Content-Type": "application/merge-patch+json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to update theme with ID ${id}:`, error);
    throw error;
  }
};
