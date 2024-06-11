// @ts-nocheck
import { useState } from "react";
import type { Parametrization } from "../../../../../src/types/rqa/definition/loadtest/parametrization/Parametrization";
import { changeCasing } from "../../../utils/formatting";

interface ParametrizationDetailProps {
	parametrization?: Parametrization | null;
}

export function ParametrizationDetail({
	parametrization,
}: ParametrizationDetailProps) {
	const [expand, setExpand] = useState(false);
	const [expandKeys, setExpandKeys] = useState({});

	// Convert path_variables, request_body...

	const formattedData = changeCasing(parametrization, true, false);

	const handleExpandKeys = (Param) => {
		setExpandKeys((prevState) => {
			const updatedParams = { ...prevState };
			updatedParams[Param] = !prevState[Param] || false;
			return updatedParams;
		});
	};

	return (
		<details>
			<summary>
				<span>Parametrization</span>
			</summary>
			<ul>
				{Object.keys(formattedData).map((param, i) => {
					return (
						<li key={i}>
							<details>
								<summary>
									<span>{param}</span>
								</summary>
								<ul>
									<li>Not Implemented yet!!</li>
									{/* {formattedData[param]?.map((object) => {
                    return (
                      <li>
                        <span>
                          {object.key}: {object.value}
                        </span>
                      </li>
                    );
                  })} */}
								</ul>
							</details>
						</li>
					);
				})}
			</ul>
		</details>
	);
}
