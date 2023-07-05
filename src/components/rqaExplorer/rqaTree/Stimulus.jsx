import React, { useState } from "react";
import { changeCasing } from "../../../utils/formatting";

export default function Stimulus({ data }) {
  const [expand, setExpand] = useState(false);

  console.log(data);

  const formattedData = changeCasing(data, true, true);
  console.log(formattedData);

  return (
    <details>
      <summary>
        <span>Stimulus</span>
      </summary>
      <ul>
        {Object.keys(formattedData).map((key, i) => {
          return (
            <li key={i}>
              <span>
                {key}: {formattedData[key]}
              </span>
            </li>
          );
        })}
      </ul>
    </details>
  );
}
