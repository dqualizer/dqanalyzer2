import React, { useContext, useState } from "react";
import { InputSelect } from "../input/InputSelect";
import { MonitoringDefinition } from "@/types/rqa/definition/monitoring/MonitoringDefinition";
import { getAllActivities } from "@/utils/dam.utils";
import { DqContext } from "@/app/providers/DqContext";
import { MeasurementType } from "@/types/rqa/definition/monitoring/MeasurementType";
import { DropdownLeft } from "../DropdownLeft";
import { updateRqaMonitoring } from "./action";

export default function ShowMonitoringSpecifier() {
  const { domainstory, rqas } = useContext(DqContext);
  const [target, setMonitoringTarget] = useState<string>("");
  const [measurementName, setMeasurementName] = useState<string>("");
  const [measurementType, setMeasurementType] = useState<MeasurementType>();
  const [measurementUnit, setMeasurementUnit] = useState<string>("");

  const handleSubmit = (rqa) => {
    const monitoringDefinition: MonitoringDefinition = {
      target: target,
      measurementName: measurementName,
      measurementType: measurementType,
      measurementUnit: measurementUnit,
    };

    updateRqaMonitoring(rqa, monitoringDefinition);
  };

  // Extract all measurement types from the enum
  // I´m sorry for this s**t.
  const measurementTypes = Object.keys(MeasurementType).map((key) => {
    return { id: key, name: MeasurementType[key] };
  });
  console.log(measurementTypes);
  return (
    <div className="p-4 prose h-full overflow-auto bg-slate-200 ">
      <h3>Monitoring Specification</h3>
      <h4>Domain Story Item</h4>
      <form action={handleSubmit}>
        <InputSelect
          label="Target"
          name="target"
          value={target}
          options={getAllActivities(domainstory)}
          optionName="name"
          optionValue={"id"}
          onChange={(e) => setMonitoringTarget(e.target.value)}
        />
        <div>
          <label>Measurement Name</label>
          <input
            type="text"
            name="measurementName"
            placeholder="Measurement Name"
            className="input input-bordered w-full max-w-xs"
            value={measurementName}
            onChange={(e) => setMeasurementName(e.target.value)}
          />
        </div>
        <div>
          <label>Unit</label>
          <input
            type="text"
            name="unit"
            placeholder="Unit"
            className="input input-bordered w-full max-w-xs"
            value={measurementUnit}
            onChange={(e) => setMeasurementUnit(e.target.value)}
          />
          <InputSelect
            label="Measurement Type"
            name="measurementType"
            value={measurementType}
            options={measurementTypes}
            optionName={"name"}
            optionValue={"id"}
            onChange={(e) =>
              setMeasurementType(e.target.value as MeasurementType)
            }
          />
        </div>

        <DropdownLeft
          rqas={rqas}
          onClick={async (rqa_id) => {
            handleSubmit(rqa_id);
          }}
        />
      </form>
    </div>
  );
}
