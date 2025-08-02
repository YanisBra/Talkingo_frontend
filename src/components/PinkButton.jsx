export default function WhiteButton({ onClick, label, paddingX , paddingY, marginBottom}) {
  return (
    <button
      onClick={onClick}
      className={`px-${paddingX} py-${paddingY} mb-${marginBottom} bg-pink-400 hover:bg-pink-500 text-white rounded-lg font-medium shadow-md shadow-pink-400/50 transition cursor-pointer`}
    >
      {label}
    </button>
  );
}
