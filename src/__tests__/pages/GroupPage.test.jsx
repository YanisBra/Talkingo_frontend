import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import GroupPage from "@/pages/Group/GroupPage";
import { vi } from "vitest";

// Mock le hook de logique
vi.mock("@/features/groups/logic/GroupProgressLogic", () => {
  return {
    default: () => ({
      progressData: [
        {
          theme: {
            id: 1,
            label_interface: "Aéroport",
            label_target: "Aeropuerto",
          },
          averageProgress: 60,
        },
        {
          theme: {
            id: 2,
            label_interface: "Restaurant",
            label_target: "Restaurante",
          },
          averageProgress: 40,
        },
      ],
      loading: false,
      groupName: "Survival Spanish",
      groupCode: "ABC123",
      totalProgress: 50,
      selectedThemeId: null,
      membersProgressByTheme: {
        1: [
          { user: { id: 1, name: "Alice" }, progress: 80 },
          { user: { id: 2, name: "Bob" }, progress: 40 },
        ],
      },
      handleThemeClick: vi.fn(),
    }),
  };
});

describe("GroupPage", () => {
  const renderPage = () =>
    render(
      <MemoryRouter initialEntries={["/groups/1"]}>
        <Routes>
          <Route path="/groups/:id" element={<GroupPage />} />
        </Routes>
      </MemoryRouter>
    );

  it("displays group header and themes", () => {
    renderPage();

    expect(screen.getByText("Survival Spanish")).toBeInTheDocument();
    expect(screen.getByText("ABC123")).toBeInTheDocument();
    expect(screen.getByText("Aéroport")).toBeInTheDocument();
    expect(screen.getByText("Aeropuerto")).toBeInTheDocument();
    expect(screen.getByText("Restaurant")).toBeInTheDocument();
    expect(screen.getByText("Restaurante")).toBeInTheDocument();


  });

  it("shows overall progress", () => {
    renderPage();
    
    expect(screen.getByText("Overall Progress: 50%")).toBeInTheDocument();
  });

  it("shows themes progress", () => {
    renderPage();

    expect(screen.getByText("60% completed")).toBeInTheDocument();
    expect(screen.getByText("40% completed")).toBeInTheDocument();  });
});