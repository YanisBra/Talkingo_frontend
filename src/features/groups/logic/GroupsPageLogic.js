import { useEffect, useState } from "react";
import { joinGroup, createGroup } from "@/services/groupsService";
import {
  getGroupMemberships,
  getMembershipsByGroup,
} from "@/services/groupMembershipsService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function GroupsPageLogic() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  const [invitationCode, setInvitationCode] = useState("");
  const [groupName, setGroupName] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  const handleJoinGroup = async () => {
    try {
      await joinGroup(invitationCode);
      window.location.reload();
    } catch (error) {
      if (error?.response?.status === 404) {
        toast.error("Invalid invitation code. Group not found.");
      } else if (error?.response?.status === 429) {
        toast.error("Too many attempts. Please wait before trying again.");
      } else {
        // console.error("❌ Failed to join group:", error);
      }
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) return;
    try {
      await createGroup({ name: groupName });
      window.location.reload();
    } catch (error) {
      toast.error("Failed to create group");
      // console.error("❌ Failed to create group:", error);
    }
  };

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const allMemberships = await getGroupMemberships();
        if (allMemberships.member.length > 0) {
          const firstGroupId = allMemberships.member[0].targetGroup.id;
          const detailedMemberships = await getMembershipsByGroup(firstGroupId);
          setGroups(detailedMemberships.member);
          navigate(`/group/${firstGroupId}`);
        } else {
          setGroups([]);
        }
      } catch (error) {
        console.error("Error loading groups:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, [navigate]);

  return {
    groupName,
    setGroupName,
    handleCreateGroup,
    invitationCode,
    setInvitationCode,
    handleJoinGroup,
    showCreate,
    setShowCreate,
    loading,
  };
}
