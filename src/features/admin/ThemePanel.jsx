import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { getThemes, createTheme, updateTheme, deleteTheme } from "@/services/themesService";
import ThemeTranslationByThemePanel from "./ThemeTranslationByThemePanel";
import AdminTable from "@/components/AdminTable";
import AdminModal from "@/components/AdminModal";

export default function ThemePanel() {
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTheme, setEditingTheme] = useState(null);
  const [themeToDelete, setThemeToDelete] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [form, setForm] = useState({ code: "" });
  const [selectedTheme, setSelectedTheme] = useState(null);

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const data = await getThemes();
        setThemes(data.member || []);
      } catch (error) {
        console.error("Failed to fetch themes", error);
      } finally {
        setLoading(false);
      }
    };
    fetchThemes();
  }, []);

  const handleEdit = (theme) => {
    setEditingTheme(theme);
    setForm({ code: theme.code });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSave = async () => {
    try {
      await updateTheme(editingTheme.id, form.code);
      const updated = themes.map((t) => t.id === editingTheme.id ? { ...t, code: form.code } : t);
      setThemes(updated);
      setEditingTheme(null);
    } catch (error) {
      console.error("Failed to update theme", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTheme(themeToDelete.id);
      setThemes((prev) => prev.filter((t) => t.id !== themeToDelete.id));
      setThemeToDelete(null);
    } catch (error) {
      console.error("Failed to delete theme", error);
    }
  };

  const handleCreate = async () => {
    if (!form.code) return toast.error("Code is required");
    try {
      const newTheme = await createTheme(form.code);
      setThemes((prev) => [...prev, newTheme]);
      setShowCreateModal(false);
      setForm({ code: "" });
    } catch (error) {
      console.error("Failed to create theme", error);
    }
  };

  if (loading) return <p>Loading themes...</p>;

  if (selectedTheme) {
    return (
      <ThemeTranslationByThemePanel
        theme={selectedTheme}
        onBack={() => setSelectedTheme(null)}
      />
    );
  }

  return (
    <>
      <AdminTable
        title="Themes"
        headers={["Id", "Code"]}
        rows={themes.map((t) => ({
          Id: t.id,
          Code: t.code,
        }))}
        renderActions={(row) => (
          <>
            <span
              onClick={(e) => {
                e.stopPropagation();
                const theme = themes.find((t) => t.id === row.Id);
                handleEdit(theme);
              }}
              className="text-sm text-blue-600 hover:underline cursor-pointer"
            >
              Edit
            </span>
            <span
              onClick={(e) => {
                e.stopPropagation();
                const theme = themes.find((t) => t.id === row.Id);
                setThemeToDelete(theme);
              }}
              className="ml-4 text-red-600 hover:underline cursor-pointer"
            >
              Delete
            </span>
          </>
        )}
        onAdd={() => setShowCreateModal(true)}
        onRowClick={(row) => {
          const theme = themes.find((t) => t.id === row.Id);
          if (theme) setSelectedTheme(theme);
        }}
      />

      {editingTheme && (
        <AdminModal
          title="Edit Theme"
          fields={[{ name: "code", label: "Code", placeholder: "ex: AIRPORTS" }]}
          form={form}
          onChange={handleFormChange}
          onClose={() => setEditingTheme(null)}
          onSubmit={handleSave}
          submitLabel="Save"
        />
      )}

      {showCreateModal && (
        <AdminModal
          title="Create Theme"
          fields={[{ name: "code", label: "Code", placeholder: "ex: AIRPORTS" }]}
          form={form}
          onChange={handleFormChange}
          onClose={() => { setShowCreateModal(false); setForm({ code: "" }); }}
          onSubmit={handleCreate}
          submitLabel="Create"
        />
      )}

      {themeToDelete && (
        <AdminModal
          title="Confirm Deletion"
          fields={[]}
          form={{}}
          onChange={() => {}}
          onClose={() => setThemeToDelete(null)}
          onSubmit={handleDelete}
          submitLabel="Delete"
        />
      )}
    </>
  );
}