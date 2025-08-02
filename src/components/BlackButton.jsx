export default function BlackButton({ onClick, label, paddingX , paddingY }) {
  return (
    <button
      onClick={onClick}
      className={`px-${paddingX} py-${paddingY} bg-gray-800 hover:bg-gray-900  text-white rounded-lg font-medium shadow-md transition cursor-pointer`}
    >
      {label}
    </button>
  );
}
