import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ThemeTranslationPanel from "@/features/admin/ThemeTranslationPanel";
import * as translationsService from "@/services/themeTranslationsService";
import * as languagesService from "@/services/languagesService";
import * as themesService from "@/services/themesService";
import { vi } from "vitest";

vi.mock("@/services/themeTranslationsService");
vi.mock("@/services/languagesService");
vi.mock("@/services/themesService");

describe("ThemeTranslationPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders translations table", async () => {
    translationsService.getThemeTranslations.mockResolvedValueOnce({
      member: [
        {
          id: 1,
          label: "Aéroport",
          language: { label: "Français" },
          theme: { code: "AIRPORT" },
        },
      ],
    });
    languagesService.getLanguages.mockResolvedValueOnce({ member: [] });
    themesService.getThemes.mockResolvedValueOnce({ member: [] });

    render(<ThemeTranslationPanel />);

    expect(await screen.findByText("Aéroport")).toBeInTheDocument();
    expect(screen.getByText("Français")).toBeInTheDocument();
    expect(screen.getByText("AIRPORT")).toBeInTheDocument();
  });

  it("creates a new translation", async () => {
    translationsService.getThemeTranslations.mockResolvedValueOnce({ member: [] });
    languagesService.getLanguages.mockResolvedValueOnce({
      member: [{ id: 1, label: "English" }],
    });
    themesService.getThemes.mockResolvedValueOnce({
      member: [{ id: 2, code: "RESTAURANT" }],
    });

    translationsService.createThemeTranslation.mockResolvedValueOnce({
      id: 2,
      label: "Restaurant",
      theme: { code: "RESTAURANT" },
      language: { label: "English" },
    });

    render(<ThemeTranslationPanel />);

    fireEvent.click(await screen.findByRole("button", { name: /new theme translation/i }));

    fireEvent.change(screen.getByPlaceholderText(/select a theme/i), {
      target: { name: "theme", value: "/api/themes/2" },
    });
    fireEvent.change(screen.getByPlaceholderText(/select a language/i), {
      target: { name: "language", value: "/api/languages/1" },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter translated label/i), {
      target: { name: "label", value: "Restaurant" },
    });

    fireEvent.click(screen.getByRole("button", { name: /create/i }));

    await waitFor(() => {
      expect(translationsService.createThemeTranslation).toHaveBeenCalledWith({
        label: "Restaurant",
        language: "/api/languages/1",
        theme: "/api/themes/2",
      });
    });
  });

  it("edits a translation", async () => {
    translationsService.getThemeTranslations.mockResolvedValueOnce({
      member: [
        {
          id: 3,
          label: "Hotel",
          language: { label: "EN", "@id": "/api/languages/1" },
          theme: { code: "HOTEL", "@id": "/api/themes/1" },
        },
      ],
    });
    languagesService.getLanguages.mockResolvedValueOnce({ member: [{ id: 1, label: "EN" }] });
    themesService.getThemes.mockResolvedValueOnce({ member: [{ id: 1, code: "HOTEL" }] });

    translationsService.updateThemeTranslation.mockResolvedValueOnce({
      id: 3,
      label: "Hotel FR",
      language: { label: "EN" },
      theme: { code: "HOTEL" },
    });

    render(<ThemeTranslationPanel />);

    fireEvent.click(await screen.findByText("Edit"));
    fireEvent.change(screen.getByPlaceholderText(/enter translated label/i), {
      target: { name: "label", value: "Hotel FR" },
    });
    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(translationsService.updateThemeTranslation).toHaveBeenCalledWith(3, {
        label: "Hotel FR",
        language: "/api/languages/1",
        theme: "/api/themes/1",
      });
    });
  });

  it("deletes a translation", async () => {
    translationsService.getThemeTranslations.mockResolvedValueOnce({
      member: [
        {
          id: 4,
          label: "Market",
          language: { label: "EN" },
          theme: { code: "MARKET" },
        },
      ],
    });
    languagesService.getLanguages.mockResolvedValueOnce({ member: [] });
    themesService.getThemes.mockResolvedValueOnce({ member: [] });

    translationsService.deleteThemeTranslation.mockResolvedValueOnce();

    render(<ThemeTranslationPanel />);

    fireEvent.click(await screen.findByText("Delete"));
    fireEvent.click(await screen.findByRole("button", { name: /delete/i }));

    await waitFor(() => {
      expect(translationsService.deleteThemeTranslation).toHaveBeenCalledWith(4);
    });
  });
});