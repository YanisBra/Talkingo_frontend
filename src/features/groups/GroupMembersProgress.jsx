export default function GroupMembersProgress({ members }) {
  return (
    <div className="mt-4 p-4 bg-white/50 rounded-xl">
      <h4 className="text-lg font-bold mb-2">Members’ Progress</h4>
      <div className="max-h-40 overflow-y-auto pr-2">
        <ul>
          {members?.length > 0 ? (
            members.map((member) => (
              <li
                key={member.user.id}
                className="flex justify-between py-1 border-b border-gray-300"
              >
                <span>{member.user.name}</span>
                <span className="font-semibold">{member.progress}%</span>
              </li>
            ))
          ) : (
            <li className="text-sm italic text-gray-500">
              No progress data available
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}