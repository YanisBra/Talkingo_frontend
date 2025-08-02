import { render, screen, fireEvent } from "@testing-library/react";
import ThemesPage from "@/pages/Theme/ThemesPage";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "@/contexts/AuthContext";

// Mock du hook de progression
vi.mock("@/features/theme/logic/UserThemesProgressLogic", () => {
  return {
    default: () => ({
      loading: false,
      progressData: [
        {
          theme: {
            id: 1,
            label_interface: "Airport",
            label_target: "Aeropuerto",
          },
          progress: 75,
        },
        {
          theme: {
            id: 2,
            label_interface: "Restaurant",
            label_target: "Restaurante",
          },
          progress: 50,
        },
      ],
    }),
  };
});

// Mock de useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("ThemesPage", () => {
  const renderPage = () =>
    render(
      <AuthContext.Provider value={{ user: { name: "Alice" } }}>
        <MemoryRouter>
          <ThemesPage />
        </MemoryRouter>
      </AuthContext.Provider>
    );

  it("displays welcome message and themes", () => {
    renderPage();

    expect(screen.getByText("Welcome back Alice!")).toBeInTheDocument();
    expect(screen.getByText("Airport")).toBeInTheDocument();
    expect(screen.getByText("Aeropuerto")).toBeInTheDocument();
    expect(screen.getByText("Restaurant")).toBeInTheDocument();
    expect(screen.getByText("Restaurante")).toBeInTheDocument();
  });

  it("filters themes based on search", () => {
    renderPage();

    const input = screen.getByPlaceholderText(/search themes/i);
    fireEvent.change(input, { target: { value: "airp" } });

    expect(screen.getByText("Airport")).toBeInTheDocument();
    expect(screen.queryByText("Restaurant")).not.toBeInTheDocument();
  });

  it("navigates to theme detail on card click", () => {
    renderPage();

    fireEvent.click(screen.getByText("Airport"));
    expect(mockNavigate).toHaveBeenCalledWith("/theme/1");
  });
});