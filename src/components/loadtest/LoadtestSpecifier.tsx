import { ChangeEvent, useEffect, useState } from "react";
import { InputSelect } from "../input/InputSelect";
import { InputSlider } from "../input/InputSlider";
import { InputRadio } from "../input/InputRadio";
import { InputCheckbox } from "../input/InputCheckbox";
import { DropdownLeft } from "../DropdownLeft";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addLoadtestToRqa } from "../../queries/rqa";
import { DomainStory } from "../../types/dam/domainstory/DomainStory";
import { RuntimeQualityAnalysisDefinition } from "../../types/rqa/definition/RuntimeQualityAnalysisDefinition";
import {
  getActivitiesForSystem,
  getSystemsFromDomainStory,
} from "../../utils/dam.utils";
import { validateObject } from "../../utils/rqa.utils";
import { LoadTestDefinition } from "../../types/rqa/definition/loadtest/LoadTestDefinition";
import { Edge } from "reactflow";
import loadtestSpecs from "../../data/loadtest-specs.json";

interface LoadTestSpecifierProps {
  domainstory: DomainStory;
  rqas?: RuntimeQualityAnalysisDefinition[];
  selectedEdge?: Edge | null;
}

export default function LoadTestSpecifier({
  domainstory,
  rqas,
  selectedEdge,
}: LoadTestSpecifierProps) {
  const queryClient = useQueryClient();

  const [loadTest, setLoadTest] = useState<LoadTestDefinition>({
    name: "LoadTest",
    artifact: {
      system_id: null,
      activity_id: null,
    },
    stimulus: {
      accuracy: 0,
      workload: {
        load_profile: null,
        //type: null,
      },
    },
    response_measure: {
      response_time: null,
    },
    result_metrics: [],
  });

  const [showSubmitBtn, setShowSubmitBtn] = useState<boolean>();

  // Set System and Actvitivity, when selected edge changes
  useEffect(() => {
    if (domainstory && selectedEdge) {
      const activityId = selectedEdge.id;
      const systemId = selectedEdge.target;
      if (!activityId || !systemId) return;
      setLoadTest((prev) => {
        return {
          ...prev,
          artifact: {
            activity_id: activityId,
            system_id: systemId,
          },
        };
      });
    }
  }, [selectedEdge, domainstory]);

  useEffect(() => {
    setShowSubmitBtn(validateObject(loadTest));
  }, [loadTest]);

  const addToRqa = (rqaId?: string) => {
    rqaMutation.mutate({ rqaId, inputs: loadTest });
  };

  const rqaMutation = useMutation({
    mutationFn: addLoadtestToRqa,
    onSuccess: (data) => {
      //queryClient.setQueryData(["rqas", data.id], data);
      queryClient.invalidateQueries(["rqas"]);
    },
  });

  const getLoadProfileParameters = (loadProfileType?: string) => {
    return loadtestSpecs.loadProfiles.find(
      (loadProfile) => loadProfile.type === loadProfileType
    )?.parameters;
  };

  const handleChange = (
    ev: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    data?: any
  ) => {
    setLoadTest((prev) => {
      const { name, type } = ev.target;
      const nextState = { ...prev };
      let currentObj: any = nextState;
      const keys = name.split(".");

      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (!currentObj[key]) {
          currentObj[key] = {};
        }
        currentObj = currentObj[key];
      }
      const lastKey = keys[keys.length - 1];

      if (type === "checkbox") {
        currentObj[lastKey] = (ev.target as HTMLInputElement).checked
          ? [...currentObj[lastKey], data]
          : currentObj[lastKey].filter((val: any) => val !== data);
      } else {
        currentObj[lastKey] = data;
      }

      return nextState;
    });
  };

  return (
    <div className="p-4 prose h-full overflow-auto bg-slate-200 ">
      <h3>Load Test Specification</h3>
      <h4>Domain Story Item</h4>
      <InputSelect
        label={"System"}
        name={"artifact.system_id"}
        value={loadTest.artifact?.system_id}
        options={getSystemsFromDomainStory(domainstory)}
        optionName={"name"}
        optionValue={"_id"}
        onChange={handleChange}
      />
      <InputSelect
        label={"Activity"}
        name={"artifact.activity_id"}
        value={loadTest.artifact?.activity_id}
        options={getActivitiesForSystem(
          domainstory,
          loadTest.artifact?.system_id
        )}
        optionName={"action"}
        optionValue={"_id"}
        onChange={handleChange}
      />
      <div className="divider" />
      <h3>Load Design</h3>
      <InputSelect
        label={"Load Profile"}
        name={"stimulus.workload.load_profile.type"}
        value={loadTest.stimulus?.workload?.load_profile?.type}
        options={loadtestSpecs.loadProfiles}
        optionName={"name"}
        optionValue={"type"}
        onChange={handleChange}
      />
      {getLoadProfileParameters(
        loadTest.stimulus?.workload?.load_profile?.type
      )?.map((parameter) => {
        return (
          <InputRadio
            key={parameter.type}
            label={parameter.name}
            name={"stimulus.workload.load_profile." + parameter.type}
            value={loadTest.stimulus?.workload?.load_profile?.type}
            options={parameter.options}
            optionName={"name"}
            onChange={handleChange}
          />
        );
      })}
      <InputSlider
        label={"Accuracy"}
        name={"stimulus.accuracy"}
        value={loadTest.stimulus?.accuracy}
        onChange={handleChange}
      />
      <div className="divider" />
      <h3>Response Measures</h3>
      {loadtestSpecs.response_measures.map((responseMeasure) => {
        return (
          <InputRadio
            key={responseMeasure.type}
            label={responseMeasure.name}
            name={"response_measure"}
            value={loadTest.response_measure}
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
            checked={!!loadTest.result_metrics?.includes(option.value)}
            onChange={handleChange}
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
