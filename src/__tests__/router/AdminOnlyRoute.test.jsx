import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import AdminOnlyRoute from "@/router/AdminOnlyRoute";
import { AuthContext } from "@/contexts/AuthContext";

describe("AdminOnlyRoute", () => {
  const renderWithAuth = ({ user, loading }) => {
    return render(
      <AuthContext.Provider value={{ user, loading }}>
        <MemoryRouter initialEntries={["/admin"]}>
          <Routes>
            <Route
              path="/admin"
              element={
                <AdminOnlyRoute>
                  <div>Admin Content</div>
                </AdminOnlyRoute>
              }
            />
            <Route path="/login" element={<div>Login Page</div>} />
            <Route path="/" element={<div>Home Page</div>} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    );
  };

  it("renders nothing while loading", () => {
    const { container } = renderWithAuth({ user: null, loading: true });
    expect(container).toBeEmptyDOMElement();
  });

  it("redirects to /login if not authenticated", () => {
    renderWithAuth({ user: null, loading: false });
    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });

  it("redirects to / if user is not admin", () => {
    renderWithAuth({ user: { id: 1, roles: ["ROLE_USER"] }, loading: false });
    expect(screen.getByText("Home Page")).toBeInTheDocument();
  });

  it("renders children if user is admin", () => {
    renderWithAuth({ user: { id: 1, roles: ["ROLE_ADMIN"] }, loading: false });
    expect(screen.getByText("Admin Content")).toBeInTheDocument();
  });
});
