import React from "react";
import Stimulus from "./Stimulus";
import Parametrization from "./Parametrization";
import ResponseMeasures from "./ResponseMeasures";
import ResultMetrics from "./ResultMetrics";

import DeleteButton from "./DeleteLoadtest";
import { deleteLoadtest } from "../../queries/rqa";
import DeleteLoadtest from "./DeleteLoadtest";
import EditLoadtest from "./EditLoadtest";
export default function Loadtest({
  data,
  parentMenuRef,
  rqaId,
  loadtestSpecifier,
}) {
  return (
    <details>
      <summary className="flex justify-between items-center">
        <span>{data.name}</span>
        <DeleteLoadtest
          data={data}
          rqaId={rqaId}
          parentMenuRef={parentMenuRef}
        />
        <EditLoadtest loadtestSpecifier={loadtestSpecifier} />
      </summary>
      <ul>
        <li>{<Stimulus data={data.stimulus} />}</li>
        <li>{<Parametrization data={data.parametrization} />}</li>
        <li>{<ResponseMeasures data={data.response_measures} />}</li>
        <li> {<ResultMetrics data={data.result_metrics} />}</li>
      </ul>
    </details>
  );
}
