import type { Parametrization } from "@/types/rqa/definition/loadtest/parametrization/Parametrization";

interface ParametrizationDetailProps {
  parametrization?: Parametrization | null;
}

export default function ParametrizationDetail({
  parametrization,
}: ParametrizationDetailProps) {
  if (parametrization) {
    const { path_variables, url_parameter, request_parameter, payload } =
      parametrization;
    return (
      <details>
        <summary>
          <span>Parametrization</span>
        </summary>
        {path_variables !== undefined && path_variables !== null && (
          <details>
            <summary>
              <span>Path Variables</span>
            </summary>
            <ul>
              {Array.from(path_variables).map((path_variable) => {
                return (
                  <li key={path_variable.name}>
                    <span>
                      {path_variable.name}:{" "}
                      {JSON.stringify(path_variable.scenarios)}
                    </span>
                  </li>
                );
              })}
            </ul>
          </details>
        )}
        {url_parameter !== undefined && url_parameter !== null && (
          <details>
            <summary>
              <span>URL Parameters</span>
            </summary>
            <ul>
              {Array.from(url_parameter).map((url_parameter) => {
                return (
                  <li key={url_parameter.name}>
                    <span>
                      {url_parameter.name}:{" "}
                      {url_parameter.scenarios?.join(", ")}
                    </span>
                  </li>
                );
              })}
            </ul>
          </details>
        )}

        {request_parameter !== undefined && request_parameter !== null && (
          <details>
            <summary>
              <span>Request Parameters</span>
            </summary>
            {Array.from(request_parameter).map((request_parameter) => {
              return (
                <li key={request_parameter.name}>
                  <span>
                    {request_parameter.name}:{" "}
                    {request_parameter.scenarios?.join(", ")}
                  </span>
                </li>
              );
            })}
          </details>
        )}

        {payload !== undefined && payload !== null && (
          <details>
            <summary>
              <span>Payload</span>
            </summary>
            {payload.name}: {payload.scenarios?.join(", ")}
          </details>
        )}
      </details>
    );
  }
}
