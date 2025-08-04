import { useEffect, useState } from "react";
import {
  getThemeTranslations,
  createThemeTranslation,
  updateThemeTranslation,
  deleteThemeTranslation,
} from "@/services/themeTranslationsService";
import { getLanguages } from "@/services/languagesService";
import { getThemes } from "@/services/themesService";
import AdminTable from "@/components/AdminTable";
import AdminModal from "@/components/AdminModal";
import BlackButton from "@/components/BlackButton";
import PinkButton from "@/components/PinkButton";

export default function ThemeTranslationPanel() {
  const [translations, setTranslations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ label: "", language: "", theme: "" });
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [themes, setThemes] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const data = await getThemeTranslations();
        const langs = await getLanguages();
        const thms = await getThemes();
        setTranslations(data.member || []);
        setLanguages(langs.member || []);
        setThemes(thms.member || []);
      } catch (err) {
        console.error("Failed to fetch data", err);
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

  const handleCreate = async () => {
    if (!form.label || !form.language || !form.theme) return;
    try {
      const created = await createThemeTranslation(form);
      setTranslations([...translations, created]);
      setShowModal(false);
      setForm({ label: "", language: "", theme: "" });
    } catch (err) {
      console.error("Create failed", err);
    }
  };

  const handleEdit = (t) => {
    setEditing(t);
    setForm({
      label: t.label,
      theme: t.theme["@id"],
      language: t.language["@id"],
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      const updated = await updateThemeTranslation(editing.id, form);
      setTranslations(
        translations.map((t) => (t.id === editing.id ? updated : t))
      );
      setEditing(null);
      setShowModal(false);
      setForm({ label: "", language: "", theme: "" });
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
      <AdminTable
        title="Theme Translations"
        headers={["ID", "Theme", "Language", "Label"]}
        rows={translations.map((t) => ({
          ID: t.id,
          Theme: t.theme?.code || "—",
          Language: t.language?.label || "—",
          Label: t.label,
        }))}
        onAdd={() => {
          setForm({ label: "", language: "", theme: "" });
          setEditing(null);
          setShowModal(true);
        }}
        renderActions={(row) => {
          const t = translations.find((tr) => tr.id === row.ID);
          return (
            <>
              <span
                onClick={() => handleEdit(t)}
                className="text-blue-600 cursor-pointer mr-4 hover:underline"
              >
                Edit
              </span>
              <span
                onClick={() => setToDelete(t)}
                className="text-red-600 cursor-pointer hover:underline"
              >
                Delete
              </span>
            </>
          );
        }}
      />

      {showModal && (
        <AdminModal
          title={editing ? "Edit Translation" : "New Translation"}
          fields={[
            {
              name: "theme",
              label: "Theme",
              type: "select",
              placeholder: "Select a theme",
              options: themes.map((t) => ({
                value: "/api/themes/" + t.id,
                label: t.code,
              })),
            },
            {
              name: "language",
              label: "Language",
              type: "select",
              placeholder: "Select a language",
              options: languages.map((l) => ({
                value: "/api/languages/" + l.id,
                label: l.label,
              })),
            },
            {
              name: "label",
              label: "Label",
              type: "text",
              placeholder: "Enter translated label",
            },
          ]}
          form={form}
          onChange={handleFormChange}
          onClose={() => {
            setShowModal(false);
            setEditing(null);
            setForm({ label: "", language: "", theme: "" });
          }}
          onSubmit={editing ? handleSave : handleCreate}
          submitLabel={editing ? "Save" : "Create"}
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
              <BlackButton
                onClick={() => setToDelete(null)}
                paddingX={4}
                paddingY={2}
                label="Cancel"
              />
              <PinkButton
                onClick={handleDelete}
                paddingX={4}
                paddingY={2}
                label="Delete"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
