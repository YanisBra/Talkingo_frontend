import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import GroupPanel from "@/features/admin/GroupPanel";
import * as groupsService from "@/services/groupsService";
import * as languagesService from "@/services/languagesService";
import { vi } from "vitest";

vi.mock("@/services/groupsService");
vi.mock("@/services/languagesService");

describe("GroupPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders groups table", async () => {
    groupsService.getGroups.mockResolvedValueOnce({
      member: [
        {
          id: 1,
          name: "Test Group",
          invitationCode: "ABC123",
          targetLanguage: { label: "English" },
          createdAt: new Date().toISOString(),
        },
      ],
    });
    languagesService.getLanguages.mockResolvedValueOnce({ member: [] });

    render(<GroupPanel />);

    expect(await screen.findByText("Test Group")).toBeInTheDocument();
    expect(screen.getByText("ABC123")).toBeInTheDocument();
    expect(screen.getByText("English")).toBeInTheDocument();
  });

  it("edits a group", async () => {
    groupsService.getGroups.mockResolvedValueOnce({
      member: [
        {
          id: 2,
          name: "Group A",
          invitationCode: "INV123",
          targetLanguage: { "@id": "/api/languages/1", label: "French" },
          createdAt: new Date().toISOString(),
        },
      ],
    });
    languagesService.getLanguages.mockResolvedValueOnce({
      member: [{ id: 1, label: "French" }],
    });
    groupsService.updateGroup.mockResolvedValueOnce({
      id: 2,
      name: "Group A Updated",
      targetLanguage: { label: "French" },
    });

    render(<GroupPanel />);

    fireEvent.click(await screen.findByText("Edit"));

    fireEvent.change(screen.getByPlaceholderText(/enter group name/i), {
      target: { name: "name", value: "Group A Updated" },
    });

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(groupsService.updateGroup).toHaveBeenCalledWith(2, {
        name: "Group A Updated",
        targetLanguage: "/api/languages/1",
      });
    });
  });

  it("deletes a group", async () => {
    groupsService.getGroups.mockResolvedValueOnce({
      member: [
        {
          id: 3,
          name: "Group B",
          invitationCode: "DEL123",
          targetLanguage: { label: "Spanish" },
          createdAt: new Date().toISOString(),
        },
      ],
    });
    languagesService.getLanguages.mockResolvedValueOnce({ member: [] });
    groupsService.deleteGroup.mockResolvedValueOnce();

    render(<GroupPanel />);

    fireEvent.click(await screen.findByText("Delete"));
    fireEvent.click(await screen.findByRole("button", { name: /delete/i }));

    await waitFor(() => {
      expect(groupsService.deleteGroup).toHaveBeenCalledWith(3);
    });
  });
});