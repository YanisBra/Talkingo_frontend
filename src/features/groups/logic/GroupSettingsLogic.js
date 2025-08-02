import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from 'react-toastify';
import { useAuth } from "@/contexts/AuthContext";
import { getGroup, updateGroup, leaveGroup } from "@/services/groupsService";
import {
  getMembershipsByGroup,
  deleteGroupMembership,
} from "@/services/groupMembershipsService";

export default function GroupSettingsLogic() {
  const { id: groupId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [memberships, setMemberships] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [groupCode, setGroupCode] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const r = await getMembershipsByGroup(groupId);
        setMemberships(r.member);
        const current = r.member.find((m) => {
          const memberUserId = m.user?.["@id"]?.split("/").pop();
          return parseInt(memberUserId) === user.id;
        });
        setIsAdmin(current?.isAdmin ?? false);
        const groupInfo = await getGroup(groupId);
        setGroupName(groupInfo.name || "");
        setGroupCode(groupInfo.invitationCode || "");
      } catch (error) {
        // console.error("Error loading group settings:", error);
      }
    };
    fetchData();
  }, [groupId, user.id]);

  const handleLeaveGroup = async () => {
    try {
      if (isAdmin && memberships.length > 1) {
        toast.error("As the admin, you must remove all members before leaving the group.");
        return;
      }

      await leaveGroup(groupId);
      toast.success("You have left the group.");
      navigate("/groups");
    } catch (error) {
      // console.error("Failed to leave group:", error);
      toast.error("Failed to leave the group.");
    }
  };

  const handleRemoveMember = async (membershipId) => {
    try {
      await deleteGroupMembership(membershipId);
      setMemberships((prev) => prev.filter((m) => m.id !== membershipId));
      toast.success("Member removed successfully.");
    } catch (error) {
      // console.error("Failed to remove member:", error);
      toast.error("Failed to remove member.");
    }
  };

  const handleUpdateGroup = async () => {
    if (groupCode.length < 8) {
      toast.error("Invitation code must be at least 8 characters.");
      return false;
    }
    try {
      await updateGroup(groupId, {
        name: groupName,
        invitationCode: groupCode,
      });
      toast.success("Group updated successfully.");
      return true;
    } catch (error) {
      // console.error("Failed to update group settings:", error);
      toast.error("Failed to update group settings.");
      return false;
    }
  };

  const handleRegenerateCode = () => {
    const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let newCode = "";
    for (let i = 0; i < 8; i++) {
      newCode += characters[Math.floor(Math.random() * characters.length)];
    }
    setGroupCode(newCode);
  };

  return {
    memberships,
    groupName,
    setGroupName,
    isAdmin,
    groupCode,
    setGroupCode,
    showEditModal,
    setShowEditModal,
    copied,
    setCopied,
    handleLeaveGroup,
    handleRemoveMember,
    handleUpdateGroup,
    handleRegenerateCode,
  };
}