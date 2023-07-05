import React, { useState } from "react";
import { toSnakeCase } from "../../utils/formatting";
export default function LoadtestCheck({ option, inputs, onChange }) {
  return (
    <div key={option.id} className="form-control w-full">
      <label className="label cursor-pointer">
        <span className="label-text">{option.label}</span>
        <input
          type="checkbox"
          className="checkbox"
          checked={inputs.result_metrics.includes(option.id)}
          onChange={onChange}
        />
      </label>
    </div>
  );
}
