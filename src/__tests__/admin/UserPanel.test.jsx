import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UserPanel from "@/features/admin/UserPanel";
import * as usersService from "@/services/usersService";
import * as languagesService from "@/services/languagesService";
import { vi } from "vitest";

vi.mock("@/services/usersService");
vi.mock("@/services/languagesService");

describe("UserPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders users table", async () => {
    usersService.getUsers.mockResolvedValueOnce({
      member: [
        {
          id: 1,
          name: "John",
          email: "john@example.com",
          interfaceLanguage: { label: "Français" },
          targetLanguage: { label: "English" },
          roles: ["ROLE_ADMIN"],
        },
      ],
    });
    languagesService.getLanguages.mockResolvedValueOnce({ member: [] });

    render(<UserPanel />);

    expect(await screen.findByText("John")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("Français")).toBeInTheDocument();
    expect(screen.getByText("English")).toBeInTheDocument();
    expect(screen.getByText("✅")).toBeInTheDocument();
  });

  it("edits a user and updates roles", async () => {
    usersService.getUsers.mockResolvedValueOnce({
      member: [
        {
          id: 2,
          name: "Alice",
          email: "alice@example.com",
          interfaceLanguage: { label: "Français", "@id": "/api/languages/1" },
          targetLanguage: { label: "Español", "@id": "/api/languages/2" },
          roles: [],
        },
      ],
    });
    languagesService.getLanguages.mockResolvedValueOnce({
      member: [
        { id: 1, label: "Français" },
        { id: 2, label: "Español" },
      ],
    });
    usersService.updateUser.mockResolvedValueOnce({ id: 2 });

    render(<UserPanel />);

    fireEvent.click(await screen.findByText("Edit"));

    fireEvent.change(screen.getByPlaceholderText("User name"), {
      target: { name: "name", value: "Alice Updated" },
    });
    fireEvent.click(screen.getByLabelText("Grant admin access"));

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(usersService.updateUser).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Alice Updated",
          roles: ["ROLE_ADMIN"],
        })
      );
    });
  });

  it("deletes a user", async () => {
    usersService.getUsers.mockResolvedValueOnce({
      member: [
        {
          id: 3,
          name: "Bob",
          email: "bob@example.com",
          interfaceLanguage: { label: "EN" },
          targetLanguage: { label: "FR" },
          roles: [],
        },
      ],
    });
    languagesService.getLanguages.mockResolvedValueOnce({ member: [] });
    usersService.deleteUser.mockResolvedValueOnce();

    render(<UserPanel />);

    fireEvent.click(await screen.findByText("Delete"));
    fireEvent.click(screen.getByRole("button", { name: /delete/i }));

    await waitFor(() => {
      expect(usersService.deleteUser).toHaveBeenCalledWith(3);
    });
  });
});