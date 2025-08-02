import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PhrasesPage from "@/pages/Phrase/PhrasesPage";
import { vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AuthContext } from "@/contexts/AuthContext";

const mockSetSelected = vi.fn();
const mockSetPhrases = vi.fn();
const mockMark = vi.fn();
const mockUnmark = vi.fn();

vi.mock("@/features/phrase/logic/PhrasesLogic", () => {
  return {
    default: () => ({
      phrases: [
        {
          phrase_id: 1,
          interface_text: "Hello",
          target_text: "Hola",
          is_known: false,
          progress_id: null,
          theme_label: "Greetings",
          theme_translations_interface: "Greetings",
          theme_translations_target: "Saludos",
        },
        {
          phrase_id: 2,
          interface_text: "Goodbye",
          target_text: "Adiós",
          is_known: true,
          progress_id: 42,
          theme_label: "Greetings",
          theme_translations_interface: "Greetings",
          theme_translations_target: "Saludos",
        },
      ],
      selected: {
        phrase_id: 1,
        interface_text: "Hello",
        target_text: "Hola",
        is_known: false,
        progress_id: null,
        theme_label: "Greetings",
        theme_translations_interface: "Greetings",
        theme_translations_target: "Saludos",
      },
      setSelected: mockSetSelected,
      setPhrases: mockSetPhrases,
      themeLabel: "Greetings",
      loading: false,
      markTranslation: mockMark,
      unmarkTranslation: mockUnmark,
      showTranslation: false,
      setShowTranslation: vi.fn(),
    }),
  };
});

describe("PhrasesPage", () => {
  const renderPage = () =>
    render(
      <AuthContext.Provider value={{ user: { id: 1, name: "Bob" } }}>
        <MemoryRouter initialEntries={["/theme/1"]}>
          <Routes>
            <Route path="/theme/:id" element={<PhrasesPage />} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    );

  it("displays the theme title and phrase list", () => {
    renderPage();

    expect(screen.getByText("Greetings")).toBeInTheDocument();
    expect(screen.getAllByText("Hello").length).toBeGreaterThan(0);
    expect(screen.getByText("Goodbye")).toBeInTheDocument();
    const button = screen.getByText("Mark as learned ✅");
    expect(button).toBeInTheDocument();
  });

  it("reveals translation when clicking on Reveal button", () => {
    renderPage();

    const revealButton = screen.getByText("Reveal");
    expect(revealButton).toBeInTheDocument();
    fireEvent.click(revealButton);
  });

  it("calls markTranslation when clicking mark as learned", async () => {
    renderPage();

    const button = screen.getByText("Mark as learned ✅");
    fireEvent.click(button);
    

    await waitFor(() => {
      expect(mockMark).toHaveBeenCalled();
      expect(mockSetPhrases).toHaveBeenCalled();
      expect(mockSetSelected).toHaveBeenCalled();
    });
  });

});
