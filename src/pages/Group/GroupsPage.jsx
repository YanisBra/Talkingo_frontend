import Navbar from "@/components/Navbar";
import GroupsPageLogic from "@/features/groups/logic/GroupsPageLogic";
import JoinGroupForm from "@/features/groups/JoinGroupForm";
import CreateGroupForm from "@/features/groups/CreateGroupForm";

export default function GroupsPage() {
  const {
    handleCreateGroup,
    invitationCode,
    setInvitationCode,
    handleJoinGroup,
    showCreate,
    groupName,
    setGroupName,
    setShowCreate,
    loading,
  } = GroupsPageLogic();

  if (loading)
    return (
      <>
        <div></div>
        <p className="text-center text-lg font-medium">
          Loading group progress...
        </p>
        <div />
      </>
    );

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center min-h-[80vh] px-6">
        <div className="bg-white/40 backdrop-blur-md p-8 rounded-3xl shadow-xl max-w-md w-full mt-12">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
            {showCreate ? "Create your group" : "Join a Group"}
          </h2>
          <div className="space-y-4">
            {!showCreate ? (
              <JoinGroupForm
                invitationCode={invitationCode}
                setInvitationCode={setInvitationCode}
                handleJoinGroup={handleJoinGroup}
              />
            ) : (
              <CreateGroupForm
                groupName={groupName}
                setGroupName={setGroupName}
                handleCreateGroup={handleCreateGroup}
              />
            )}
            <div className="text-center mt-4 text-sm text-gray-600">
              {showCreate ? (
                <>
                  Already have a code?{" "}
                  <span
                    onClick={() => setShowCreate(false)}
                    className="text-pink-600 hover:underline font-medium cursor-pointer"
                  >
                    Join a group
                  </span>
                </>
              ) : (
                <>
                  Don’t have a group?{" "}
                  <span
                    onClick={() => setShowCreate(true)}
                    className="text-pink-600 hover:underline font-medium cursor-pointer"
                  >
                    Create your own
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
