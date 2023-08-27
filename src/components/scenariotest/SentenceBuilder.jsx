import scenarioSpecs from "../../data/scenariotest-specs.json";
import WhatIfDescriptionFiller from "./WhatIfDescriptionFiller.jsx";
import replacePlaceholders from "./replacePlaceholders.jsx";

export default function SentenceBuilder(sentence, mode) {

    const getWhatIfDescription = (mode, loadDescriptionToReplace, resilienceDescriptionToReplace, loadDesign, resilienceDesign) => {

        if(mode === "load") {
            // if there is no Description
            if(loadDescriptionToReplace === null) {
                return null;
            }
            let loadVariantWithPlaceholder = scenarioSpecs.load_design.find(loadVariant => loadVariant.name === loadDesign.name);
            let loadDescription = WhatIfDescriptionFiller(loadVariantWithPlaceholder, loadDesign);
            loadDescriptionToReplace = loadDescriptionToReplace.replace("[load]", loadDescription);
            if (resilienceDesign === null) {
                return loadDescriptionToReplace;
            }
            let resilienceVariantWithPlaceholder = scenarioSpecs.resilience_design.find(resilienceVariant => resilienceVariant.name === resilienceDesign.name);
            let resilienceDescription = WhatIfDescriptionFiller(resilienceVariantWithPlaceholder, resilienceDesign);
            resilienceDescriptionToReplace = resilienceDescriptionToReplace.replace("[resilience]", resilienceDescription);
            return loadDescriptionToReplace + " " + resilienceDescriptionToReplace;
        }
        else if(mode === "resilience") {
            let resilienceVariantWithPlaceholder = scenarioSpecs.resilience_design.find(resilienceVariant => resilienceVariant.name === resilienceDesign.name);
            let resilienceDescription = WhatIfDescriptionFiller(resilienceVariantWithPlaceholder, resilienceDesign);
            resilienceDescriptionToReplace = resilienceDescriptionToReplace.replace("[load]", resilienceDescription);
            if (loadDesign === null) {
                return resilienceDescriptionToReplace;
            }
            let loadVariantWithPlaceholder = scenarioSpecs.load_design.find(loadVariant => loadVariant.name === loadDesign.name);
            let loadDescription = WhatIfDescriptionFiller(loadVariantWithPlaceholder, loadDesign);
            loadDescriptionToReplace = loadDescriptionToReplace.replace("[load]", loadDescription);
            return resilienceDescriptionToReplace + " " + loadDescriptionToReplace;
        }
        return null;
    }

    if(mode === "What if") {
        if(sentence.description_audience === null) {
            let descriptionList = [];
            if(sentence.description_speakers !== "") {
                descriptionList.push(sentence.description_speakers);
            }
            if(sentence.description_message !== "") {
                descriptionList.push(sentence.description_message);
            }
            let attachment = sentence.attachment === "" ? "": " " + sentence.attachment;
            let descriptionWhatIf = getWhatIfDescription(sentence.what_if_mode, sentence.description_load, sentence.description_resilience, sentence.load_design, sentence.resilience_design);

            if(descriptionWhatIf === null) {
                return null;
            }

            return descriptionList.join(" ") + attachment + descriptionWhatIf + "?";
        }
        else {
            let descriptionList = [];
            if(sentence.description_speakers !== "") {
                descriptionList.push(sentence.description_speakers);
            }
            if(sentence.description_message !== "") {
                descriptionList.push(sentence.description_message);
            }
            if(sentence.description_audience !== "") {
                descriptionList.push(sentence.description_audience);
            }
            let attachment = sentence.attachment === "" ? "": " " + sentence.attachment;
            let descriptionWhatIf = getWhatIfDescription(sentence.what_if_mode, sentence.description_load, sentence.description_resilience, sentence.load_design, sentence.resilience_design);
            return descriptionList.join(" ") + attachment + " " + descriptionWhatIf + "?";
        }
    }
    else if(mode === "Monitoring") {
        if(sentence.description_audience === null) {
            let descriptionList = [];
            if(sentence.description_speakers !== "") {
                descriptionList.push(sentence.description_speakers);
            }
            if(sentence.description_message !== "") {
                descriptionList.push(sentence.description_message);
            }
            let attachment = sentence.attachment === "" ? "": " " + sentence.attachment;
            return descriptionList.join(" ") + attachment + "?";
        }
        else {
            let descriptionList = [];
            if(sentence.description_speakers !== "") {
                descriptionList.push(sentence.description_speakers);
            }
            if(sentence.description_message !== "") {
                descriptionList.push(sentence.description_message);
            }
            if(sentence.description_audience !== "") {
                descriptionList.push(sentence.description_audience);
            }
            let attachment = sentence.attachment === "" ? "": " " + sentence.attachment;
            return descriptionList.join(" ") + attachment + "?";
        }
    }
    return null;
}