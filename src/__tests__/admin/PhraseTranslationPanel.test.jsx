import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PhraseTranslationPanel from "@/features/admin/PhraseTranslationPanel";
import * as phraseTranslationsService from "@/services/phraseTranslationsService";
import * as phrasesService from "@/services/phrasesService";
import * as languagesService from "@/services/languagesService";
import { vi } from "vitest";

vi.mock("@/services/phraseTranslationsService");
vi.mock("@/services/phrasesService");
vi.mock("@/services/languagesService");

describe("PhraseTranslationPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders table with fetched data", async () => {
    phraseTranslationsService.getPhraseTranslations.mockResolvedValueOnce({
      member: [
        {
          id: 1,
          text: "Bonjour",
          phrase: { code: "HELLO" },
          language: { label: "Français" },
        },
      ],
    });

    phrasesService.getPhrases.mockResolvedValueOnce({ member: [] });
    languagesService.getLanguages.mockResolvedValueOnce({ member: [] });

    render(<PhraseTranslationPanel />);

    expect(await screen.findByText("Bonjour")).toBeInTheDocument();
    expect(screen.getByText("HELLO")).toBeInTheDocument();
    expect(screen.getByText("Français")).toBeInTheDocument();
  });

  it("creates a new translation", async () => {
    phraseTranslationsService.getPhraseTranslations.mockResolvedValueOnce({
      member: [],
    });
    phrasesService.getPhrases.mockResolvedValueOnce({
      member: [{ id: 1, code: "HELLO" }],
    });
    languagesService.getLanguages.mockResolvedValueOnce({
      member: [{ id: 2, label: "English" }],
    });

    phraseTranslationsService.createPhraseTranslation.mockResolvedValueOnce({
      id: 2,
      text: "Hello",
      phrase: { code: "HELLO", "@id": "/api/phrases/1" },
      language: { label: "English", "@id": "/api/languages/2" },
    });

    render(<PhraseTranslationPanel />);

    fireEvent.click(
      await screen.findByRole("button", { name: /new phrase translation/i })
    );

    fireEvent.change(screen.getByPlaceholderText(/select a phrase/i), {
      target: { name: "phrase", value: "/api/phrases/1" },
    });

    fireEvent.change(screen.getByPlaceholderText(/select a language/i), {
      target: { name: "language", value: "/api/languages/2" },
    });

    fireEvent.change(screen.getByPlaceholderText(/enter translated text/i), {
      target: { name: "text", value: "Hello" },
    });

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(
        phraseTranslationsService.createPhraseTranslation
      ).toHaveBeenCalledWith({
        phrase: "/api/phrases/1",
        language: "/api/languages/2",
        text: "Hello",
      });
    });
  });

  it("edits a translation", async () => {
    phraseTranslationsService.getPhraseTranslations.mockResolvedValueOnce({
      member: [
        {
          id: 3,
          text: "Merci",
          phrase: { "@id": "/api/phrases/2", code: "THANKS" },
          language: { "@id": "/api/languages/1", label: "Français" },
        },
      ],
    });

    phrasesService.getPhrases.mockResolvedValueOnce([
      { id: 2, code: "THANKS" },
    ]);
    languagesService.getLanguages.mockResolvedValueOnce([
      { id: 1, label: "Français" },
    ]);

    phraseTranslationsService.updatePhraseTranslation.mockResolvedValueOnce({
      id: 3,
      text: "Thanks",
      phrase: { "@id": "/api/phrases/2", code: "THANKS" },
      language: { "@id": "/api/languages/1", label: "Français" },
    });

    render(<PhraseTranslationPanel />);

    fireEvent.click(await screen.findByText("Edit"));

    fireEvent.change(screen.getByPlaceholderText(/enter translated text/i), {
      target: { name: "text", value: "Thanks" },
    });

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(
        phraseTranslationsService.updatePhraseTranslation
      ).toHaveBeenCalledWith(3, {
        text: "Thanks",
        phrase: "/api/phrases/2",
        language: "/api/languages/1",
      });
    });
  });

  it("deletes a translation", async () => {
    phraseTranslationsService.getPhraseTranslations.mockResolvedValueOnce({
      member: [
        {
          id: 4,
          text: "Goodbye",
          phrase: { code: "BYE" },
          language: { label: "English" },
        },
      ],
    });

    phrasesService.getPhrases.mockResolvedValueOnce([]);
    languagesService.getLanguages.mockResolvedValueOnce([]);
    phraseTranslationsService.deletePhraseTranslation.mockResolvedValueOnce();

    render(<PhraseTranslationPanel />);

    fireEvent.click(await screen.findByText("Delete"));
    fireEvent.click(await screen.findByRole("button", { name: /delete/i }));

    await waitFor(() => {
      expect(
        phraseTranslationsService.deletePhraseTranslation
      ).toHaveBeenCalledWith(4);
    });
  });
});
