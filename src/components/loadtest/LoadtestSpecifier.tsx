import { ChangeEvent, useEffect, useState } from "react";
import { InputSelect } from "../input/InputSelect";
import { InputSlider } from "../input/InputSlider";
import { InputRadio } from "../input/InputRadio";
import { InputCheckbox } from "../input/InputCheckbox";
import { DropdownLeft } from "../DropdownLeft";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addLoadTestToRqa } from "../../queries/rqa";
import { DomainStory } from "../../types/dam/domainstory/DomainStory";
import { RuntimeQualityAnalysisDefinition } from "../../types/rqa/definition/RuntimeQualityAnalysisDefinition";
import {
  getActivitiesForSystem,
  getSystemsFromDomainStory,
} from "../../utils/dam.utils";
import { validateObject } from "../../utils/rqa.utils";
import { Edge } from "reactflow";
import loadtestSpecs from "../../data/loadtest-specs.json";
import { CreateLoadTestDto } from "../../types/dtos/CreateLoadTestDto";

interface LoadTestSpecifierProps {
  domainstory: DomainStory;
  rqas: RuntimeQualityAnalysisDefinition[];
  selectedEdge?: Edge | null;
}

export default function LoadTestSpecifier({
  domainstory,
  rqas,
  selectedEdge,
}: LoadTestSpecifierProps) {
  const queryClient = useQueryClient();

  const [loadTestDto, setLoadTestDto] = useState<CreateLoadTestDto>({
    name: "LoadTest" + new Date().getTime(),
    system: undefined as any,
    activity: undefined as any,
    accuracy: undefined as any,
    load_profile: undefined as any,
    design_parameters: {},
    response_time: undefined as any,
    result_metrics: [],
  });

  const [showSubmitBtn, setShowSubmitBtn] = useState<boolean>();

  // Set System and Actvitivity, when selected edge changes
  useEffect(() => {
    if (domainstory && selectedEdge) {
      const activityId = selectedEdge.id;
      const systemId = selectedEdge.target;
      if (!activityId || !systemId) return;
      setLoadTestDto((prev) => {
        return {
          ...prev,
          system: systemId,
          activity: activityId,
        };
      });
    }
  }, [selectedEdge, domainstory]);

  useEffect(() => {
    setShowSubmitBtn(validateObject(loadTestDto));
  }, [loadTestDto]);

  const rqaMutation = useMutation({
    mutationFn: addLoadTestToRqa,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["rqas"]);
    },
  });

  const addToRqa = (rqaId: string) => {
    rqaMutation.mutate({ rqaId, loadTestDto });
  };

  const getLoadProfileParameters = (loadProfileType?: string) => {
    return loadtestSpecs.loadProfiles.find(
      (loadProfile) => loadProfile.type === loadProfileType
    )?.parameters;
  };

  const handleChange = (
    ev: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    val: any
  ) => {
    setLoadTestDto((prev) => {
      return {
        ...prev,
        [ev.target.name]: val,
      };
    });
  };

  const handleChangeForLoadProfileParameters = (
    ev: ChangeEvent<HTMLInputElement>,
    val: any
  ) => {
    setLoadTestDto((prev) => {
      const key = ev.target.name as string;
      const designParameters = {
        ...prev.design_parameters,
        [key]: val.value,
      };
      return {
        ...prev,
        design_parameters: designParameters,
      };
    });
  };

  const handleChangeForCheckbox = (
    ev: ChangeEvent<HTMLInputElement>,
    data?: any
  ) => {
    setLoadTestDto((prev: any) => {
      const key = ev.target.name as string;
      const checked = (ev.target as HTMLInputElement).checked;
      const value = checked
        ? [...prev[key], data]
        : prev[key].filter((val: any) => val !== data);
      return {
        ...prev,
        [ev.target.name]: value,
      };
    });
  };

  return (
    <div className="p-4 prose h-full overflow-auto bg-slate-200 ">
      <h3>Load Test Specification</h3>
      <h4>Domain Story Item</h4>
      <InputSelect
        label={"System"}
        name={"system"}
        value={loadTestDto.system}
        options={getSystemsFromDomainStory(domainstory)}
        optionName={"name"}
        optionValue={"_id"}
        onChange={handleChange}
      />
      <InputSelect
        label={"Activity"}
        name={"activity"}
        value={loadTestDto.activity}
        options={getActivitiesForSystem(domainstory, loadTestDto.system)}
        optionName={"action"}
        optionValue={"_id"}
        onChange={handleChange}
      />
      <div className="divider" />
      <h3>Load Design</h3>
      <InputSelect
        label={"Load Profile"}
        name={"load_profile"}
        value={loadTestDto.load_profile}
        options={loadtestSpecs.loadProfiles}
        optionName={"name"}
        optionValue={"type"}
        onChange={handleChange}
      />
      {getLoadProfileParameters(loadTestDto.load_profile)?.map((parameter) => {
        return (
          <InputRadio
            key={parameter.type}
            label={parameter.name}
            name={parameter.type}
            value={loadTestDto.load_profile}
            options={parameter.options}
            optionName={"name"}
            onChange={handleChangeForLoadProfileParameters}
          />
        );
      })}
      <InputSlider
        label={"Accuracy"}
        name={"accuracy"}
        value={loadTestDto.accuracy}
        onChange={handleChange}
      />
      <div className="divider" />
      <h3>Response Measures</h3>
      {loadtestSpecs.response_measures.map((responseMeasure) => {
        return (
          <InputRadio
            key={responseMeasure.type}
            label={responseMeasure.name}
            name={"response_time"}
            value={loadTestDto.response_time}
            options={responseMeasure.options}
            optionName={"name"}
            optionValue={"value"}
            onChange={handleChange}
          />
        );
      })}
      <div className="divider"></div>
      <h3>Result Metrics</h3>
      {loadtestSpecs.result_metrics.map((option) => {
        return (
          <InputCheckbox
            key={option.value}
            label={option.name}
            name="result_metrics"
            value={option.value}
            checked={
              !!loadTestDto.result_metrics?.includes(option.value as any)
            }
            onChange={handleChangeForCheckbox}
          />
        );
      })}

      {showSubmitBtn && <DropdownLeft rqas={rqas} onClick={addToRqa} />}
    </div>
  );
}

{
  /*  	// Path Variables not implemented yet!
	const handlePathVariableChange = (event) => {
		const name = event.target.name;
		const value = event.target.value;
		let path_variables_copy = inputs.path_variables;
		path_variables_copy.find((variable) => variable.key == name).value = value;

		setInputs((values) => ({
			...values,
			path_variables: path_variables_copy,
		}));
	};
 */
}

{
  /* Tryed to implement Parametrization. Not Part of Q3 */
}
{
  /* {endpoint && (
        <div>
          <h3>Parametrization Details</h3>
          {endpoint.path_variables && (
            <div>
              <h4>Path Variables</h4>
              {endpoint.path_variables.map((path_variable) => {
                let variableName = path_variable.name;
                console.log();
                return (
                  <InputSelect
                    label={path_variable.name}
                    onChange={handlePathVariableChange}
                    value={
                      inputs.path_variables.find(
                        (variable) => variable.key == variableName
                      )?.value
                    }
                    options={path_variable.szenarios}
                    optionName={"name"}
                    optionValue={"path"}
                  />
                );
              })}
            </div>
          )}
        </div>
      )} */
}

/*
	// We need to extract the Endpoint from the DAM to get the Parametrization
	const [endpoint, setEndpoint] = useState();


	// NOT IN USE - ENDPOINT WILL NOT BE INCLUDED IN DOMAIN SCHEMA
	// const getEndpoint = useEffect(() => {
	//   if (inputs.activity) {
	//     setEndpoint(
	//       domain.systems
	//         .find((system) => system.name == inputs.system)
	//         .activities.find(
	//           (activity) => activity.activity_id == inputs.activity
	//         ).endpoint
	//     );
	//   }
	// }, [inputs.activity]);

	// NOT PART OF Q3 -- Not in use

	// Before we can initialize the path_variables, we have to know the endpoint
	// Without it we don´t know the keys
	// const setParametrization = useEffect(() => {
	//   if (endpoint) {
	//     let path_variables = [];
	//     endpoint.path_variables.forEach((path_variable) => {
	//       path_variables.push({ key: path_variable.name, value: "" });
	//     });
	//     console.log(path_variables);
	//     setInputs((values) => ({
	//       ...values,
	//       path_variables: path_variables,
	//     }));
	//   }
	// }, [endpoint]);

	*/
