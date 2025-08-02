import { useState } from "react";

export default function PhraseCard({
  phrases,
  selected,
  setSelected,
  setPhrases,
  markTranslation = () => {},
  unmarkTranslation = () => {},
}) {
  const [showTranslation, setShowTranslation] = useState(false);

  const handleToggleMark = async () => {
    if (selected.is_known) {
      await unmarkTranslation();
      setPhrases((prev) =>
        prev.map((p) =>
          p.phrase_id === selected.phrase_id
            ? { ...p, is_known: false, progress_id: null }
            : p
        )
      );
      setSelected((prev) => ({
        ...prev,
        is_known: false,
        progress_id: null,
      }));
    } else {
      await markTranslation();
      setPhrases((prev) =>
        prev.map((p) =>
          p.phrase_id === selected.phrase_id ? { ...p, is_known: true } : p
        )
      );
      setSelected((prev) => ({ ...prev, is_known: true }));
    }
  };

  if (!selected) return null;

  return (
    <div className="bg-white/40 backdrop-blur-md p-8 rounded-3xl shadow-xl max-w-2xl mx-auto min-h-[250px] flex flex-col items-center justify-between">
      <p className="text-xl text-gray-800 font-semibold mb-6 text-center">
        {selected.interface_text || "—"}
      </p>

      <div className="relative w-full max-w-xs h-16 mb-6 flex items-center justify-center">
        <p
          className={`text-lg font-bold text-pink-500 text-center transition ${
            !showTranslation ? "blur-sm" : ""
          }`}
        >
          {selected.target_text || "No translation available"}
        </p>
        {!showTranslation && (
          <button
            onClick={() => setShowTranslation(true)}
            className="absolute inset-0 flex items-center justify-center border border-pink-400 hover:border-2 backdrop-blur-md text-pink-500 font-semibold rounded-xl cursor-pointer"
          >
            Reveal
          </button>
        )}
      </div>

      <button
        onClick={handleToggleMark}
        className={`px-4 py-2 font-semibold rounded-xl shadow cursor-pointer ${
          selected.is_known
            ? "bg-white text-pink-600 border border-pink-400 hover:bg-pink-100"
            : "bg-pink-400 hover:bg-pink-500 text-white"
        }`}
      >
        {selected.is_known
          ? "Unmark as learned ❌"
          : "Mark as learned ✅"}
      </button>

      <div className="mt-6 space-y-4 flex flex-col border-t border-pink-400 pt-6 overflow-y-auto max-h-[40vh] min-w-[80%] pr-4">
        {phrases.map((item) => (
          <button
            key={item.phrase_id}
            onClick={() => {
              setSelected(item);
              setShowTranslation(false);
            }}
            className={`text-left px-4 py-2 rounded-xl transition font-medium ${
              selected?.phrase_id === item.phrase_id
                ? "bg-pink-400 text-white"
                : "hover:bg-pink-400/10 cursor-pointer"
            }`}
          >
            <span className="flex justify-between items-center w-full">
              <span>{item.interface_text || "—"}</span>
              {item.is_known ? <span>✅</span> : null}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}