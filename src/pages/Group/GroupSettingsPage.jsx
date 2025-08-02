import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import GroupSettingsLogic from "@/features/groups/logic/GroupSettingsLogic";
import GroupMembersTable from "@/features/groups/GroupMembersTable";
import GroupCodeDisplay from "@/components/GroupCodeDisplay";
import WhiteButton from "@/components/WhiteButton";
import BlackButton from "@/components/BlackButton";
import PinkButton from "@/components/PinkButton";

export default function GroupSettingsPage() {
  const { id: groupId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    memberships,
    groupName,
    setGroupName,
    isAdmin,
    groupCode,
    setGroupCode,
    showEditModal,
    setShowEditModal,
    handleLeaveGroup,
    handleRemoveMember,
    handleUpdateGroup,
    handleRegenerateCode,
  } = GroupSettingsLogic(groupId, user.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-200 to-purple-200">
      <Navbar />
      <div className="max-w-4xl mx-auto py-10 px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2 text-gray-800">{groupName}</h2>
          <GroupCodeDisplay groupCode={groupCode} />
        </div>
        <div className="flex justify-end items-center gap-4 mb-6">
          {isAdmin && (
            <WhiteButton
              onClick={() => setShowEditModal(true)}
              label="Edit Group"
              paddingX={4}
              paddingY={2}
            />
          )}
          <BlackButton
            onClick={() => handleLeaveGroup(navigate)}
            label="Leave Group"
            paddingX={4}
            paddingY={2}
          />
        </div>

        <GroupMembersTable
          memberships={memberships}
          user={user}
          isAdmin={isAdmin}
          handleRemoveMember={handleRemoveMember}
        />
      </div>

      {/* Modal for editing settings */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const success = await handleUpdateGroup();
              if (success) setShowEditModal(false);
            }}
            className="bg-white backdrop-blur-md p-8 rounded-3xl w-full max-w-md shadow-xl"
          >
            <h4 className="text-2xl font-black text-center mb-6 text-gray-800">
              Edit Group Settings
            </h4>

            <label className="block mb-2 font-medium text-gray-700">
              Group Name
            </label>
            <input
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full mb-4 p-3 border border-pink-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400"
              required
            />

            <label className="block mb-2 font-medium text-gray-700">
              Invitation Code
            </label>
            <div className="flex items-center justify-between mb-4">
              <input
                value={groupCode}
                onChange={(e) => setGroupCode(e.target.value)}
                minLength={8}
                className="w-full mr-2 p-3 border border-pink-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400"
                require
              />
              <button
                type="button"
                onClick={handleRegenerateCode}
                className="px-1 py-3 bg-pink-400 hover:bg-pink-500 text-white rounded-lg text-sm cursor-pointer"
              >
                Regenerate
              </button>
            </div>

            <div className="flex justify-end gap-2">
              <BlackButton
                paddingX={4}
                paddingY={2}
                onClick={() => setShowEditModal(false)}
                label={"Cancel"}
                type="submit"
              />
              <PinkButton
                paddingX={4}
                paddingY={2}
                label={"Save"}
                type="submit"
              />
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
