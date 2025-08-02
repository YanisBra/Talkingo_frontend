import WhiteButton from "@/components/WhiteButton";
import AdminTable from "@/components/AdminTable";
import { useEffect, useState } from "react";
import { getGroupMembers } from "@/services/groupsService";

export default function GroupMembersPanel({ group, onBack }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data = await getGroupMembers(group.id);
        setMembers(data.member || []);
      } catch (err) {
        // console.error("Failed to load group members", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [group.id]);

  if (loading) return <p>Loading group members...</p>;

  return (
    <>
      <div className="mb-4">
        <WhiteButton
          paddingX={4}
          paddingY={2}
          marginBottom={4}
          onClick={onBack}
          label={"← Back to Groups"}
        />
      </div>
      <AdminTable
        title={`Members of "${group.name}"`}
        headers={["Membership ID", "User ID", "Joined The"]}
        rows={members.map((m) => ({
          id: m.id,
          userId: m.user?.id || "N/A",
          joinedAt: new Date(m.joinedAt).toLocaleString(),
        }))}
      />
    </>
  );
}
