import api from "./api";

export const getGroupMemberships = async () => {
  try {
    const response = await api.get("/group_memberships");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch group_memberships:", error);
    throw error;
  }
};

export const getMembershipsByGroup = async (groupId) => {
  try {
    const response = await api.get(
      `/group_memberships?targetGroup=/api/groups/${groupId}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch group_memberships:", error);
    throw error;
  }
};

export const deleteGroupMembership = async (id) => {
  try {
    await api.delete(`/group_memberships/${id}`);
  } catch (error) {
    console.error(`Failed to delete groupMembership with ID ${id}:`, error);
    throw error;
  }
};
