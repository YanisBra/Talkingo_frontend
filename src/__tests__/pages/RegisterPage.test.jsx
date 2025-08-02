import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RegisterPage from "@/pages/Auth/RegisterPage";
import { AuthContext } from "@/contexts/AuthContext";
import { MemoryRouter } from "react-router-dom";
import { register } from "@/services/authService.js";
import { toast } from "react-toastify";

const navigateMock = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock("react-toastify", () => {
  return {
    toast: {
      error: vi.fn(),
      success: vi.fn(),
    },
  };
});

beforeEach(() => {
  toast.error.mockReset();
});

vi.mock("@/services/AuthService", () => ({
  register: vi.fn(),
}));

vi.mock("@/hooks/useLanguage", () => {
  return {
    default: () => ({
      languages: [
        { id: 1, "@id": "/api/languages/1", label: "English" },
        { id: 2, "@id": "/api/languages/2", label: "Spanish" },
      ],
    }),
  };
});

describe("RegisterPage", () => {
  const loginMock = vi.fn();

  function renderRegisterPage() {
    return render(
      <AuthContext.Provider value={{ login: loginMock }}>
        <MemoryRouter>
          <RegisterPage />
        </MemoryRouter>
      </AuthContext.Provider>
    );
  }

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all fields", () => {
    renderRegisterPage();

    expect(screen.getByPlaceholderText(/name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByText(/interface language/i)).toBeInTheDocument();
    expect(screen.getByText(/target language/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign up/i })
    ).toBeInTheDocument();
  });

  it("shows password error if too short", async () => {
    renderRegisterPage();

    fireEvent.change(screen.getByPlaceholderText(/name/i), {
      target: { value: "User" },
    });
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "existing@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "short" },
    });
    fireEvent.change(screen.getAllByRole("combobox")[0], {
      target: { value: "/api/languages/1" },
    });
    fireEvent.change(screen.getAllByRole("combobox")[1], {
      target: { value: "/api/languages/2" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    expect(
      screen.getByText((text) =>
        text.includes("Password must be at least 12 characters.")
      )
    ).toBeInTheDocument();
  });

  it("displays an error if registration fails", async () => {
    register.mockRejectedValueOnce(new Error("Email already in use"));

    renderRegisterPage();

    fireEvent.change(screen.getByPlaceholderText(/name/i), {
      target: { value: "User" },
    });
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "existing@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "123456789012" },
    });
    fireEvent.change(screen.getAllByRole("combobox")[0], {
      target: { value: "/api/languages/1" },
    });
    fireEvent.change(screen.getAllByRole("combobox")[1], {
      target: { value: "/api/languages/2" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Registration failed");
    });
  });

  it("registers user, logs in, and redirects on success", async () => {
    register.mockResolvedValueOnce({});
    loginMock.mockResolvedValueOnce();

    renderRegisterPage();

    fireEvent.change(screen.getByPlaceholderText(/name/i), {
      target: { value: "User" },
    });
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "123456789012" },
    });
    fireEvent.change(screen.getAllByRole("combobox")[0], {
      target: { value: "/api/languages/1" },
    });
    fireEvent.change(screen.getAllByRole("combobox")[1], {
      target: { value: "/api/languages/2" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(register).toHaveBeenCalledWith({
        name: "User",
        email: "user@example.com",
        plainPassword: "123456789012",
        interfaceLanguage: "/api/languages/1",
        targetLanguage: "/api/languages/2",
      });

      expect(loginMock).toHaveBeenCalledWith("user@example.com", "123456789012");
      expect(navigateMock).toHaveBeenCalledWith("/");
    });
  });
});
