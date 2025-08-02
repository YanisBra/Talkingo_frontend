import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getLanguages,
  updateLanguage,
  deleteLanguage,
  createLanguage,
} from "@/services/languagesService";
import AdminTable from "@/components/AdminTable";
import AdminModal from "@/components/AdminModal";

export default function LanguagePanel() {
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingLanguage, setEditingLanguage] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [form, setForm] = useState({
    code: "",
    label: "",
    iconUrl: "",
    isActive: true,
  });

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const data = await getLanguages();
        setLanguages(data.member || []);
      } catch (error) {
        toast.error("Failed to fetch languages");
      } finally {
        setLoading(false);
      }
    };
    fetchLanguages();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    try {
      const updated = await updateLanguage(editingLanguage.id, form);
      setLanguages((prev) =>
        prev.map((l) => (l.id === updated.id ? updated : l))
      );
      setEditingLanguage(null);
      toast.success("Language updated");
    } catch (error) {
      toast.error("Update failed");
    }
  };

  const handleCreate = async () => {
    if (!form.label || !form.code) {
      toast.error("Code and Label are required");
      return;
    }
    try {
      const newLang = await createLanguage(form);
      setLanguages((prev) => [...prev, newLang]);
      setForm({ code: "", label: "", iconUrl: "", isActive: true });
      setShowCreateModal(false);
      toast.success("Language created");
    } catch (error) {
      toast.error("Creation failed");
    }
  };

  const handleDelete = async (lang) => {
    try {
      await deleteLanguage(lang.id);
      setLanguages((prev) => prev.filter((l) => l.id !== lang.id));
      toast.success("Language deleted");
    } catch (error) {
      toast.error("Deletion failed");
    }
  };

  const headers = ["Id", "Code", "Label", "Active", "Icon", "Actions"];

  const rows = languages.map((l) => [
    l.id,
    l.code,
    l.label,
    l.isActive ? "✅" : "❌",
    l.iconUrl ? (
      <img
        src={l.iconUrl}
        alt="icon"
        className="w-6 h-6 inline-block rounded-full"
      />
    ) : (
      ""
    ),
    <>
      <span
        onClick={() => {
          setEditingLanguage(l);
          setForm({
            code: l.code,
            label: l.label,
            iconUrl: l.iconUrl || "",
            isActive: l.isActive,
          });
        }}
        className="text-blue-600 hover:underline cursor-pointer"
      >
        Edit
      </span>
      <span
        onClick={() => handleDelete(l)}
        className="ml-4 text-red-600 hover:underline cursor-pointer"
      >
        Delete
      </span>
    </>,
  ]);

  const fields = [
    {
      name: "code",
      label: "Code",
      type: "text",
      placeholder: "ex: en, fr",
    },
    {
      name: "label",
      label: "Label",
      type: "text",
      placeholder: "ex: English, Français",
    },
    {
      name: "iconUrl",
      label: "Icon URL",
      type: "text",
      placeholder: "ex: https://example.com/icon.png",
    },
    {
      name: "isActive",
      label: "Active",
      type: "checkbox",
      checkboxLabel: "This language is active",
    },
  ];

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <AdminTable
        title="Languages"
        headers={headers}
        rows={rows}
        onAdd={() => {
          setForm({ code: "", label: "", iconUrl: "", isActive: true });
          setShowCreateModal(true);
        }}
      />
      {editingLanguage && (
        <AdminModal
          title="Edit Language"
          fields={fields}
          form={form}
          onChange={handleChange}
          onClose={() => setEditingLanguage(null)}
          onSubmit={handleSave}
          submitLabel="Save"
        />
      )}
      {showCreateModal && (
        <AdminModal
          title="Create Language"
          fields={fields}
          form={form}
          onChange={handleChange}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreate}
          submitLabel="Create"
        />
      )}
    </>
  );
}
