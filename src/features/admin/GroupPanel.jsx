import { useEffect, useState } from "react";
import { getGroups, updateGroup, deleteGroup } from "@/services/groupsService";
import { getLanguages } from "@/services/languagesService";
import GroupMembersPanel from "./GroupMembersPanel";
import AdminTable from "@/components/AdminTable";
import AdminModal from "@/components/AdminModal";

export default function GroupPanel() {
  const [groups, setGroups] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", targetLanguage: "" });
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [groupsData, langs] = await Promise.all([
          getGroups(),
          getLanguages(),
        ]);
        setGroups(groupsData.member || []);
        setLanguages(langs.member || []);
      } catch (err) {
        // console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (group) => {
    setEditing(group);
    setForm({
      name: group.name,
      targetLanguage: group.targetLanguage?.["@id"] || "",
    });
  };

  const handleSave = async () => {
    try {
      const updated = await updateGroup(editing.id, form);
      setGroups(groups.map((g) => (g.id === editing.id ? updated : g)));
      setEditing(null);
    } catch (err) {
      // console.error("Update failed", err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteGroup(toDelete.id);
      setGroups(groups.filter((g) => g.id !== toDelete.id));
      setToDelete(null);
    } catch (err) {
      // console.error("Delete failed", err);
    }
  };

  if (loading) return <p>Loading groups...</p>;

  if (selectedGroup) {
    return (
      <GroupMembersPanel
        group={selectedGroup}
        onBack={() => setSelectedGroup(null)}
      />
    );
  }

  return (
    <>
      <AdminTable
        title="Groups"
        headers={["ID", "Name", "Inviation Code", "Language", "Created at"]}
        rows={groups.map((g) => ({
          id: g.id,
          name: g.name,
          invitationCode: g.invitationCode,
          language: g.targetLanguage?.label || "—",
          createdAt: new Date(g.createdAt).toLocaleDateString(),
        }))}
        onRowClick={(row) => {
          const group = groups.find((g) => g.id === row.id);
          if (group) setSelectedGroup(group);
        }}
        renderActions={(row) => {
          const group = groups.find((g) => g.id === row.id);
          return (
            <>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(group);
                }}
                className="text-blue-600 cursor-pointer mr-4 hover:underline"
              >
                Edit
              </span>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  setToDelete(group);
                }}
                className="text-red-600 cursor-pointer hover:underline"
              >
                Delete
              </span>
            </>
          );
        }}
      />

      {editing && (
        <AdminModal
          title={"Edit Group"}
          form={form}
          onChange={handleFormChange}
          onClose={() => {
            setEditing(null);
            setForm({ name: "", targetLanguage: "" });
          }}
          onSubmit={editing ? handleSave : handleCreate}
          fields={[
            {
              name: "name",
              label: "Name",
              type: "text",
              placeholder: "Enter group name",
            },
            {
              name: "targetLanguage",
              label: "Target Language",
              type: "select",
              options: languages.map((l) => ({
                label: l.label,
                value: `/api/languages/${l.id}`,
              })),
              placeholder: "Select a language",
            },
          ]}
        />
      )}

      {toDelete && (
        <AdminModal
          title="Confirm Deletion"
          onClose={() => setToDelete(null)}
          onSubmit={handleDelete}
          submitLabel="Delete"
          form={{}}
          fields={[
            {
              name: "confirm",
              type: "custom",
              render: () => (
                <p className="text-center text-gray-700">
                  Are you sure you want to delete{" "}
                  <strong>{toDelete.name}</strong>?
                </p>
              ),
            },
          ]}
        />
      )}
    </>
  );
}
