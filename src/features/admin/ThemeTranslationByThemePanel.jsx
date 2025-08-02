import { useEffect, useState } from "react";
import {
  getThemeTranslationsByTheme,
  createThemeTranslation,
  updateThemeTranslation,
  deleteThemeTranslation,
} from "@/services/themeTranslationsService";
import { getLanguages } from "@/services/languagesService";
import AdminTable from "@/components/AdminTable";
import AdminModal from "@/components/AdminModal";
import WhiteButton from "../../components/WhiteButton";

export default function ThemeTranslationByThemePanel({ theme, onBack }) {
  const [translations, setTranslations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    label: "",
    language: "",
    theme: theme["@id"],
  });
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [languages, setLanguages] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const data = await getThemeTranslationsByTheme(theme.id);
        const langs = await getLanguages();
        setTranslations(data.member || []);
        setLanguages(langs.member || []);
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [theme]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleCreate = async () => {
    if (!form.label || !form.language || !form.theme) return;
    try {
      const created = await createThemeTranslation(form);
      setTranslations([...translations, created]);
      setForm({ label: "", language: "", theme: theme["@id"] });
      setShowCreateModal(false);
    } catch (err) {
      console.error("Create failed", err);
    }
  };

  const handleEdit = (tr) => {
    setEditing(tr);
    setForm({
      label: tr.label,
      theme: tr.theme["@id"],
      language: tr.language["@id"],
    });
  };

  const handleSave = async () => {
    try {
      const updated = await updateThemeTranslation(editing.id, form);
      setTranslations(
        translations.map((t) => (t.id === editing.id ? updated : t))
      );
      setEditing(null);
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteThemeTranslation(toDelete.id);
      setTranslations(translations.filter((t) => t.id !== toDelete.id));
      setToDelete(null);
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  if (loading) return <p>Loading translations...</p>;

  return (
    <>
      <WhiteButton
        paddingX={4}
        paddingY={2}
        marginBottom={4}
        onClick={onBack}
        label={"← Back to Themes"}
      />
      <AdminTable
        title={`Translations for theme: ${theme.code}`}
        headers={["Id", "Label", "Language"]}
        rows={translations.map((t) => ({
          Id: t.id,
          Label: t.label,
          Language: t.language?.label || t.language?.code || "—",
        }))}
        renderActions={(row) => {
          const original = translations.find((t) => t.id === row.Id);
          return (
            <>
              <span
                onClick={() => handleEdit(original)}
                className="text-blue-600 cursor-pointer mr-4 hover:underline"
              >
                Edit
              </span>
              <span
                onClick={() => setToDelete(original)}
                className="text-red-600 cursor-pointer hover:underline"
              >
                Delete
              </span>
            </>
          );
        }}
      />

      {(editing || showCreateModal) && (
        <AdminModal
          title={editing ? "Edit Translation" : "Create Translation"}
          fields={[
            {
              name: "language",
              label: "Language",
              type: "select",
              options: languages.map((l) => ({
                value: `/api/languages/${l.id}`,
                label: l.label,
              })),
              placeholder: "Select a language",
            },
            {
              name: "label",
              label: "Label",
              type: "text",
              placeholder: "Enter label",
            },
          ]}
          form={form}
          onChange={handleFormChange}
          onClose={() => {
            setEditing(null);
            setShowCreateModal(false);
            setForm({ label: "", language: "", theme: theme?.["@id"] });
          }}
          onSubmit={editing ? handleSave : handleCreate}
        />
      )}

      {toDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white backdrop-blur-md p-8 rounded-3xl w-full max-w-md shadow-xl">
            <h4 className="text-2xl font-black text-center mb-6 text-gray-800">
              Confirm Deletion
            </h4>
            <p className="text-gray-700 mb-6 text-center">
              Are you sure you want to delete <strong>{toDelete.label}</strong>?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setToDelete(null)}
                className="px-4 py-2 bg-white/60 hover:bg-white/80 text-gray-800 font-semibold rounded-xl shadow"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl shadow"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
