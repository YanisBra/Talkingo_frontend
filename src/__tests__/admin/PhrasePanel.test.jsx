import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PhrasePanel from "@/features/admin/PhrasePanel";
import * as phrasesService from "@/services/phrasesService";
import * as themesService from "@/services/themesService";
import { vi } from "vitest";

vi.mock("@/services/phrasesService");
vi.mock("@/services/themesService");

describe("PhrasePanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders table with fetched phrases and themes", async () => {
    phrasesService.getPhrases.mockResolvedValueOnce({
      member: [{ id: 1, code: "HELLO", theme: { code: "AIRPORT" } }],
    });
    themesService.getThemes.mockResolvedValueOnce({
      member: [{ id: 1, code: "AIRPORT" }],
    });

    render(<PhrasePanel />);

    expect(await screen.findByText("HELLO")).toBeInTheDocument();
    expect(screen.getByText("AIRPORT")).toBeInTheDocument();
  });

  it("creates a new phrase", async () => {
    phrasesService.getPhrases.mockResolvedValueOnce({ member: [] });
    themesService.getThemes.mockResolvedValueOnce({
      member: [{ id: 2, code: "RESTAURANT" }],
    });

    phrasesService.createPhrase.mockResolvedValueOnce({
      id: 2,
      code: "BONJOUR",
      theme: { "@id": "/api/themes/2", code: "RESTAURANT" },
    });

    render(<PhrasePanel />);

    fireEvent.click(await screen.findByRole("button", { name: /new phrase/i }));

    fireEvent.change(screen.getByPlaceholderText(/select a theme/i), {
      target: { name: "theme", value: "/api/themes/2" },
    });

    fireEvent.change(screen.getByPlaceholderText(/enter phrase code/i), {
      target: { name: "code", value: "BONJOUR" },
    });

    fireEvent.click(screen.getByRole("button", { name: /create/i }));

    await waitFor(() => {
      expect(phrasesService.createPhrase).toHaveBeenCalledWith("BONJOUR", "/api/themes/2");
    });
  });

  it("edits a phrase", async () => {
    phrasesService.getPhrases.mockResolvedValueOnce({
      member: [
        { id: 3, code: "THANKS", theme: { "@id": "/api/themes/1", code: "AIRPORT" } },
      ],
    });

    themesService.getThemes.mockResolvedValueOnce({
      member: [{ id: 1, code: "AIRPORT" }],
    });

    phrasesService.updatePhrase.mockResolvedValueOnce({
      id: 3,
      code: "MERCI",
      theme: { "@id": "/api/themes/1", code: "AIRPORT" },
    });

    render(<PhrasePanel />);

    fireEvent.click(await screen.findByText("Edit"));

    fireEvent.change(screen.getByPlaceholderText(/enter phrase code/i), {
      target: { name: "code", value: "MERCI" },
    });

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(phrasesService.updatePhrase).toHaveBeenCalledWith(3, {
        code: "MERCI",
        theme: "/api/themes/1",
      });
    });
  });

  it("deletes a phrase", async () => {
    phrasesService.getPhrases.mockResolvedValueOnce({
      member: [{ id: 4, code: "BYE", theme: { code: "AIRPORT" } }],
    });
    themesService.getThemes.mockResolvedValueOnce({
      member: [{ id: 1, code: "AIRPORT" }],
    });

    phrasesService.deletePhrase.mockResolvedValueOnce();

    render(<PhrasePanel />);

    fireEvent.click(await screen.findByText("Delete"));
    fireEvent.click(await screen.findByRole("button", { name: /delete/i }));

    await waitFor(() => {
      expect(phrasesService.deletePhrase).toHaveBeenCalledWith(4);
    });
  });
});