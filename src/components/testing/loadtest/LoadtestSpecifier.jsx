import React, { useEffect, useState } from "react";
import LoadtestSelect from "./LoadtestSelect";
import LoadtestSlider from "./LoadtestSlider";
import LoadtestRadios from "./LoadtestRadios";
import LoadtestCheck from "./LoadtestCheck";
export default function LoadtestSpecifier({
  rqas,
  domain,
  loadtestSpecs,
  selectedEdge,
}) {
  const [inputs, setInputs] = useState({
    name: "",
    system: "",
    activity: "",
    load_profile: "",
    accuracy: 0,
    highest_load: "",
    time_to_highest_load: "",
    path_variables: {},
    response_time: "",
    result_metrics: [],
  });

  // We need to extract the Endpoint from the DAM to get the Parametrization
  const [endpoint, setEndpoint] = useState();

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleResultMetricsChange = (optionId, isChecked) => {
    if (isChecked) {
      setInputs((prevInputs) => ({
        ...prevInputs,
        result_metrics: [...prevInputs.result_metrics, optionId],
      }));
    } else {
      setInputs((prevInputs) => ({
        ...prevInputs,
        result_metrics: prevInputs.result_metrics.filter(
          (id) => id !== optionId
        ),
      }));
    }
  };

  const handlePathVariableChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    console.log(event.target);
    setInputs((values) => ({
      ...values,
      path_variables: { ...values.path_variables, [name]: value },
    }));
  };

  // Show only the Activities for the selected System
  const getActivities = () => {
    if (inputs.system) {
      return domain?.systems?.find(
        (system) => system.system_id == inputs.system
      )?.activities;
    }
    return [];
  };

  const getDesignParameters = () => {
    if (inputs.load_profile) {
      return loadtestSpecs.stimuluses.find(
        (stimulus) => stimulus.id == inputs.load_profile
      ).designParameters;
    }
    return [];
  };

  const getEndpoint = useEffect(() => {
    if (inputs.activity) {
      setEndpoint(
        domain.systems
          .find((system) => system.system_id == inputs.system)
          .activities.find(
            (activity) => activity.activity_id == inputs.activity
          ).endpoint
      );
    }
  }, [inputs.activity]);

  // Before we can initialize the path_variables, we have to know the endpoint
  // Without it we don´t know the keys
  const setParametrization = useEffect(() => {
    if (endpoint) {
      let path_variables_copy = inputs.path_variables;
      endpoint.path_variables.forEach((path_variable) => {
        path_variables_copy[path_variable.name] = "";
      });
      setInputs((values) => ({
        ...values,
        path_variables: path_variables_copy,
      }));
    }
  }, [endpoint]);

  // Change System and Actvitivity, when selecte Eddge changes
  useEffect(() => {
    if (domain) {
      console.log("edge");
      console.log(domain);
      getSystemAndActivityBasedOnSelectedEdge();
    }
  }, [selectedEdge, domain]);

  const getSystemAndActivityBasedOnSelectedEdge = async () => {
    if (selectedEdge) {
      console.log("selectedEdge");
      let system = domain.systems.find(
        (system) => system.system_id == selectedEdge.system
      );
      let activity = system.activities.find(
        (activity) => activity.activity_id == selectedEdge.mappingId
      );
      setInputs((prevState) => ({
        ...prevState,
        System: system.system_id,
        Activity: activity.activity_id,
      }));
    }
  };

  return (
    <div className="p-4 prose h-full">
      <h3>Loadtest Specification</h3>
      <h4>Domain Story Item</h4>
      <LoadtestSelect
        label={"System"}
        onChange={handleChange}
        value={inputs.system}
        options={domain.systems}
        optionName={"name"}
        optionValue={"system_id"}
      />
      <LoadtestSelect
        label={"Activity"}
        onChange={handleChange}
        value={inputs.activity}
        options={getActivities()}
        optionName={"name"}
        optionValue={"activity_id"}
      />
      <div className="divider " />
      <h3>Load Design</h3>
      <LoadtestSelect
        label={"Load Profile"}
        onChange={handleChange}
        value={inputs.load_profile}
        options={loadtestSpecs.stimuluses}
        optionName={"name"}
        optionValue={"id"}
      />
      {getDesignParameters().map((designParameter) => {
        console.log(designParameter.name);
        return (
          <LoadtestRadios
            label={designParameter.name}
            onChange={handleChange}
            value={inputs.load_profile}
            options={designParameter.values}
            optionName={designParameter.name}
            optionValue={"value"}
          />
        );
      })}
      <LoadtestSlider
        label={"Accuracy"}
        onChange={handleChange}
        value={inputs.accuracy}
      />
      <div className="divider " />
      <h3>Response Measures</h3>
      {loadtestSpecs.responseMeasures.map((responseMeasure) => {
        return (
          <LoadtestRadios
            label={responseMeasure.name}
            onChange={handleChange}
            value={inputs.response_measures}
            options={responseMeasure.values}
            optionName={responseMeasure.name}
            optionValue={"value"}
          />
        );
      })}

      <div className="divider"></div>
      <h3>Result Metrics</h3>
      {loadtestSpecs.metrics.map((option) => {
        return (
          <LoadtestCheck
            option={option}
            onChange={(e) =>
              handleResultMetricsChange(option.id, e.target.checked)
            }
            inputs={inputs}
          />
        );
      })}

      {endpoint && (
        <div>
          <h3>Parametrization Details</h3>
          {endpoint.path_variables && (
            <div>
              <h4>Path Variables</h4>
              {endpoint.path_variables.map((path_variable) => {
                let variableName = path_variable.name;
                console.log(variableName);
                return (
                  <LoadtestSelect
                    label={path_variable.name}
                    onChange={handlePathVariableChange}
                    value={inputs.path_variables[variableName]}
                    options={path_variable.szenarios}
                    optionName={"name"}
                    optionValue={"path"}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
