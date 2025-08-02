import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import GroupSettingsPage from "@/pages/Group/GroupSettingsPage";
import { vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AuthContext } from "@/contexts/AuthContext";

// Mocks personnalisés
const mockSetShowEditModal = vi.fn();
const mockSetGroupName = vi.fn();
const mockSetGroupCode = vi.fn();
const mockHandleLeaveGroup = vi.fn();
const mockHandleRemoveMember = vi.fn();
const mockHandleUpdateGroup = vi.fn().mockResolvedValue(true);
const mockHandleRegenerateCode = vi.fn();

vi.mock("@/features/groups/logic/GroupSettingsLogic", () => {
  return {
    default: () => ({
      memberships: [
        {
          id: 1,
          user: { id: 1, name: "Bob", "@id": "/api/users/1" },
          joinedAt: new Date().toISOString(),
          isAdmin: true,
        },
        {
          id: 2,
          user: { id: 2, name: "Alice", "@id": "/api/users/2" },
          joinedAt: new Date().toISOString(),
          isAdmin: false,
        },
      ],
      groupName: "Test Group",
      setGroupName: mockSetGroupName,
      isAdmin: true,
      groupCode: "ABCDEFGH",
      setGroupCode: mockSetGroupCode,
      showEditModal: true,
      setShowEditModal: mockSetShowEditModal,
      handleLeaveGroup: mockHandleLeaveGroup,
      handleRemoveMember: mockHandleRemoveMember,
      handleUpdateGroup: mockHandleUpdateGroup,
      handleRegenerateCode: mockHandleRegenerateCode,
    }),
  };
});

describe("GroupSettingsPage", () => {
  const renderPage = () =>
    render(
      <AuthContext.Provider value={{ user: { id: 1, name: "Bob" } }}>
        <MemoryRouter initialEntries={["/groups/1/settings"]}>
          <Routes>
            <Route path="/groups/:id/settings" element={<GroupSettingsPage />} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    );

  it("renders group info and member table", () => {
    renderPage();
    expect(screen.getByText("Test Group")).toBeInTheDocument();
    expect(screen.getByText("ABCDEFGH")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
  });

  it("calls setShowEditModal(true) when Edit Group button clicked", () => {
    renderPage();
    const editBtn = screen.getByText("Edit Group");
    fireEvent.click(editBtn);
    expect(mockSetShowEditModal).toHaveBeenCalledWith(true);
  });

  it("submits group update form successfully", async () => {
    renderPage();
    const saveBtn = screen.getByText("Save");
    fireEvent.click(saveBtn);
    await waitFor(() => {
      expect(mockHandleUpdateGroup).toHaveBeenCalled();
      expect(mockSetShowEditModal).toHaveBeenCalledWith(false);
    });
  });
});
