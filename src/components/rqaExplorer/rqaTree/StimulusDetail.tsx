import { Stimulus } from "../../../models/rqa/definition/stimulus/Stimulus";

interface StimulusProps {
	stimulus?: Stimulus | null;
}

export function StimulusDetail({ stimulus }: StimulusProps) {
	return (
		<details>
			<summary>
				<span>Stimulus</span>
			</summary>
			<ul>
				<li>
					<span>
						Accuracy: {stimulus?.accuracy != null ? stimulus.accuracy : 'undefined'}
					</span>
				</li>
				<li>
					<span>
						Workload Type: {stimulus?.workload?.type != null ? stimulus.workload.type : 'undefined'}
					</span>
					{/* TODO implement stimulus details */}
				</li>
			</ul>
		</details>
	);
}
