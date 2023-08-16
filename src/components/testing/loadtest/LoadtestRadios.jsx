import React from "react";
import { toSnakeCase } from "../../../utils/formatting";

export default function LoadtestRadios({
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
      <div className="join">
        {options.map((option, key) => {
          return (
            <input
              key={key}
              className="join-item btn"
              type="radio"
              name={toSnakeCase(optionName)}
              aria-label={option.name}
              value={option.id}
              onChange={onChange}
            />
          );
        })}
      </div>
    </div>
  );
}
