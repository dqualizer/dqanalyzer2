import React, { useState } from "react";
import { changeCasing } from "../../utils/formatting";

export default function ResponseMeasures({ data }) {
  const [expand, setExpand] = useState(false);
  let formattedData = changeCasing(data, true, true);
  console.log(formattedData);
  return (
    <details>
      <summary>
        <span onClick={() => setExpand(true)}>Response Measures</span>
      </summary>
      <ul>
        {Object.keys(formattedData).map((key, i) => {
          return (
            <div>
              <span>
                {key}: {formattedData[key]}
              </span>
            </div>
          );
        })}
      </ul>
    </details>
  );
}
