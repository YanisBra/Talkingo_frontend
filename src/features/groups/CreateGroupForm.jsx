export default function CreateGroupForm({ groupName, setGroupName, handleCreateGroup }) {
  const handleSubmit = (e) => {
    e.preventDefault();
      handleCreateGroup();

  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Enter group name"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        required
        className="w-full px-4 py-3 rounded-xl border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
      />
      <button
        type="submit"
        className="w-full py-3 bg-pink-400 mb-4 hover:bg-pink-500 text-white font-semibold rounded-xl shadow-md shadow-pink-400/50 transition cursor-pointer"
      >
        Create Group
      </button>
    </form>
  );
}