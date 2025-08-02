import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LanguagePanel from "@/features/admin/LanguagePanel";
import * as languagesService from "@/services/languagesService";
import { vi } from "vitest";

vi.mock("@/services/languagesService");

describe("LanguagePanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders languages table", async () => {
    languagesService.getLanguages.mockResolvedValueOnce({
      member: [
        {
          id: 1,
          code: "en",
          label: "English",
          iconUrl: "https://icon.png",
          isActive: true,
        },
      ],
    });

    render(<LanguagePanel />);
    
    expect(await screen.findByText("English")).toBeInTheDocument();
    expect(screen.getByText("en")).toBeInTheDocument();
  });

  it("opens create modal and submits new language", async () => {
    languagesService.getLanguages.mockResolvedValueOnce({ member: [] });
    languagesService.createLanguage.mockResolvedValueOnce({
      id: 2,
      code: "fr",
      label: "Français",
      iconUrl: "",
      isActive: true,
    });

    render(<LanguagePanel />);

    fireEvent.click(await screen.findByRole("button", { name: /new language/i }));

    fireEvent.change(screen.getByPlaceholderText(/ex: en, fr/i), {
      target: { name: "code", value: "fr" },
    });
    fireEvent.change(screen.getByPlaceholderText(/english, français/i), {
      target: { name: "label", value: "Français" },
    });
    fireEvent.click(screen.getByRole("button", { name: /create/i }));

    await waitFor(() => {
      expect(languagesService.createLanguage).toHaveBeenCalledWith({
        code: "fr",
        label: "Français",
        iconUrl: "",
        isActive: true,
      });
    });
  });

  it("opens edit modal and updates language", async () => {
    languagesService.getLanguages.mockResolvedValueOnce({
      member: [
        {
          id: 3,
          code: "es",
          label: "Español",
          iconUrl: "",
          isActive: true,
        },
      ],
    });
    languagesService.updateLanguage.mockResolvedValueOnce({
      id: 3,
      code: "es",
      label: "Espagnol",
      iconUrl: "",
      isActive: true,
    });

    render(<LanguagePanel />);

    fireEvent.click(await screen.findByText("Edit"));
    fireEvent.change(screen.getByPlaceholderText(/english, français/i), {
      target: { name: "label", value: "Espagnol" },
    });
    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(languagesService.updateLanguage).toHaveBeenCalledWith(3, {
        code: "es",
        label: "Espagnol",
        iconUrl: "",
        isActive: true,
      });
    });
  });

  it("deletes a language", async () => {
    languagesService.getLanguages.mockResolvedValueOnce({
      member: [
        {
          id: 4,
          code: "de",
          label: "Deutsch",
          iconUrl: "",
          isActive: true,
        },
      ],
    });
    languagesService.deleteLanguage.mockResolvedValueOnce();

    render(<LanguagePanel />);

    fireEvent.click(await screen.findByText("Delete"));

    await waitFor(() => {
      expect(languagesService.deleteLanguage).toHaveBeenCalledWith(4);
    });
  });
});