import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ThemeProgressCard from "@/components/ThemeProgressCard";
import GroupMembersProgress from "@/features/groups/GroupMembersProgress";
import GroupHeader from "@/features/groups/GroupHeader";
import GroupProgressLogic from "@/features/groups/logic/GroupProgressLogic";

export default function GroupPage() {
  const { id } = useParams();

  const {
    progressData,
    loading,
    groupName,
    groupCode,
    totalProgress,
    selectedThemeId,
    membersProgressByTheme,
    handleThemeClick,
  } = GroupProgressLogic(id);

  if (loading) return;
  <>
    <div></div>
    <p className="text-center text-lg font-medium">Loading group progress...</p>
    <div />
  </>;

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <GroupHeader
          groupName={groupName}
          groupCode={groupCode}
          totalProgress={totalProgress}
          groupId={id}
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-h-[70vh] overflow-y-auto overflow-x-hidden pb-10">
          {progressData.map((item) => (
            <div key={item.theme.id}>
              <ThemeProgressCard
                labelInterface={item.theme.label_interface}
                labelTarget={item.theme.label_target}
                progress={item.averageProgress}
                progressLabel="completed"
                onClick={() => handleThemeClick(item.theme.id)}
              />
              {selectedThemeId === item.theme.id && (
                <GroupMembersProgress
                  members={membersProgressByTheme[item.theme.id]}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
