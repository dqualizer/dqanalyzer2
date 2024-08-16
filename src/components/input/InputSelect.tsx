import type { ChangeEvent, ReactNode } from "react";

interface InputSelectProps<T> {
  label: string;
  name?: string;
  value: any;
  options: T[];
  optionName: keyof T;
  optionValue?: keyof T;
  onChange: (e: ChangeEvent<HTMLSelectElement>, selectedOption: string) => void;
}

export function InputSelect<T>({
  label,
  name,
  value,
  options,
  optionName,
  optionValue,
  onChange,
}: InputSelectProps<T>) {
  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <select
        value={value || ""}
        name={name}
        onChange={(e) => onChange(e, e.target.value)}
        className="select select-bordered"
      >
        <option value="" disabled>
          Choose a {label}
        </option>
        {options.map((option, i) => (
          <option
            value={optionValue ? option[optionValue] : (option as any)}
            key={i}
          >
            {option[optionName] as ReactNode}
          </option>
        ))}
      </select>
    </div>
  );
}
