import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "@/pages/Auth/LoginPage";
import { AuthContext } from "@/contexts/AuthContext";
import { MemoryRouter } from "react-router-dom";
import { toast } from "react-toastify";

// Mock de useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("react-toastify", () => ({
  toast: {
    error: vi.fn(),
  },
}));

describe("LoginPage", () => {
  const mockLogin = vi.fn();

  function renderLoginPage() {
    return render(
      <AuthContext.Provider value={{ login: mockLogin }}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </AuthContext.Provider>
    );
  }

  beforeEach(() => {
    mockLogin.mockReset();
    mockNavigate.mockReset();
    toast.error.mockReset();
  });

  it("displays the login form", () => {
    renderLoginPage();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("submits credentials and redirects if login succeeds", async () => {
    mockLogin.mockResolvedValueOnce();

    renderLoginPage();

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("user@example.com", "password123");
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("displays an error if login fails", async () => {
  mockLogin.mockRejectedValueOnce(new Error("Bad credentials"));

  renderLoginPage();

  fireEvent.change(screen.getByPlaceholderText(/email/i), {
    target: { value: "fail@example.com" },
  });
  fireEvent.change(screen.getByPlaceholderText(/password/i), {
    target: { value: "wrong" },
  });
  fireEvent.click(screen.getByRole("button", { name: /login/i }));

  await waitFor(() => {
    expect(toast.error).toHaveBeenCalledWith("Login failed");
  });
});
});