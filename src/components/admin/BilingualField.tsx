interface BilingualFieldProps {
  label: string;
  nameEn: string;
  nameCn: string;
  defaultValueEn?: string;
  defaultValueCn?: string;
  type?: "text" | "textarea";
  required?: boolean;
}

export function BilingualField({
  label,
  nameEn,
  nameCn,
  defaultValueEn,
  defaultValueCn,
  type = "text",
  required = false,
}: BilingualFieldProps) {
  const baseClass =
    "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm";

  const Input = type === "textarea" ? "textarea" : "input";
  const extraProps = type === "textarea" ? { rows: 3 } : {};

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <span className="text-xs text-gray-500 mb-1 block">English</span>
          <Input
            name={nameEn}
            defaultValue={defaultValueEn}
            required={required}
            className={baseClass}
            {...extraProps}
          />
        </div>
        <div>
          <span className="text-xs text-gray-500 mb-1 block">中文</span>
          <Input
            name={nameCn}
            defaultValue={defaultValueCn}
            required={required}
            className={baseClass}
            {...extraProps}
          />
        </div>
      </div>
    </div>
  );
}
