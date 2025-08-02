export default function WhiteButton({ onClick, label, paddingX , paddingY, marginBottom}) {
  return (
    <button
      onClick={onClick}
      className={`px-${paddingX} py-${paddingY} mb-${marginBottom} bg-white/40 hover:bg-white/60 rounded-lg font-medium shadow-md backdrop-blur-md transition cursor-pointer`}
    >
      {label}
    </button>
  );
}
