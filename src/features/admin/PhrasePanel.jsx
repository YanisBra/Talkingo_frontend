import { useEffect, useState } from "react";
import {
  getPhrases,
  createPhrase,
  updatePhrase,
  deletePhrase,
} from "@/services/phrasesService";
import { getThemes } from "@/services/themesService";
import PhraseTranslationByPhrasePanel from "./PhraseTranslationsByThemePanel";
import AdminTable from "@/components/AdminTable";
import AdminModal from "@/components/AdminModal";

export default function PhrasePanel() {
  const [phrases, setPhrases] = useState([]);
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ code: "", theme: "" });
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPhrase, setSelectedPhrase] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const phs = await getPhrases();
        const thms = await getThemes();
        setPhrases(phs.member || []);
        setThemes(thms.member || []);
      } catch (err) {
        // console.error("Failed to fetch phrases or themes", err);
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
    if (!form.code || !form.theme) return;
    try {
      const created = await createPhrase(form.code, form.theme);
      setPhrases([...phrases, created]);
      setForm({ code: "", theme: "" });
      setShowCreateModal(false);
    } catch (err) {
      // console.error("Create failed", err);
    }
  };

  const handleEdit = (p) => {
    setEditing(p);
    setForm({
      code: p.code,
      theme: p.theme["@id"],
    });
  };

  const handleSave = async () => {
    try {
      const updated = await updatePhrase(editing.id, form);
      setPhrases(phrases.map((p) => (p.id === editing.id ? updated : p)));
      setEditing(null);
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const handleDelete = async () => {
    try {
      await deletePhrase(toDelete.id);
      setPhrases(phrases.filter((p) => p.id !== toDelete.id));
      setToDelete(null);
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  if (loading) return <p>Loading phrases...</p>;

  if (selectedPhrase) {
    return (
      <PhraseTranslationByPhrasePanel
        phrase={selectedPhrase}
        onBack={() => setSelectedPhrase(null)}
      />
    );
  }

  return (
    <>
      <AdminTable
        title="Phrases"
        headers={["Id", "Code", "Theme"]}
        rows={phrases.map((p) => ({
          id: p.id,
          code: p.code,
          theme: p.theme?.code || "—",
        }))}
        onAdd={() => setShowCreateModal(true)}
        onRowClick={(row) => {
          const selected = phrases.find((p) => p.id === row.id);
          if (selected) setSelectedPhrase(selected);
        }}
        renderActions={(row) => {
          const phrase = phrases.find((p) => p.id === row.id);
          return (
            <>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(phrase);
                }}
                className="text-blue-600 cursor-pointer mr-4 hover:underline"
              >
                Edit
              </span>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  setToDelete(phrase);
                }}
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
          title={editing ? "Edit Phrase" : "Create Phrase"}
          form={form}
          onChange={handleFormChange}
          onClose={() => {
            setEditing(null);
            setShowCreateModal(false);
            setForm({ code: "", theme: "" });
          }}
          onSubmit={editing ? handleSave : handleCreate}
          submitLabel={editing ? "Save" : "Create"}
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
              name: "code",
              label: "Code",
              placeholder: "Enter phrase code",
            },
          ]}
        />
      )}

      {toDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white backdrop-blur-md p-8 rounded-3xl w-full max-w-md shadow-xl">
            <h4 className="text-2xl font-black text-center mb-6 text-gray-800">Confirm Deletion</h4>
            <p className="text-gray-700 mb-6 text-center">
              Are you sure you want to delete <strong>{toDelete.code}</strong>?
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