export default function JoinGroupForm({ invitationCode, setInvitationCode, handleJoinGroup }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleJoinGroup();
      }}
    >
      <input
        type="text"
        placeholder="Invitation code"
        value={invitationCode}
        onChange={(e) => setInvitationCode(e.target.value)}
        required
        minLength={8}
        className="w-full px-4 py-3 mb-4 rounded-xl border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
      />
      <button
        type="submit"
        className="w-full py-3 bg-pink-400 mb-4 hover:bg-pink-500 text-white font-semibold rounded-xl shadow-md shadow-pink-400/50 transition cursor-pointer"
      >
        Join Group
      </button>
    </form>
  );
}