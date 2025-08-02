import { createContext, useContext, useState, useEffect } from 'react';
import { login as loginApi, getCurrentUser } from '@/services/authService';


export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    const { token } = await loginApi(email, password); 
    localStorage.setItem('token', token);
    const user = await getCurrentUser();
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (!savedToken) return setLoading(false);

    getCurrentUser()
      .then(setUser)
      .catch(logout)
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);