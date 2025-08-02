// src/components/ThemeProgressCard.jsx
export default function ThemeProgressCard({
  labelInterface,
  labelTarget,
  progress,
  onClick,
  progressLabel = "completed",
}) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-white/40 backdrop-blur-md p-6 rounded-3xl shadow-xl flex flex-col justify-between hover:scale-[1.01] transition"
    >
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-1">
          {labelInterface}
        </h3>
        <p className="text-gray-600 mb-4 italic">{labelTarget}</p>
      </div>
      <div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden mb-2">
          <div
            className="bg-pink-500 h-full transition-all duration-500 ease-in-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-800 text-right font-semibold">
          {progress}% {progressLabel}
        </p>
      </div>
    </div>
  );
}