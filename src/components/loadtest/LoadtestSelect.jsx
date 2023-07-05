import React from "react";
import { toSnakeCase } from "../../utils/formatting";

export default function LoadtestSelect({
  label,
  value,
  options,
  onChange,
  optionName,
  optionValue,
}) {
  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <select
        value={value}
        name={toSnakeCase(label)}
        onChange={onChange}
        className="select select-bordered"
      >
        <option value="" disabled>
          Choose a {label}
        </option>
        {options.length > 0 &&
          options.map((option) => {
            return (
              <option value={option[optionValue]}>{option[optionName]}</option>
            );
          })}
      </select>
    </div>
  );
}
