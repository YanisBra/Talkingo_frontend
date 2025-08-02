import PinkButton from "./PinkButton";

export default function AdminTable({
  title,
  headers,
  rows,
  renderActions,
  onAdd,
  onRowClick,
  onBack,
}) {
  return (
    <div className="bg-white/40 backdrop-blur-md p-6 rounded-2xl shadow-md overflow-x-auto">
      <div className="mb-4">
        {onBack && (
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-xl shadow"
          >
            ← Back
          </button>
        )}
      </div>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <div className="mb-4 text-right">
        {onAdd && (
          <PinkButton
            paddingX={4}
            paddingY={2}
            onClick={onAdd}
            label={`+ New ${title.slice(0, -1)}`}
          />
        )}
      </div>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-pink-300 text-gray-700">
            {headers.map((header) => (
              <th key={header} className="p-2 font-semibold text-gray-700">
                {header}
              </th>
            ))}
            {renderActions && (
              <th className="p-2 font-semibold text-gray-700">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={index}
              onClick={() => onRowClick?.(row)}
              className="border-b border-gray-200 hover:bg-white/30 cursor-pointer"
            >
              {Object.values(row).map((value, i) => (
                <td key={i} className="p-2 text-gray-800">
                  {value}
                </td>
              ))}
              {renderActions && (
                <td className="p-2 text-gray-800">{renderActions(row)}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
