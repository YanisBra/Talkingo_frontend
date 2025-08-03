import { useEffect, useState } from "react";
import {
  getGroupThemeProgression,
  getGroupUserThemeProgress,
  getGroup,
} from "@/services/groupsService";

export default function GroupProgressLogic(groupId) {
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [groupName, setGroupName] = useState("");
  const [totalProgress, setTotalProgress] = useState(0);
  const [selectedThemeId, setSelectedThemeId] = useState(null);
  const [membersProgressByTheme, setMembersProgressByTheme] = useState({});
  const [groupCode, setGroupCode] = useState("");
  

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const [progress, group] = await Promise.all([
          getGroupThemeProgression(groupId),
          getGroup(groupId),
        ]);

        setGroupName(group.name || "Group");
        setGroupCode(group.invitationCode || "");

        setTotalProgress(progress.totalAverageProgress || 0);
        setProgressData(progress.themes || []);
      } catch (error) {
        // console.error("Error loading group data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupData();
  }, [groupId]);

  const handleThemeClick = async (themeId) => {
    const isSame = selectedThemeId === themeId;
    setSelectedThemeId(isSame ? null : themeId);

    if (!isSame && !membersProgressByTheme[themeId]) {
      try {
        const members = await getGroupUserThemeProgress({
          groupId,
          themeId,
        });
        setMembersProgressByTheme((prev) => ({
          ...prev,
          [themeId]: members,
        }));
      } catch (error) {
        // console.error("Error loading members:", error);
      }
    }
  };

  return {
    progressData,
    loading,
    groupName,
    groupCode,
    totalProgress,
    selectedThemeId,
    membersProgressByTheme,
    handleThemeClick,
  };
}