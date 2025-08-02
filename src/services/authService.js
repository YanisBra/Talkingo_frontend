import api from "./api";

export async function login(email, password) {
  const response = await api.post("/login_check", { email, password });
  return response.data;
}

export async function getCurrentUser() {
  const response = await api.get("/users/me");
  return response.data;
}

export async function register({
  name,
  email,
  plainPassword,
  interfaceLanguage,
  targetLanguage,
}) {
  const response = await api.post(
    "/users",
    { name, email, plainPassword, interfaceLanguage, targetLanguage },
    {
      headers: {
        "Content-Type": "application/ld+json",
      },
    }
  );

  return response;
}
