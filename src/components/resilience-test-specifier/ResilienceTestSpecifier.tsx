import { ChangeEvent, useEffect, useState } from "react";
import { InputSelect } from "../input/InputSelect";
import { InputSlider } from "../input/InputSlider";
import { InputRadio } from "../input/InputRadio";
import { DropdownLeft } from "../DropdownLeft";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addResilienceTestToRqa } from "../../queries/rqa";
import { DomainStory } from "../../models/dam/domainstory/DomainStory";
import { RuntimeQualityAnalysisDefinition } from "../../models/rqa/definition/RuntimeQualityAnalysisDefinition";
import { getActivitiesForSystem, getSystemsFromDomainStory } from "../../utils/dam.utils";
import { validateObject } from "../../utils/rqa.utils";
import { ResilienceTestDefinition } from "../../models/rqa/definition/resiliencetest/ResilienceTestDefinition";
import { Edge } from "reactflow";
import resiliencetestSpecs from "../../data/resiliencetest-specs.json";


interface ResilienceTestSpecifierProps {
	domain: DomainStory;
	rqas: RuntimeQualityAnalysisDefinition[];
	selectedEdge?: Edge | null;
}

export function ResilienceTestSpecifier({ domain, rqas, selectedEdge }: ResilienceTestSpecifierProps) {

	const queryClient = useQueryClient();

	const [resilienceTest, setResilienceTest] = useState<ResilienceTestDefinition>({
		name: "ResilienceTest " + (new Date()).toLocaleString(),
		description: "ResilienceTestDescription",
		artifact: {
			system_id: null,
			activity_id: null,
		},
		stimulus: {
			accuracy: 0,
			//type: null,
		},
		response_measure: {
			recovery_time: null as any,
		},
	});

	const [showSubmitBtn, setShowSubmitBtn] = useState<boolean>();

	// Set System and Actvitivity, when selected edge changes
	useEffect(() => {
		if (domain && selectedEdge) {
			const activityId = selectedEdge.id;
			const systemId = selectedEdge.target;
			if (!activityId || !systemId) return;
			setResilienceTest(prev => {
				return {
					...prev,
					artifact: {
						activity_id: activityId,
						system_id: systemId,
					}
				}
			});
		}
	}, [selectedEdge, domain]);

	useEffect(() => {
		setShowSubmitBtn(validateObject(resilienceTest));
	}, [resilienceTest]);

	const addToRqa = (rqaId: string) => {
		/* const resilienceTestCfg = {
			"name": "Example Resilience Test",
			"system": "MyComputer",
			"accuracy": 100,
			"stimulus_type": "UNAVAILABILITY",
			"recovery_time": "TOLERATED"
		} */
		/* const resilienceTestCfg: ResilienceTestDefinition = {
			name: "ResilienceTest_2",
			description: "ResilienceTestDescription",
			artifact: {
				system_id: 'MyComputer',
				//activity_id: '65b757d3fe8ea0685691096f',
			},
			stimulus: {
				accuracy: 80,
				type: 'UNAVAILABILITY',
			},
			response_measure: {
				recovery_time: 'SATISFIED' as any,
			},
		} */
		rqaMutation.mutate({ rqaId, resilienceTest: resilienceTest });
	};

	const rqaMutation = useMutation({
		mutationFn: addResilienceTestToRqa,
		onSuccess: (data) => {
			//queryClient.setQueryData(["rqas", data.id], data);
			queryClient.invalidateQueries(["rqas"]);
		},
	});

	const handleChange = (ev: ChangeEvent<HTMLInputElement | HTMLSelectElement>, data?: any) => {
		setResilienceTest(prev => {
			const { name, type } = ev.target;
			const nextState = { ...prev };
			let currentObj: any = nextState;
			const keys = name.split('.');

			for (let i = 0; i < keys.length - 1; i++) {
				const key = keys[i];
				if (!currentObj[key]) {
					currentObj[key] = {};
				}
				currentObj = currentObj[key];
			}
			const lastKey = keys[keys.length - 1];

			if (type === 'checkbox') {
				currentObj[lastKey] = (ev.target as HTMLInputElement).checked ? [...currentObj[lastKey], data] : currentObj[lastKey].filter((val: any) => val !== data);
			} else {
				currentObj[lastKey] = data;
			}

			return nextState;
		});
	};

	return (
		<div className="p-4 prose h-full overflow-auto bg-slate-200 ">
			<h3>Resilience Test Specification</h3>
			<h4>Domain Story Item</h4>
			<InputSelect
				label={"System"}
				name={"artifact.system_id"}
				value={resilienceTest.artifact?.system_id}
				options={getSystemsFromDomainStory(domain)}
				optionName={"name"}
				optionValue={"_id"}
				onChange={handleChange}
			/>
			<InputSelect
				label={"Activity"}
				name={"artifact.activity_id"}
				value={resilienceTest.artifact?.activity_id}
				options={getActivitiesForSystem(domain, resilienceTest.artifact?.system_id)}
				optionName={"action"}
				optionValue={"_id"}
				onChange={handleChange}
			/>
			<div className="divider" />
			<h3>Stimulus</h3>
			<InputSelect
				label={"Stimulus"}
				name={"stimulus.type"}
				value={'type' in resilienceTest.stimulus && resilienceTest.stimulus.type}
				options={resiliencetestSpecs.stimulus_types.options}
				optionName={"name"}
				optionValue={"value"}
				onChange={handleChange}
			/>
			<InputSlider
				label={"Accuracy"}
				name={"stimulus.accuracy"}
				value={resilienceTest.stimulus?.accuracy}
				onChange={handleChange}
			/>
			<div className="divider" />
			<h3>Response Measures</h3>
			{resiliencetestSpecs.response_measures.map(responseMeasure => {
				return (
					<InputRadio
						key={responseMeasure.type}
						label={responseMeasure.name}
						name={"response_measure.recovery_time"}
						value={resilienceTest.response_measure}
						options={responseMeasure.options}
						optionName={"name"}
						optionValue={"value"}
						onChange={handleChange}
					/>
				);
			})}
			<div className="divider" />
			{showSubmitBtn && <DropdownLeft rqas={rqas} onClick={addToRqa} />}
		</div>
	);
}
