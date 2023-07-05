import React, { useState } from "react";
import { toHumanCasing } from "../../../utils/formatting";

export default function ResultMetrics({ data }) {
  const [expand, setExpand] = useState(false);

  let formattedData = [];
  data.forEach((metric) => {
    formattedData.push(toHumanCasing(metric));
  });

  console.log(formattedData);
  return (
    <details>
      <summary>
        <span>Result Metrics</span>
      </summary>
      <ul>
        {formattedData.map((metric) => {
          return (
            <li>
              <span>{metric}</span>
            </li>
          );
        })}
      </ul>
    </details>
  );
}
