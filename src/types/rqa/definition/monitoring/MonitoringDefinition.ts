import { MeasurementType } from "./MeasurementType";

export interface MonitoringDefinition {
  // The activity / method to monitor
  target: string;
  // The name of the measurement
  // Motly some business name, like "Time to submit order" or "Executed orders"
  measurement_name: string;
  // The unit of the measurement
  measurement_unit: string;
  // The type of the measurement
  measurement_type: MeasurementType;
}
