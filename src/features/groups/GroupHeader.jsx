import { useNavigate } from "react-router-dom";
import GroupCodeDisplay from "@/features/groups/GroupCodeDisplay";
import WhiteButton from "@/components/WhiteButton";

export default function GroupHeader({ groupName, groupCode, totalProgress, groupId }) {
  const navigate = useNavigate();

  return (
    <div className="mb-8 text-center relative">
      <h2 className="text-4xl font-extrabold text-gray-800 mb-2">
        {groupName}
      </h2>

      <GroupCodeDisplay groupCode={groupCode} />

      <p className="text-gray-600 mb-4">
        Overall Progress: {totalProgress}%
      </p>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden mb-4">
        <div
          className="bg-pink-500 h-full transition-all duration-500 ease-in-out"
          style={{ width: `${totalProgress}%` }}
        ></div>
      </div>

      {/* Desktop button */}
      <div className="hidden md:block absolute top-0 right-0">
        <WhiteButton
          onClick={() => navigate(`/groups/${groupId}/settings`)}
          label="Group Settings"
          paddingX={4}
          paddingY={2}
        />
      </div>

      {/* Mobile button */}
      <div className="md:hidden mt-4">
        <button
          onClick={() => navigate(`/groups/${groupId}/settings`)}
          className="bg-white/70 hover:bg-white text-gray-800 font-medium px-4 py-2 rounded-xl shadow transition"
        >
          Group settings
        </button>
      </div>
    </div>
  );
}