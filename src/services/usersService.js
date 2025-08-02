import api from "./api";

export const getUsers = async () => {
  try {
    const response = await api.get("/users");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    await api.delete(`/users/${id}`);
  } catch (error) {
    console.error(`Failed to delete user with ID ${id}:`, error);
    throw error;
  }
};

export const updateUser = async ({
  id,
  name,
  email,
  plainPassword,
  interfaceLanguage,
  targetLanguage,
  roles,
}) => {
  try {
    const response = await api.patch(
      `/users/${id}`,
      {
        id,
        name,
        email,
        plainPassword,
        interfaceLanguage,
        targetLanguage,
        roles,
      },
      {
        headers: {
          "Content-Type": "application/merge-patch+json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to update user with ID ${id}:`, error);
    throw error;
  }
};
