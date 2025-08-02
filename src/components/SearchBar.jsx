export default function SearchInput({ value, onChange, placeholder = "Search..." }) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      className="w-full px-4 py-3 rounded-xl border border-transparent focus:outline-none hover:border-pink-400 focus:ring-1 focus:ring-pink-400 bg-white/40 shadow-xl transition"
      value={value}
      onChange={onChange}
    />
  );
}