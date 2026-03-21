interface FormFieldProps {
  label: string;
  name: string;
  type?: "text" | "email" | "textarea" | "number" | "select";
  defaultValue?: string | number;
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
}

export function FormField({
  label,
  name,
  type = "text",
  defaultValue,
  placeholder,
  required = false,
  options,
}: FormFieldProps) {
  const baseClass =
    "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm";

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {type === "textarea" ? (
        <textarea
          id={name}
          name={name}
          defaultValue={defaultValue}
          placeholder={placeholder}
          required={required}
          rows={4}
          className={baseClass}
        />
      ) : type === "select" ? (
        <select
          id={name}
          name={name}
          defaultValue={defaultValue}
          required={required}
          className={baseClass}
        >
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          defaultValue={defaultValue}
          placeholder={placeholder}
          required={required}
          className={baseClass}
        />
      )}
    </div>
  );
}
