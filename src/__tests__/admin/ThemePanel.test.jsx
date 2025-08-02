import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ThemePanel from "@/features/admin/ThemePanel";
import * as themesService from "@/services/themesService";
import { vi } from "vitest";

vi.mock("@/services/themesService");

describe("ThemePanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders themes table", async () => {
    themesService.getThemes.mockResolvedValueOnce({
      member: [
        { id: 1, code: "AIRPORT" },
      ],
    });

    render(<ThemePanel />);

    expect(await screen.findByText("AIRPORT")).toBeInTheDocument();
    expect(screen.getByText("Themes")).toBeInTheDocument();
  });

  it("opens create modal and adds a theme", async () => {
    themesService.getThemes.mockResolvedValueOnce({ member: [] });
    themesService.createTheme.mockResolvedValueOnce({ id: 2, code: "RESTAURANT" });

    render(<ThemePanel />);

    fireEvent.click(await screen.findByRole("button", { name: /new theme/i }));
    fireEvent.change(screen.getByPlaceholderText(/ex: AIRPORTS/i), {
      target: { name: "code", value: "RESTAURANT" },
    });
    fireEvent.click(screen.getByRole("button", { name: /create/i }));

    await waitFor(() => {
      expect(themesService.createTheme).toHaveBeenCalledWith("RESTAURANT");
    });
  });

  it("opens edit modal and updates theme", async () => {
    themesService.getThemes.mockResolvedValueOnce({
      member: [{ id: 3, code: "HOTEL" }],
    });
    themesService.updateTheme.mockResolvedValueOnce();

    render(<ThemePanel />);

    fireEvent.click(await screen.findByText("Edit"));
    fireEvent.change(screen.getByPlaceholderText(/ex: AIRPORTS/i), {
      target: { name: "code", value: "HOTELS" },
    });
    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(themesService.updateTheme).toHaveBeenCalledWith(3, "HOTELS");
    });
  });

  it("deletes a theme", async () => {
    themesService.getThemes.mockResolvedValueOnce({
      member: [{ id: 4, code: "MARKET" }],
    });
    themesService.deleteTheme.mockResolvedValueOnce();

    render(<ThemePanel />);

    fireEvent.click(await screen.findByText("Delete"));
    fireEvent.click(await screen.findByRole("button", { name: /delete/i }));

    await waitFor(() => {
      expect(themesService.deleteTheme).toHaveBeenCalledWith(4);
    });
  });
});