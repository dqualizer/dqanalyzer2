import "@/data/scenariotest-specs.json";
import pluralize from "pluralize";
import deepCopy from "./deepCopy.jsx";

export default function WhatIfVariantFormatterService(rqs, part) {
  let resultDescription;
  const placeholderRegex = /\[(.*?)\]/g;
  if (part === "Load") {
    const rqsLoad = rqs.load_design;
    if (rqsLoad === null) {
      return null;
    }
    const loadSpec = scenarioSpecs.load_design.find(
      (load) => load.name === rqsLoad.name,
    );
    resultDescription = deepCopy(loadSpec.variant_placeholder);
    resultDescription = resultDescription.replace(
      placeholderRegex,
      (match, placeholder) => {
        for (const index in rqsLoad.design_parameters) {
          if (loadSpec.design_parameters[index].param_placeholder === match) {
            const value = loadSpec.design_parameters[index].values.find(
              (value) =>
                value.name === rqsLoad.design_parameters[index].value?.name,
            );
            if (value === undefined) {
              return match;
            }
            return value.placeholder_value;
          }
        }
        return match;
      },
    );
    if (
      rqsLoad.name === "Load Peak" ||
      rqsLoad.name === "Load Increase" ||
      rqsLoad.name === "Constant Load"
    ) {
      return `${resultDescription} ${rqsLoad.name.toLowerCase()}`;
    }
    return null;
  }
  if (part === "Resilience") {
    const rqsResilience = rqs.resilience_design;
    if (rqsResilience === null) {
      return null;
    }
    const resilienceSpec = scenarioSpecs.resilience_design.find(
      (resilience) => resilience.name === rqsResilience.name,
    );
    resultDescription = deepCopy(resilienceSpec.variant_placeholder);
    resultDescription = resultDescription.replace(
      placeholderRegex,
      (match, placeholder) => {
        for (const index in rqsResilience.design_parameters) {
          if (
            resilienceSpec.design_parameters[index].param_placeholder === match
          ) {
            const value = resilienceSpec.design_parameters[index].values.find(
              (value) =>
                value.name ===
                rqsResilience.design_parameters[index].value?.name,
            );
            if (value === undefined) {
              return match;
            }
            return value.placeholder_value;
          }
        }
        return match;
      },
    );

    if (
      rqsResilience.name === "Failed Request" ||
      rqsResilience.name === "Late Response" ||
      rqsResilience.name === "Unavailable"
    ) {
      let whatIfName = rqsResilience.name.toLowerCase();
      if (whatIfName === "unavailable") {
        whatIfName = "shutdown";
      }
      if (
        rqsResilience.design_parameters[0].value === null ||
        rqsResilience.design_parameters[0].value.name === "Once"
      ) {
        return `${resultDescription} ${whatIfName}`;
      }
      return `${resultDescription} ${pluralize(whatIfName)}`;
    }
    return null;
  }
}
