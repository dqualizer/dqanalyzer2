import React, { useState } from "react";
import Loadtests from "./Loadtests";
import axios from "axios";
export default function RqaDefinition({ data, loadtestSpecifier }) {
  console.log(data);
  const handleExecute = () => {
    var data_copy = data; // The other components call the system_id and activity_id "object" and "activity"
    const call = axios
      .post(`http://localhost:8080/translate/${data_copy.id}`)
      .then((res) => console.log(res.data));
  };
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
        <button className="btn btn-sm btn-primary" onClick={handleExecute}>
          Execute
        </button>
      </li>
    </ul>
  );
}
