import { ChangeEvent } from "react";

interface InputNumberProps {
  label: string;
  name: string;
  value?: number;
  min?: number;
  onChange: (e: ChangeEvent<HTMLInputElement>, value: number) => void;
}

export function InputNumber({
  label,
  name,
  value,
  min,
  onChange,
}: InputNumberProps) {
  return (
    <label className="form-control w-full max-w-xs">
      <div className="label cursor-pointer">
        <span className="label-text">{label}</span>
      </div>
      <input
        type="number"
        className="input"
        name={name}
        value={value}
        min={min}
        onChange={(e) => onChange(e, +e.target.value)}
      />
    </label>
  );
}
