import BlackButton from "./BlackButton"
import PinkButton from "./PinkButton"

export default function AdminModal({
  title,
  fields,
  form,
  onChange,
  onClose,
  onSubmit,
  submitLabel = "Save",
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white backdrop-blur-md p-8 rounded-3xl w-full max-w-md shadow-xl">
        <h4 className="text-2xl font-black text-center mb-6 text-gray-800">
          {title}
        </h4>

        {fields.map((field) => (
          <div key={field.name} className="mb-4">
            {field.type === "checkbox" ? (
              <div className="inline-flex items-center mt-2">
                <input
                  type="checkbox"
                  id={field.name} 
                  name={field.name}
                  checked={form[field.name]}
                  onChange={onChange}
                  className="mr-2"
                  placeholder={field.placeholder || field.label || ""}
                />
                <label
                  htmlFor={field.name}
                  className="text-gray-700 cursor-pointer"
                >
                  {field.checkboxLabel}
                </label>
              </div>
            ) : (
              <>
                <label className="block mb-2 font-medium text-gray-700">
                  {field.label}
                </label>
                {field.type === "select" ? (
                  <select
                    name={field.name}
                    value={form[field.name]}
                    onChange={onChange}
                    className="w-full p-3 border border-pink-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 cursor-pointer"
                    placeholder={field.placeholder || field.label || ""}
                  >
                    <option value="">—</option>
                    {field.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type || "text"}
                    name={field.name}
                    value={form[field.name]}
                    onChange={onChange}
                    placeholder={field.placeholder || field.label || ""}
                    className="w-full p-3 border border-pink-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400"
                  />
                )}
              </>
            )}
          </div>
        ))}

        <div className="flex justify-end gap-2 mt-6">
        <BlackButton
          paddingX={4}
          paddingY={2}
          onClick={onClose}
          label={"Cancel"}
        />
        <PinkButton
          paddingX={4}
          paddingY={2}
          onClick={onSubmit}
          label={submitLabel}
        />
        </div>
      </div>
    </div>
  );
}
