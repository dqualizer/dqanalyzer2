import React, { useRef } from "react";
import Loadtest from "./Loadtest";

export default function Loadtests({ data, rqaId, loadtestSpecifier }) {
  const detailsRef = useRef();
  return (
    <details ref={detailsRef}>
      <summary>
        <span>Loadtests</span>
      </summary>
      <ul>
        {data.map((loadtest) => {
          return (
            <li>
              <Loadtest
                data={loadtest}
                parentMenuRef={detailsRef}
                rqaId={rqaId}
                loadtestSpecifier={loadtestSpecifier}
              />
            </li>
          );
        })}
      </ul>
    </details>
  );
}
