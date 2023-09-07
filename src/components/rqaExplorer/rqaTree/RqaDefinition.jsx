import React, { useState } from "react";
import Loadtests from "./Loadtests";
import axios from "axios";
export default function RqaDefinition({ data, loadtestSpecifier }) {
  console.log(data);
  const handleExecute = () => {
    // For now, we delete the (in the backend) unknown properties before sending
    let data_copy = data;
    delete data_copy.id;
    delete data_copy.domain_id;
    delete data_copy.name;
    // The other components call the system_id and activity_id "object" and "activity"
    data_copy.runtime_quality_analysis.loadtests.forEach((loadtest) => {
      delete loadtest.name;
      loadtest.artifact.object = loadtest.artifact.system_id;
      delete loadtest.artifact.system_id;
    });
    // only the context werkstattauftrag available, cause translator gets the context from file...
    // We could take the contextx from the loaded domain...
    data_copy.context = "werkstattauftrag";
    const call = axios
      .post(`http://localhost:8070/api/rqa`, data_copy)
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
