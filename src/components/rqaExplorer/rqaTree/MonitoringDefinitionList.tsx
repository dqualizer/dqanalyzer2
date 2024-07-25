import { MonitoringDefinition } from "@/types/rqa/definition/monitoring/MonitoringDefinition";

interface MonitoringDefinitionListProps {
  monitoringDefinitions: MonitoringDefinition[];
}

export default function MonitoringDefinitionList({
  monitoringDefinitions,
}: MonitoringDefinitionListProps) {
  return (
    <details>
      <summary>Monitoring Definitions</summary>
      <ul>
        {monitoringDefinitions?.map((monitoringDefinition, index) => {
          return (
            <li key={index}>
              {monitoringDefinition.target} -{" "}
              {monitoringDefinition.measurement_name} -{" "}
              {monitoringDefinition.measurement_type} -{" "}
              {monitoringDefinition.measurement_unit}
            </li>
          );
        })}
      </ul>
    </details>
  );
}
