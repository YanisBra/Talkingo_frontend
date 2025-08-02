import api from "./api";

export async function getLanguages() {
  const response = await api.get("/languages");
  return response.data;
}

export const createLanguage = async ({ code, label, iconUrl, isActive }) => {
  try {
    const response = await api.post(
      "/languages",
      {
        code,
        label,
        iconUrl,
        isActive,
      },
      {
        headers: {
          "Content-Type": "application/ld+json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to create language:", error);
    throw error;
  }
};

export const deleteLanguage = async (id) => {
  try {
    await api.delete(`/languages/${id}`);
  } catch (error) {
    console.error(`Failed to delete language with ID ${id}:`, error);
    throw error;
  }
};

export const updateLanguage = async (id, data) => {
  try {
    const response = await api.patch(`/languages/${id}`, data, {
      headers: {
        "Content-Type": "application/merge-patch+json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to update language with ID ${id}:`, error);
    throw error;
  }
};
