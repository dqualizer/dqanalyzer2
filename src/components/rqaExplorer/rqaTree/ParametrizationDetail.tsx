import { useState } from "react";
import { changeCasing } from "../../../utils/formatting";
import { Parametrization } from "../../../models/rqa/definition/loadtest/parametrization/Parametrization";

interface ParametrizationDetailProps {
	parametrization?: Parametrization | null;
}

export function ParametrizationDetail({ parametrization }: ParametrizationDetailProps) {
	const [expand, setExpand] = useState(false);
	const [expandKeys, setExpandKeys] = useState({});

	// Convert path_variables, request_body...

	let formattedData = changeCasing(parametrization, true, false);

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
