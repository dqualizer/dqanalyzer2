import { useDqContext } from "@/app/providers/DqContext";
import { InputSelect } from "@/components/input/InputSelect";
import loadtestSpecs from "@/data/loadtest-specs.json";
import type { CreateLoadTestDefinitionDTO } from "@/types/rqa/definition/loadtest/LoadTestDefinition";
import {
  getActivitiesForSystem,
  getSystemsFromDomainStory,
} from "@/utils/dam.utils";
import { type ChangeEvent, useState } from "react";
import { DropdownLeft } from "../DropdownLeft";
import { InputCheckbox } from "../input/InputCheckbox";
import { InputRadio } from "../input/InputRadio";
import { InputSlider } from "../input/InputSlider";
import { updateRqaLoadTest } from "./action";

export function LoadTestSpecifier() {
  const { domainstory } = useDqContext();

  const [loadTestDTO, setLoadTestDTO] = useState<CreateLoadTestDefinitionDTO>({
    name: `LoadTest-${new Date().getTime()}`,
    artifact: {
      system_id: undefined,
      activity_id: undefined,
    },
    stimulus: {
      accuracy: 0,
      workload: {
        load_profile: undefined,
      },
    },
    response_measure: {
      response_time: undefined,
    },
    result_metrics: [],
  });

  const getLoadProfileParameters = (loadProfileType?: string) => {
    return loadtestSpecs.loadProfiles.find(
      (loadProfile) => loadProfile.type === loadProfileType,
    )?.parameters;
  };

  const handleChange = <T,>(
    ev: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    data?: T,
  ) => {
    setLoadTestDTO((prev) => {
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
  const [showSubmitBtn, setShowSubmitBtn] = useState<boolean>(true);

  return (
    <div className="p-4 prose h-full overflow-auto bg-slate-200">
      <h3>Load Test Specification</h3>
      <h4>Domain Story Item</h4>
      <form>
        <InputSelect
          label={"System"}
          name={"artifact.system_id"}
          value={loadTestDTO.artifact.system_id}
          options={getSystemsFromDomainStory(domainstory)}
          optionName={"name"}
          optionValue={"id"}
          onChange={handleChange}
        />
        <InputSelect
          label={"Activity"}
          name={"artifact.activity_id"}
          value={loadTestDTO.artifact.activity_id}
          options={getActivitiesForSystem(
            domainstory,
            loadTestDTO.artifact?.system_id,
          )}
          optionName={"action"}
          optionValue={"id"}
          onChange={handleChange}
        />
        <div className="divider" />
        <h3>Load Design</h3>
        <InputSelect
          label={"Load Profile"}
          name={"stimulus.workload.load_profile.type"}
          value={loadTestDTO.stimulus?.workload?.load_profile?.type}
          options={loadtestSpecs.loadProfiles}
          optionName={"name"}
          optionValue={"type"}
          onChange={handleChange}
        />
        {getLoadProfileParameters(
          loadTestDTO.stimulus?.workload?.load_profile?.type,
        )?.map((parameter) => {
          return (
            <InputRadio
              key={parameter.type}
              label={parameter.name}
              name={`stimulus.workload.load_profile.${parameter.type}`}
              value={loadTestDTO.stimulus?.workload?.load_profile?.type}
              options={parameter.options}
              optionName={"name"}
              onChange={handleChange}
            />
          );
        })}
        <InputSlider
          label={"Accuracy"}
          name={"stimulus.accuracy"}
          value={loadTestDTO.stimulus?.accuracy}
          onChange={handleChange}
        />
        <div className="divider" />
        <h3>Response Measures</h3>
        {loadtestSpecs.response_measures.map((responseMeasure) => {
          return (
            <InputRadio
              key={responseMeasure.type}
              label={responseMeasure.name}
              name={`response_measure.${responseMeasure.type}`}
              value={loadTestDTO.response_measure}
              options={responseMeasure.options}
              optionName={"name"}
              optionValue={"value"}
              onChange={handleChange}
            />
          );
        })}
        <div className="divider" />
        <h3>Result Metrics</h3>
        {loadtestSpecs.result_metrics.map((option) => {
          return (
            <InputCheckbox
              key={option.value}
              label={option.name}
              name="result_metrics"
              value={option.value}
              checked={!!loadTestDTO.result_metrics?.includes(option.value)}
              onChange={handleChange}
            />
          );
        })}
        <div className="divider" />
        {showSubmitBtn && (
          <DropdownLeft
            onClick={async (rqa_id) => {
              updateRqaLoadTest(rqa_id, loadTestDTO);
            }}
          />
        )}
      </form>
    </div>
  );
}
