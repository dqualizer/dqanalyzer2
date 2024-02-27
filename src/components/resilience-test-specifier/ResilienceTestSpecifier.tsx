import { ChangeEvent, useEffect, useState } from "react";
import { InputSelect } from "../input/InputSelect";
import { InputSlider } from "../input/InputSlider";
import { InputRadio } from "../input/InputRadio";
import { DropdownLeft } from "../DropdownLeft";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addResilienceTestToRqa } from "../../queries/rqa";
import { DomainStory } from "../../models/dam/domainstory/DomainStory";
import { RuntimeQualityAnalysisDefinition } from "../../models/rqa/definition/RuntimeQualityAnalysisDefinition";
import {
  getActivitiesForSystem,
  getSystemsFromDomainStory,
} from "../../utils/dam.utils";
import { validateObject } from "../../utils/rqa.utils";
import { Edge } from "reactflow";
import resiliencetestSpecs from "../../data/resiliencetest-specs.json";
import { CreateResilienceTestDto } from "../../models/dtos/CreateResilienceTestDto";

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
      name: "ResilienceTest " + new Date().toLocaleString(),
      description: "ResilienceTestDescription",
      system_id: "",
      activity_id: undefined,
      stimulus_type: "",
      accuracy: 0,
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
    rqaMutation.mutate({ rqaId, resilienceTestDto });
  };

  const rqaMutation = useMutation({
    mutationFn: addResilienceTestToRqa,
    onSuccess: (data) => {
      //queryClient.setQueryData(["rqas", data.id], data);
      queryClient.invalidateQueries(["rqas"]);
    },
  });

  const handleChange = (
    ev: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setResilienceTestDto((prev) => {
      ev.target.name;
      return {
        ...prev,
        [ev.target.name]: ev.target.value,
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
        optionValue={"_id"}
        onChange={handleChange}
      />
      <InputSelect
        label={"Activity"}
        name={"activity_id"}
        value={resilienceTestDto.activity_id}
        options={getActivitiesForSystem(domain, resilienceTestDto.system_id)}
        optionName={"action"}
        optionValue={"_id"}
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
      <InputSlider
        label={"Accuracy"}
        name={"accuracy"}
        value={resilienceTestDto.accuracy}
        onChange={handleChange}
      />
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
