import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import PrivateRoute from "@/router/PrivateRoute";
import AdminOnlyRoute from "@/router/AdminOnlyRoute";

import Footer from "./components/Footer";
import LegalNoticePage from "./pages/LegalNoticePage";
import LoginPage from "@/pages/Auth/LoginPage";
import RegisterPage from "@/pages/Auth/RegisterPage";
import AccountPage from "@/pages/Auth/AccountPage";
import AdminPage from "@/pages/AdminPage";
import NotFoundPage from "@/pages/NotFoundPage";
import ThemesPage from "@/pages/ThemesPage";
import PhrasesPage from "@/pages/Phrase/PhrasesPage";
import GroupsPage from "@/pages/Group/GroupsPage";
import GroupPage from "@/pages/Group/GroupPage";
import GroupSettingsPage from "@/pages/Group/GroupSettingsPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
       <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/legal" element={<LegalNoticePage />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <ThemesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/account"
            element={
              <PrivateRoute>
                <AccountPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/theme/:id"
            element={
              <PrivateRoute>
                <PhrasesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/groups"
            element={
              <PrivateRoute>
                <GroupsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/group/:id"
            element={
              <PrivateRoute>
                <GroupPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminOnlyRoute>
                <AdminPage />
              </AdminOnlyRoute>
            }
          />
          <Route
            path="/groups/:id/settings"
            element={
              <PrivateRoute>
                <GroupSettingsPage />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        </main>
        <Footer/>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
