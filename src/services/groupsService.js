import api from "./api";

export const getGroups = async () => {
  try {
    const response = await api.get("/groups");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch groups:", error);
    throw error;
  }
};

export const getGroup = async (id) => {
  try {
    const response = await api.get(`/groups/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch groups:", error);
    throw error;
  }
};

export const getGroupMembers = async (id) => {
  try {
    const response = await api.get(
      `/group_memberships?targetGroup=/api/groups/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to get group members:", error);
    throw error;
  }
};

export const getGroupThemeProgression = async (id) => {
  try {
    const response = await api.get(`/groups/${id}/themes/progress`);
    return response.data;
  } catch (error) {
    console.error("Failed to get group theme progression :", error);
    throw error;
  }
};

export const getGroupThemesProgress = async (id) => {
  try {
    const response = await api.get(`/groups/${id}/themes/progress`);
    return response.data;
  } catch (error) {
    console.error(
      `Failed to fetch themes progress for group with ID ${id}:`,
      error
    );
    throw error;
  }
};

export const getGroupUserThemeProgress = async ({ groupId, themeId }) => {
  try {
    const response = await api.get(
      `/groups/${groupId}/themes/${themeId}/members/progress`
    );
    return response.data;
  } catch (error) {
    // console.error("Failed to get group user theme progress:", error);
    throw error;
  }
};

export const createGroup = async (name) => {
  try {
    const response = await api.post("/groups", name, {
      headers: {
        "Content-Type": "application/ld+json",
      },
    });
    return response.data;
  } catch (error) {
    // console.error("Failed to create group:", error);
    throw error;
  }
};

export const deleteGroup = async (id) => {
  try {
    await api.delete(`/groups/${id}`);
  } catch (error) {
    // console.error(`Failed to delete group with ID ${id}:`, error);
    throw error;
  }
};

export const updateGroup = async (id, data) => {
  try {
    const response = await api.patch(`/groups/${id}`, data, {
      headers: {
        "Content-Type": "application/merge-patch+json",
      },
    });
    return response.data;
  } catch (error) {
    // console.error(`Failed to update group with ID ${id}:`, error);
    throw error;
  }
};

export const joinGroup = async (invitationCode) => {
  try {
    const response = await api.post(
      `/groups/join`,
      { invitationCode },
      {
        headers: {
          "Content-Type": "application/ld+json",
        },
      }
    );
    return response.data;
  } catch (error) {
    // console.error("Failed to join group", error);
    throw error;
  }
};

export const leaveGroup = async (id) => {
  try {
    const response = await api.post(`/groups/${id}/leave`, null, {
      headers: {
        "Content-Type": "application/ld+json",
      },
    });
    return response.data;
  } catch (error) {
    // console.error("Failed to leave group", error);
    throw error;
  }
};
