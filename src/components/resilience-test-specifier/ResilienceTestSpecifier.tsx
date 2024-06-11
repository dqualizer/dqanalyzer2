import { DropdownLeft } from "@/components/DropdownLeft";
import { InputNumber } from "@/components/input/InputNumber";
import { InputRadio } from "@/components/input/InputRadio";
import { InputSelect } from "@/components/input/InputSelect";
import resiliencetestSpecs from "@/data/resiliencetest-specs.json";
import { addResilienceTestToRqa } from "@/queries/rqa";
import type { DomainStory } from "@/types/dam/domainstory/DomainStory";
import type { CreateResilienceTestDto } from "@/types/dtos/CreateResilienceTestDto";
import type { RuntimeQualityAnalysisDefinition } from "@/types/rqa/definition/RuntimeQualityAnalysisDefinition";
import {
	getActivitiesForSystem,
	getSystemsFromDomainStory,
} from "@/utils/dam.utils";
import { validateObject } from "@/utils/rqa.utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, type ChangeEvent } from "react";
import type { Edge } from "reactflow";

interface ResilienceTestSpecifierProps {
	domain: DomainStory;
	rqas: RuntimeQualityAnalysisDefinition[];
	selectedEdge?: Edge | null;
}

export function ResilienceTestSpecifier({
	domain,
	rqas,
	selectedEdge,
}: ResilienceTestSpecifierProps) {
	const queryClient = useQueryClient();
	const [resilienceTestDto, setResilienceTestDto] =
		useState<CreateResilienceTestDto>({
			name: `ResilienceTest${new Date().getTime()}`,
			description: "ResilienceTestDescription",
			system_id: undefined as any,
			stimulus_type: "" as any,
			pause_before_triggering_seconds: 15,
			experiment_duration_seconds: 32,
			delay_min_milliseconds: 100,
			delay_max_milliseconds: 200,
			injection_frequency: 1,
			recovery_time: undefined,
		});

	const [showSubmitBtn, setShowSubmitBtn] = useState<boolean>();

	// Set System and Actvitivity, when selected edge changes
	useEffect(() => {
		if (domain && selectedEdge) {
			const activityId = selectedEdge.id;
			const systemId = selectedEdge.target;
			if (!activityId || !systemId) return;
			setResilienceTestDto((prev) => {
				return {
					...prev,
					activity_id: activityId,
					system_id: systemId,
				};
			});
		}
	}, [selectedEdge, domain]);

	useEffect(() => {
		setShowSubmitBtn(validateObject(resilienceTestDto));
	}, [resilienceTestDto]);

	const addToRqa = (rqaId: string) => {
		const resilienceTestDtoRemovedUnusedProperties =
			removeUnusedPropertiesForStimulus();

		rqaMutation.mutate({
			rqaId,
			resilienceTestDto: resilienceTestDtoRemovedUnusedProperties,
		});
	};

	const removeUnusedPropertiesForStimulus = () => {
		const resilienceTestDtoRemovedUnusedProperties = {
			...resilienceTestDto,
		};
		if (
			resilienceTestDtoRemovedUnusedProperties.stimulus_type !==
			"LATE_RESPONSES"
		) {
			resilienceTestDtoRemovedUnusedProperties.delay_min_milliseconds =
				undefined;
			resilienceTestDtoRemovedUnusedProperties.delay_max_milliseconds =
				undefined;
		}
		if (
			resilienceTestDtoRemovedUnusedProperties.stimulus_type !==
				"LATE_RESPONSES" &&
			resilienceTestDtoRemovedUnusedProperties.stimulus_type !==
				"FAILED_REQUESTS"
		) {
			resilienceTestDtoRemovedUnusedProperties.injection_frequency = undefined;
		}
		return resilienceTestDtoRemovedUnusedProperties;
	};

	const rqaMutation = useMutation({
		mutationFn: addResilienceTestToRqa,
		onSuccess: (data) => {
			//queryClient.setQueryData(["rqas", data.id], data);
			queryClient.invalidateQueries({ queryKey: ["rqas"] });
		},
	});

	const handleChange = (
		ev: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
		val: any,
	) => {
		setResilienceTestDto((prev) => {
			ev.target.name;
			return {
				...prev,
				[ev.target.name]: val,
			};
		});
	};

	return (
		<div className="p-4 prose h-full overflow-auto bg-slate-200 ">
			<h3>Resilience Test Specification</h3>
			<h4>Domain Story Item</h4>
			<InputSelect
				label={"System"}
				name={"system_id"}
				value={resilienceTestDto.system_id}
				options={getSystemsFromDomainStory(domain)}
				optionName={"name"}
				optionValue={"id"}
				onChange={handleChange}
			/>
			<InputSelect
				label={"Activity (optional)"}
				name={"activity_id"}
				value={resilienceTestDto.activity_id}
				options={getActivitiesForSystem(domain, resilienceTestDto.system_id)}
				optionName={"action"}
				optionValue={"id"}
				onChange={handleChange}
			/>
			<div className="divider" />
			<h3>Stimulus</h3>
			<InputSelect
				label={"Stimulus"}
				name={"stimulus_type"}
				value={resilienceTestDto.stimulus_type}
				options={resiliencetestSpecs.stimulus_types.options}
				optionName={"name"}
				optionValue={"value"}
				onChange={handleChange}
			/>
			<InputNumber
				label={"Pause before triggering (in seconds)"}
				name={"pause_before_triggering_seconds"}
				value={resilienceTestDto.pause_before_triggering_seconds}
				min={0}
				onChange={handleChange}
			/>
			<InputNumber
				label={"Experiment duration (in seconds)"}
				name={"experiment_duration_seconds"}
				value={resilienceTestDto.experiment_duration_seconds}
				min={0}
				onChange={handleChange}
			/>
			{(resilienceTestDto.stimulus_type === "LATE_RESPONSES" ||
				resilienceTestDto.stimulus_type === "FAILED_REQUESTS") && (
				<InputNumber
					label={"Influence every nth request"}
					name={"injection_frequency"}
					value={resilienceTestDto.injection_frequency}
					min={0}
					onChange={handleChange}
				/>
			)}
			{resilienceTestDto.stimulus_type === "LATE_RESPONSES" && (
				<>
					<h3>Delay</h3>
					<InputNumber
						label={"Delay-Minimum (in ms)"}
						name={"delay_min_milliseconds"}
						value={resilienceTestDto.delay_min_milliseconds}
						min={0}
						onChange={handleChange}
					/>
					<InputNumber
						label={"Delay-Maximum (in ms)"}
						name={"delay_max_milliseconds"}
						value={resilienceTestDto.delay_max_milliseconds}
						min={0}
						onChange={handleChange}
					/>
				</>
			)}
			<div className="divider" />
			<h3>Response Measures</h3>
			{resiliencetestSpecs.response_measures.map((responseMeasure) => {
				return (
					<InputRadio
						key={responseMeasure.type}
						label={responseMeasure.name}
						name={"recovery_time"}
						value={resilienceTestDto.recovery_time}
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
