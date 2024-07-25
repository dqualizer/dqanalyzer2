import type { Parametrization } from "@/types/rqa/definition/loadtest/parametrization/Parametrization";
import { changeCasing } from "@/utils/formatting";

interface ParametrizationDetailProps {
  parametrization?: Parametrization | null;
}

export default function ParametrizationDetail({
  parametrization,
}: ParametrizationDetailProps) {
  const formattedData = changeCasing(parametrization, true, false);

  return (
    <details>
      <summary>
        <span>Parametrization</span>
      </summary>
      <ul>
        {/* {Object.keys(formattedData).map((param, i) => {
					return (
						<li key={i}>
							<details>
								<summary>
									<span>{param}</span>
								</summary>
								<ul>
									<li>Not Implemented yet!!</li>
									{formattedData[param]?.map((object) => {
                    return (
                      <li>
                        <span>
                          {object.key}: {object.value}
                        </span>
                      </li>
                    );
                  })}
								</ul>
							</details>
						</li>
					);
				})} */}
      </ul>
    </details>
  );
}
