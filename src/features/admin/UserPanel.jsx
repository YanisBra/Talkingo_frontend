import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getUsers, deleteUser, updateUser } from "@/services/usersService";
import { getLanguages } from "@/services/languagesService";
import AdminTable from "@/components/AdminTable";
import AdminModal from "@/components/AdminModal";

export default function UserPanel() {
  const [users, setUsers] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", plainPassword: "", interfaceLanguage: "", targetLanguage: "", roles: [], isAdmin: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const data = await getUsers();
        const langs = await getLanguages();
        setUsers(data.member || []);
        setLanguages(langs.member || []);
      } catch (err) {
        toast.error("Failed to fetch users or languages")
        // console.error("Failed to fetch users or languages", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleEdit = (user) => {
    setEditingUser(user);
    // console.log("User selected for edit:", user);
    setForm({
      id: user.id,
      name: user.name,
      email: user.email,
      plainPassword: "",
      interfaceLanguage: user.interfaceLanguage?.["@id"] || "",
      targetLanguage: user.targetLanguage?.["@id"] || "",
      roles: user.roles || [],
      isAdmin: user.roles?.includes("ROLE_ADMIN") || false,
    });
  };

const handleFormChange = (e) => {
  const { name, value, checked } = e.target;

  setForm((prev) => {
    if (name === "isAdmin") {
      return {
        ...prev,
        isAdmin: checked,
        roles: checked
          ? [...new Set([...prev.roles, "ROLE_ADMIN"])]
          : prev.roles.filter((r) => r !== "ROLE_ADMIN"),
      };
    }

    return {
      ...prev,
      [name]: value,
    };
  });
};

  const handleSave = async () => {
    try {
      const payload = {
        ...form,
        roles: form.isAdmin ? ["ROLE_ADMIN"] : [],
      };
      if (!payload.plainPassword) {
        delete payload.plainPassword;
      }
      const updated = await updateUser(payload);
      setUsers(users.map((u) => (u.id === updated.id ? updated : u)));
      setEditingUser(null);
      toast.success("Update Successful");
    } catch (err) {
      toast.error("Update failed");
      // console.error("Update failed", err)
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUser(userToDelete.id);
      setUsers(users.filter((u) => u.id !== userToDelete.id));
      setUserToDelete(null);
      toast.success("Delete Successful");
    } catch (err) {
      toast.error("Delete failed");
      // console.error("Delete failed", err);
    }
  };

  if (loading) return <p>Loading users...</p>;


  return (
    <>
        <AdminTable
          title="Users"
          headers={["Id", "Name", "Email", "Interface Lang", "Target Lang", "Admin"]}
          rows={users.map((u) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            interfaceLang: u.interfaceLanguage?.label || "—",
            targetLang: u.targetLanguage?.label || "—",
            admin: u.roles?.includes("ROLE_ADMIN") ? "✅" : "—",
          }))}
          renderActions={(u) => (
            <>
              <span
                onClick={() =>
                  handleEdit(users.find((user) => user.id === u.id))
                }
                className="text-blue-600 cursor-pointer mr-4 hover:underline"
              >
                Edit
              </span>
              <span
                onClick={() =>
                  setUserToDelete(users.find((user) => user.id === u.id))
                }
                className="text-red-600 cursor-pointer hover:underline"
              >
                Delete
              </span>
            </>
          )}
        />

      {editingUser && (
        <AdminModal
          title="Edit User"
          form={form}
          onChange={handleFormChange}
          onClose={() => setEditingUser(null)}
          onSubmit={handleSave}
          submitLabel="Save"
          fields={[
            { name: "name", label: "Name", placeholder: "User name" },
            { name: "email", label: "Email", placeholder: "User email" },
            {
              name: "plainPassword",
              label: "Password",
              type: "password",
              placeholder: "New password (optional)",
            },
            {
              name: "interfaceLanguage",
              label: "Interface Language",
              type: "select",
              options: languages.map((l) => ({
                value: `/api/languages/${l.id}`,
                label: l.label,
              })),
            },
            {
              name: "targetLanguage",
              label: "Target Language",
              type: "select",
              options: languages.map((l) => ({
                value: `/api/languages/${l.id}`,
                label: l.label,
              })),
            },
            {
              name: "isAdmin",
              label: "Admin",
              type: "checkbox",
              checkboxLabel: "Grant admin access",
            },
          ]}
        />
      )}

      {userToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white backdrop-blur-md p-8 rounded-3xl w-full max-w-md shadow-xl">
            <h4 className="text-2xl font-black text-center mb-6 text-gray-800">Confirm Deletion</h4>
            <p className="text-gray-700 mb-6 text-center">Are you sure you want to delete <strong>{userToDelete.name}</strong>?</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setUserToDelete(null)} className="px-4 py-2 bg-white/60 text-gray-800 font-semibold rounded-xl shadow">Cancel</button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl shadow">Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
