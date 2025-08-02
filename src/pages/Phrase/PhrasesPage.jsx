// import Navbar from "@/components/Navbar";
// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { getPhrasesByTheme } from "@/services/phrasesService";
// import { useAuth } from "@/contexts/AuthContext";
// import {
//   unmarkTranslationAsLearn,
//   markTranslationAsLearn,
// } from "@/services/phraseTranslationsService";

// export default function PhrasesPage() {
//   const { id } = useParams();
//   const { user } = useAuth();

//   const [phrases, setPhrases] = useState([]);
//   const [selected, setSelected] = useState(null);
//   const [themeLabel, setThemeLabel] = useState("Theme");
//   const [showTranslation, setShowTranslation] = useState(false);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchPhrases = async () => {
//       try {
//         const response = await getPhrasesByTheme(id);
//         setPhrases(response);
//         if (response.length > 0) {
//           setThemeLabel(response[0].theme_label || "Theme");
//           setSelected(response[0]);
//         }
//       } catch (err) {
//         console.error("Error fetching phrases:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchPhrases();
//   }, [id]);

//   const unmarkTranslation = async () => {
//     try {
//       await unmarkTranslationAsLearn(selected.progress_id);
//     } catch (error) {
//       console.error("❌ Failed to unmark learned translation:", error);
//     }
//   };

//   const markTranslation = async () => {
//     try {
//       await markTranslationAsLearn({
//         user: `/api/users/${user.id}`,
//         phraseTranslation: `/api/phrase_translations/${selected.phrase_translation_id}`,
//       });
//     } catch (error) {
//       console.error("❌ Failed to mark learned translation:", error);
//     }
//   };

//   return (
//     <div>
//       <Navbar />
//       <div className="flex">
//         {/* Main content */}
//         <div className="w-full">
//           <main className="p-10">
//             <div className="text-center mb-6">
//               <h2 className="text-4xl font-extrabold text-gray-800">
//                 {selected?.theme_translations_interface || themeLabel}
//               </h2>
//               <p className="text-md text-pink-700 italic">
//                 {selected?.theme_translations_target || ""}
//               </p>
//             </div>

//             {!selected ? (
//               <p className="text-lg text-center text-gray-600">
//                 Select a phrase to view details
//               </p>
//             ) : (
//               <div className="bg-white/40 backdrop-blur-md p-8 rounded-3xl shadow-xl max-w-2xl mx-auto min-h-[250px] flex flex-col items-center justify-between">
//                 <p className="text-xl text-gray-800 font-semibold mb-6 text-center">
//                   {selected.interface_text || "—"}
//                 </p>

//                 <div className="relative w-full max-w-xs h-16 mb-6 flex items-center justify-center">
//                   <p
//                     className={`text-lg font-bold text-pink-500 text-center transition ${
//                       !showTranslation ? "blur-sm" : ""
//                     }`}
//                   >
//                     {selected.target_text || "No translation available"}
//                   </p>
//                   {!showTranslation && (
//                     <button
//                       onClick={() => setShowTranslation(true)}
//                       className="absolute inset-0 flex items-center justify-center border border-pink-400 hover:border-2 backdrop-blur-md text-pink-500 font-semibold rounded-xl cursor-pointer"
//                     >
//                       Reveal
//                     </button>
//                   )}
//                 </div>

//                 <button
//                   onClick={async () => {
//                     if (selected.is_known) {
//                       await unmarkTranslation();
//                       setPhrases((prev) =>
//                         prev.map((p) =>
//                           p.phrase_id === selected.phrase_id
//                             ? { ...p, is_known: false, progress_id: null }
//                             : p
//                         )
//                       );
//                       setSelected((prev) => ({
//                         ...prev,
//                         is_known: false,
//                         progress_id: null,
//                       }));
//                     } else {
//                       await markTranslation();
//                       setPhrases((prev) =>
//                         prev.map((p) =>
//                           p.phrase_id === selected.phrase_id
//                             ? { ...p, is_known: true }
//                             : p
//                         )
//                       );
//                       setSelected((prev) => ({ ...prev, is_known: true }));
//                     }
//                   }}
//                   className="px-4 py-2 bg-pink-400 hover:bg-pink-500 text-white font-semibold rounded-xl shadow cursor-pointer"
//                 >
//                   {selected.is_known
//                     ? "Unmark as learned ❌"
//                     : "Mark as learned ✅"}
//                 </button>

//                 <div className="mt-6 space-y-4 flex flex-col border-t border-pink-400 pt-6 overflow-y-auto max-h-[40vh] min-w-[80%] pr-4">
//                   {phrases.map((item) => (
//                     <button
//                       key={item.phrase_id}
//                       onClick={() => {
//                         setSelected(item);
//                         setShowTranslation(false);
//                       }}
//                       className={`text-left px-4 py-2 rounded-xl transition font-medium ${
//                         selected?.phrase_id === item.phrase_id
//                           ? "bg-pink-400 text-white"
//                           : "hover:bg-pink-400/10 cursor-pointer"
//                       }`}
//                     >
//                       <span className="flex justify-between items-center w-full">
//                         <span>{item.interface_text || "—"}</span>
//                         {item.is_known ? <span>✅</span> : null}
//                       </span>
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </main>
//         </div>
//       </div>
//     </div>
//   );
// }

import Navbar from "@/components/Navbar";
import { useParams } from "react-router-dom";
import PhrasesLogic from "@/features/phrase/logic/PhrasesLogic";
import PhraseCard from "@/features/phrase/PhraseCard";

export default function PhrasesPage() {
  const { id } = useParams();

  const {
    phrases,
    selected,
    setSelected,
    setPhrases,
    themeLabel,
    loading,
    showTranslation,
    setShowTranslation,
    markTranslation,
    unmarkTranslation,
  } = PhrasesLogic(id);

  if (loading) return <p>Loading…</p>;

  return (
    <div>
      <Navbar />
      <div className="flex">
        <div className="w-full">
          <main className="p-10">
            <div className="text-center mb-6">
              <h2 className="text-4xl font-extrabold text-gray-800">
                {selected?.theme_translations_interface || themeLabel}
              </h2>
              <p className="text-md text-pink-700 italic">
                {selected?.theme_translations_target || ""}
              </p>
            </div>

            <PhraseCard
              selected={selected}
              showTranslation={showTranslation}
              setShowTranslation={setShowTranslation}
              phrases={phrases}
              setPhrases={setPhrases}
              setSelected={setSelected}
              markTranslation={markTranslation}
              unmarkTranslation={unmarkTranslation}
            />
          </main>
        </div>
      </div>
    </div>
  );
}
