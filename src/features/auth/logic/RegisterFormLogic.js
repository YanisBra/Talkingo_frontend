import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { register } from "@/services/AuthService";
import { useAuth } from "@/contexts/AuthContext";
import useLanguage from "@/hooks/useLanguage";

export default function RegisterFormLogic() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const { login } = useAuth();
  const { languages } = useLanguage();

  const [form, setForm] = useState({
    name: "",
    email: "",
    plainPassword: "",
    interfaceLanguage: "",
    targetLanguage: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.plainPassword.length < 12) {
      setPasswordError("Password must be at least 12 characters.");
      return;
    }
    setPasswordError("");
    setLoading(true);
    try {
      await register({
        name: form.name,
        email: form.email,
        plainPassword: form.plainPassword,
        interfaceLanguage: form.interfaceLanguage,
        targetLanguage: form.targetLanguage,
      });
      await login(form.email, form.plainPassword);
      navigate("/");
    } catch (err) {
      toast.error("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    setForm,
    loading,
    handleChange,
    handleSubmit,
    languages,
    passwordError,
    setPasswordError,
  };
}
