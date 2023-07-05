import React, { useState } from "react";
import Loadtests from "./Loadtests";
export default function RqaDefinition({ data, loadtestSpecifier }) {
  console.log(data);
  return (
    <ul>
      {Object.keys(data).map((key, index) => {
        if (typeof data[key] == "object") {
          return (
            <li>
              <Loadtests
                data={data.runtime_quality_analysis.loadtests}
                rqaId={data.id}
                loadtestSpecifier={loadtestSpecifier}
              />
            </li>
          );
        }
      })}
      <li>
        <details>
          <summary>Details</summary>
          <ul>
            {Object.keys(data).map((key, index) => {
              return (
                typeof data[key] == "string" &&
                key != "name" &&
                key != "id" && (
                  <li>
                    <span>
                      {key}: {data[key]}
                    </span>
                  </li>
                )
              );
            })}{" "}
          </ul>
        </details>
      </li>
      <li>
        <button className="btn btn-sm btn-primary">Execute</button>
      </li>
    </ul>
  );
}
