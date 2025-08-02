import { useEffect, useState } from "react";
import { getLanguages } from "@/services/languagesService";
import { updateUser, deleteUser } from "@/services/usersService";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';


export default function AccountPageLogic() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [form, setForm] = useState({
    id: "",
    name: "",
    email: "",
    plainPassword: "",
    interfaceLanguage: "",
    targetLanguage: "",
  });

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const langs = await getLanguages();
        setLanguages(langs.member || []);

        const interfaceLang = langs.member.find(
          (l) => l.label === user.interfaceLanguage?.label
        );
        const targetLang = langs.member.find(
          (l) => l.label === user.targetLanguage?.label
        );

        setForm({
          id: user.id,
          name: user.name || "",
          email: user.email || "",
          plainPassword: "",
          interfaceLanguage: interfaceLang
            ? `/api/languages/${interfaceLang.id}`
            : "",
          targetLanguage: targetLang ? `/api/languages/${targetLang.id}` : "",
        });
      } catch (error) {
        console.error("Failed to load languages", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLanguages();
  }, [user]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      if (form.plainPassword.trim() && form.plainPassword.length < 12) {
        setPasswordError("Password must be at least 12 characters.");
        setSaving(false);
        return;
      } else {
        setPasswordError("");
      }

      const isSensitiveChange =
        form.email !== user.email ||
        (form.plainPassword && form.plainPassword.trim().length > 0);

      if (isSensitiveChange) {
        const confirmed = window.confirm(
          "Modifying your email or password will log you out. Continue?"
        );
        if (!confirmed) {
          setSaving(false);
          return;
        }
      }

      const payload = {
        id: form.id,
        name: form.name,
        email: form.email,
        interfaceLanguage: form.interfaceLanguage,
        targetLanguage: form.targetLanguage,
        roles: [],
      };
      if (form.plainPassword.trim()) {
        payload.plainPassword = form.plainPassword;
      }

      await updateUser(payload);
      if (isSensitiveChange) {
        logout();
        navigate("/login");
        return;
      }
      toast.success("Account updated!");
    } catch (error) {
      console.error("Failed to update account", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteUser(user.id);
      logout();
      navigate("/register");
    } catch (error) {
      console.error("Failed to delete account", error);
    }
  };

  return {
    form,
    setForm,
    loading,
    saving,
    languages,
    handleFormChange,
    handleSave,
    handleDeleteAccount,
    passwordError,
  };
}
