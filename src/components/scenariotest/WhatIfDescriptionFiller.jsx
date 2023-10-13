import deepCopy from "./deepCopy.jsx";
import pluralize from "pluralize";

export default function WhatIfDescriptionFiller(whatIfVariant, whatIfDesign) {
    if(whatIfVariant === undefined || whatIfDesign === null) {
        return null;
    }

    let resultDescription = deepCopy(whatIfVariant.variant_placeholder);
    const placeholderRegex = /\[(.*?)\]/g;

    resultDescription = resultDescription.replace(placeholderRegex, (match, placeholder) => {
            for (let index in whatIfVariant.design_parameters) {
                if(whatIfVariant.design_parameters[index].param_placeholder === match) {
                    let value = whatIfVariant.design_parameters[index].values.find(value => value.name === whatIfDesign.design_parameters[index].value?.name);
                    if(value === undefined) {
                        return match;
                    }
                    return value.placeholder_value;
                }
            }
            return match;
        });
        if(resultDescription.includes("null")) {
            return null;
        }
        else if(whatIfDesign.name === "Load Peak" || whatIfDesign.name === "Load Increase" || whatIfDesign.name === "Constant Load") {
            return resultDescription + " " + whatIfDesign.name.toLowerCase();
        }
        else if(whatIfDesign.name === "Failed Request" || whatIfDesign.name === "Late Response" || whatIfDesign.name === "Unavailable") {
            let whatIfName = whatIfDesign.name.toLowerCase();
            if(whatIfName === "unavailable") {
                whatIfName = "shutdown";
            }
            if(whatIfDesign.design_parameters[0].value === null || whatIfDesign.design_parameters[0].value.name === "Once") {
                return resultDescription + " " + whatIfName;
            }
            else {
                return resultDescription + " " + pluralize(whatIfName);
            }
        }
    return null;
}