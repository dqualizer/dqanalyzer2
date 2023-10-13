import deepCopy from "./deepCopy.jsx";
import pluralize from "pluralize";
import * as scenarioSpecs from '../../data/scenariotest-specs.json';

export default function WhatIfVariantFormatterService(rqs, part) {
    let resultDescription;
    const placeholderRegex = /\[(.*?)\]/g;
    if(part === "Load") {
        let rqsLoad = rqs.load_design;
        if (rqsLoad === null) {
            return null;
        }
        let loadSpec = scenarioSpecs.load_design.find(load => load.name === rqsLoad.name);
        resultDescription = deepCopy(loadSpec.variant_placeholder);
        resultDescription = resultDescription.replace(placeholderRegex, (match, placeholder) => {
            for (let index in rqsLoad.design_parameters) {
                if (loadSpec.design_parameters[index].param_placeholder === match) {
                    let value = loadSpec.design_parameters[index].values.find(value => value.name === rqsLoad.design_parameters[index].value?.name);
                    if (value === undefined) {
                        return match;
                    }
                    return value.placeholder_value;
                }
            }
            return match;
        });
        if(rqsLoad.name === "Load Peak" || rqsLoad.name === "Load Increase" || rqsLoad.name === "Constant Load") {
            return resultDescription + " " + rqsLoad.name.toLowerCase();
        }
        return null;
    }
    else if(part === "Resilience") {
        let rqsResilience = rqs.resilience_design;
        if (rqsResilience === null) {
            return null;
        }
        let resilienceSpec = scenarioSpecs.resilience_design.find(resilience => resilience.name === rqsResilience.name);
        resultDescription = deepCopy(resilienceSpec.variant_placeholder);
        resultDescription = resultDescription.replace(placeholderRegex, (match, placeholder) => {
            for (let index in rqsResilience.design_parameters) {
                if (resilienceSpec.design_parameters[index].param_placeholder === match) {
                    let value = resilienceSpec.design_parameters[index].values.find(value => value.name === rqsResilience.design_parameters[index].value?.name);
                    if (value === undefined) {
                        return match;
                    }
                    return value.placeholder_value;
                }
            }
            return match;
        });

        if(rqsResilience.name === "Failed Request" || rqsResilience.name === "Late Response" || rqsResilience.name === "Unavailable") {
            let whatIfName = rqsResilience.name.toLowerCase();
            if(whatIfName === "unavailable") {
                whatIfName = "shutdown";
            }
            if(rqsResilience.design_parameters[0].value === null || rqsResilience.design_parameters[0].value.name === "Once") {
                return resultDescription + " " + whatIfName;
            }
            else {
                return resultDescription + " " + pluralize(whatIfName);
            }
        }
        return null;
    }
}