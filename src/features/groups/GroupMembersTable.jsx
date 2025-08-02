export default function GroupMembersTable({
  memberships,
  user,
  isAdmin,
  handleRemoveMember,
}) {
  return (
    <table className="w-full text-left bg-white/30 rounded-xl overflow-hidden shadow-md mb-6">
      <thead>
        <tr className="bg-white/50">
          <th className="p-3">User</th>
          <th className="p-3">Joined The</th>
          {isAdmin && <th className="p-3">Actions</th>}
        </tr>
      </thead>
      <tbody>
      
        {memberships.map((m) => (
          <tr key={m.id} className="border-t border-gray-300">
            <td className="p-3">{m.user?.name || "Unknown"}</td>
            <td className="p-3">{new Date(m.joinedAt).toLocaleDateString()}</td>
            {isAdmin && (
              <td className="p-3">
                {m.user?.["@id"] === `/api/users/${user.id}` && m.isAdmin ? (
                  <span className="text-gray-500 italic">You (admin)</span>
                ) : !m.isAdmin ? (
                  <span
                    className="ml-4 text-red-600 hover:underline cursor-pointer"
                    onClick={() => handleRemoveMember(m.id)}
                  >
                    Remove
                  </span>
                ) : null}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
