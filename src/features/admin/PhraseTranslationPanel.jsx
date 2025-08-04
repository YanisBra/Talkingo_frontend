
import { useEffect, useState } from "react";
import {
  getPhraseTranslations,
  createPhraseTranslation,
  updatePhraseTranslation,
  deletePhraseTranslation,
} from "@/services/phraseTranslationsService";
import { getLanguages } from "@/services/languagesService";
import { getPhrases } from "@/services/phrasesService";
import AdminTable from "@/components/AdminTable";
import AdminModal from "@/components/AdminModal";
import BlackButton from "@/components/BlackButton";
import PinkButton from "@/components/PinkButton";

export default function PhraseTranslationPanel() {
  const [translations, setTranslations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ text: "", language: "", phrase: "" });
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [phrases, setPhrases] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const data = await getPhraseTranslations();
        const langs = await getLanguages();
        const phs = await getPhrases();
        setTranslations(data.member || []);
        setLanguages(langs.member || []);
        setPhrases(phs.member || []);
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
    setForm({ ...form, [name]: value });
  };

  const handleCreate = async () => {
    if (!form.text || !form.language || !form.phrase) return;
    try {
      const created = await createPhraseTranslation(form);
      setTranslations([...translations, created]);
      setForm({ text: "", language: "", phrase: "" });
      setShowCreateModal(false);
    } catch (err) {
      console.error("Create failed", err);
    }
  };

  const handleEdit = (tr) => {
    setEditing(tr);
    setForm({
      text: tr.text,
      phrase: tr.phrase["@id"],
      language: tr.language["@id"],
    });
  };

  const handleSave = async () => {
    try {
      const updated = await updatePhraseTranslation(editing.id, form);
      setTranslations(translations.map((t) => (t.id === editing.id ? updated : t)));
      setEditing(null);
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const handleDelete = async () => {
    try {
      await deletePhraseTranslation(toDelete.id);
      setTranslations(translations.filter((t) => t.id !== toDelete.id));
      setToDelete(null);
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  if (loading) return <p>Loading phrase translations...</p>;

  return (
    <>
      <AdminTable
        title="Phrase Translations"
        headers={["Id", "Phrase", "Language", "Translation"]}
        rows={translations.map((t) => ({
          Id: t.id,
          Phrase: t.phrase?.code || "—",
          Language: t.language?.label || t.language?.code || "—",
          Translation: t.text,
        }))}
        renderActions={(t) => (
          <>
            <span
              onClick={() => handleEdit(translations.find((tr) => tr.id === t.Id))}
              className="text-blue-600 cursor-pointer mr-4 hover:underline"
            >
              Edit
            </span>
            <span
              onClick={() => setToDelete(translations.find((tr) => tr.id === t.Id))}
              className="text-red-600 cursor-pointer hover:underline"
            >
              Delete
            </span>
          </>
        )}
        onAdd={() => setShowCreateModal(true)}
      />

      {(editing || showCreateModal) && (
        <AdminModal
          title={editing ? "Edit Translation" : "Create Translation"}
          fields={[
            {
              name: "phrase",
              label: "Phrase",
              type: "select",
              options: phrases.map((p) => ({ value: `/api/phrases/${p.id}`, label: p.code })),
              placeholder: "Select a phrase",
            },
            {
              name: "language",
              label: "Language",
              type: "select",
              options: languages.map((l) => ({ value: `/api/languages/${l.id}`, label: l.label })),
              placeholder: "Select a language",
            },
            {
              name: "text",
              label: "Translation",
              placeholder: "Enter translated text",
            },
          ]}
          form={form}
          onChange={handleFormChange}
          onClose={() => {
            setEditing(null);
            setShowCreateModal(false);
            setForm({ text: "", language: "", phrase: "" });
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
              Are you sure you want to delete <strong>{toDelete.text}</strong>?
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