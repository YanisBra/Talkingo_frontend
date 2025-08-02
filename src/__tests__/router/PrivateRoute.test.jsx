import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "@/router/PrivateRoute";
import { AuthContext } from "@/contexts/AuthContext";

describe("PrivateRoute", () => {
  const renderWithAuth = ({ user, loading }) => {
    return render(
      <AuthContext.Provider value={{ user, loading }}>
        <MemoryRouter initialEntries={["/private"]}>
          <Routes>
            <Route
              path="/private"
              element={
                <PrivateRoute>
                  <div>Private Content</div>
                </PrivateRoute>
              }
            />
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    );
  };

  it("renders nothing while loading", () => {
    const { container } = renderWithAuth({ user: null, loading: true });
    expect(container).toBeEmptyDOMElement();
  });

  it("redirects to /login if user is not authenticated", () => {
    renderWithAuth({ user: null, loading: false });
    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });

  it("renders children if user is authenticated", () => {
    renderWithAuth({ user: { id: 1 }, loading: false });
    expect(screen.getByText("Private Content")).toBeInTheDocument();
  });
});
