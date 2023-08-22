import * as whatIfMetrics from "../../data/what-if-metrics.json";
import * as monitoringMetrics from "../../data/monitoring-metrics.json";
import pluralize from "pluralize";
import compromise from "compromise";
import indefinite from "indefinite";
import deepCopy from "./deepCopy.jsx";
import scenarioSpecs from "../../data/scenariotest-specs.json";

export default function ScenarioGenerator(mode, wordArray) {

    const generateWhatIfScenarios = (words) => {

        let scenarioArray = [];
        for (const metric of allWhatIfMetrics) {
            let sentence = {
                description: "",
                metric: metric.metric,
                expected: null,
                load_design: null,
                resilience_design: null
            };
            let descriptionSpeakers = replacePlaceholders(metric.speakers, words.speakers, "speakers");
            let descriptionMessage = replacePlaceholders(metric.message, words.message, "message")
            let descriptionAudience = replacePlaceholders(metric.audience, words.audience, "audience");

            sentence.load_design = getLoadDesign(metric.load_design.load_variants);
            sentence.resilience_design = getResilienceDesign(metric.resilience_design.resilience_variants);


            let descriptionWhatIf = getWhatIfDescription(metric.what_if_mode, words.audience, metric.load_design, metric.resilience_design, sentence.load_design, sentence.resilience_design, words.audience);

            if(descriptionSpeakers === null
                || descriptionMessage === null) {
                continue;
            }
            else if(descriptionAudience === null) {
                let descriptionList = [];
                if(descriptionSpeakers !== "") {
                    descriptionList.push(descriptionSpeakers);
                }
                if(descriptionMessage !== "") {
                    descriptionList.push(descriptionMessage);
                }
                let attachment = metric.attachment === "" ? "": " " + metric.attachment;
                sentence.description = descriptionList.join(" ") + attachment + " " + descriptionWhatIf + "?";
            }
            else {
                let descriptionList = [];
                if(descriptionSpeakers !== "") {
                    descriptionList.push(descriptionSpeakers);
                }
                if(descriptionMessage !== "") {
                    descriptionList.push(descriptionMessage);
                }
                if(descriptionAudience !== "") {
                    descriptionList.push(descriptionAudience);
                }
                let attachment = metric.attachment === "" ? "": " " + metric.attachment;
                sentence.description = descriptionList.join(" ") + attachment + " " + descriptionWhatIf + "?";
            }

            scenarioArray.push(sentence);
        }
        return scenarioArray;
    }

    const generateMonitoringScenarios = (words) => {

        let scenarioArray = [];
        for (const metric of allMonitoringMetrics) {
            let sentence = {
                description: "",
                metric: metric.metric,
                expected: null,
                load_design: null,
                resilience_design: null
            };
            let descriptionSpeakers = replacePlaceholders(metric.speakers, words.speakers, "speakers");
            let descriptionMessage = replacePlaceholders(metric.message, words.message, "message")
            let descriptionAudience = replacePlaceholders(metric.audience, words.audience, "audience");

            if(descriptionSpeakers === null
                || descriptionMessage === null) {
                continue;
            }
            else if(descriptionAudience === null) {
                let descriptionList = [];
                if(descriptionSpeakers !== "") {
                    descriptionList.push(descriptionSpeakers);
                }
                if(descriptionMessage !== "") {
                    descriptionList.push(descriptionMessage);
                }
                let attachment = metric.attachment === "" ? "": " " + metric.attachment;
                sentence.description = descriptionList.join(" ") + attachment + "?";
            }
            else {
                let descriptionList = [];
                if(descriptionSpeakers !== "") {
                    descriptionList.push(descriptionSpeakers);
                }
                if(descriptionMessage !== "") {
                    descriptionList.push(descriptionMessage);
                }
                if(descriptionAudience !== "") {
                    descriptionList.push(descriptionAudience);
                }
                let attachment = metric.attachment === "" ? "": " " + metric.attachment;
                sentence.description = descriptionList.join(" ") + attachment + "?";
            }

            scenarioArray.push(sentence);
        }
        return scenarioArray;
    }

    const replacePlaceholders = (sentencePart, words, part, whatIfDescription) => {

        const placeholderRegex = /\[(.*?)\]/g;

        let result = sentencePart.description.replace(placeholderRegex, (match, placeholder) => {
            if (words.some(item => fitsIn(item.type, placeholder))) {
                if(part === "speakers") {
                    const examiningElements = words;
                    if(areValidElementsForDescription(examiningElements, sentencePart.number_actor)) {
                        let replacingStringList = [];
                        for (let examiningElement of examiningElements) {
                            let elementName = examiningElement.name;
                            if (examiningElement.is_proper_noun === true) {
                                elementName = toTitleCase(elementName);
                            }
                            else if(sentencePart.number_actor === "plural"
                                && examiningElement.number === "singular"
                                && examiningElement.is_proper_noun === false) {
                                elementName = pluralize(elementName);
                            }
                            else if (examiningElement.type === "person"
                                && examiningElement.is_proper_noun === false
                                && examiningElement.number === "singular") {
                                elementName = indefinite(elementName);
                            }
                            replacingStringList.push(elementName);
                        }
                        return replacingStringList.join(" ");
                    }
                }
                else if(part === "message") {
                    if(placeholder === "verb") {
                        let verb = words[0];
                        if(sentencePart.form_verb === "infinitive") {
                            return compromise(verb.name).verbs().toInfinitive().out("text");
                        }
                        else if(sentencePart.form_verb === "gerund") {
                            return compromise(verb.name).verbs().toGerund().out("text").replace(/^(is |am |are |was |were )?/, '');
                        }
                    }
                    else if(placeholder === "work object") {
                        let examiningElements = words.slice(1);
                        if(areValidElementsForDescription(examiningElements, sentencePart.number_work_object)) {
                            let replacingStringList = [];
                            for (let examiningElement of examiningElements) {
                                let elementName = examiningElement.name;
                                if (examiningElement.is_proper_noun === true) {
                                    elementName = toTitleCase(elementName);
                                }
                                if(sentencePart.number_work_object === "plural" && examiningElement.number === "singular") {
                                    replacingStringList.push(pluralize(elementName));
                                }
                                else {
                                    replacingStringList.push(elementName);
                                }
                            }
                            return replacingStringList.join(" ");
                        }
                    }
                }
                else if(part === "audience") {
                    if(placeholder === "preposition") {
                        return words[0].name;
                    }
                    else if(placeholder === "actor" || placeholder === "system") {
                        let examiningElements = words.slice(1);
                        if(areValidElementsForDescription(examiningElements, sentencePart.number_actor)) {
                            let replacingStringList = [];
                            for (let examiningElement of examiningElements) {
                                let elementName = examiningElement.name;
                                if (examiningElement.is_proper_noun === true) {
                                    elementName = toTitleCase(elementName);
                                }
                                else if (examiningElement.type === "person" || examiningElement.type === "system" && examiningElement.is_proper_noun === false) {
                                    elementName = "the " + elementName;
                                }
                                if(sentencePart.number_actor === "plural" && examiningElement.number === "singular" && examiningElement.is_proper_noun === false) {
                                    replacingStringList.push(pluralize(elementName));
                                }
                                else {
                                    replacingStringList.push(elementName);
                                }
                            }
                            return replacingStringList.join(" ");
                        }
                    }
                }
                else if(part === "load" || part === "resilience") {
                    if(placeholder === "system") {
                        let examiningElements = words.slice(1);
                        if(areValidElementsForDescription(examiningElements, sentencePart.number_actor)) {
                            let replacingStringList = [];
                            for (let examiningElement of examiningElements) {
                                let elementName = examiningElement.name;
                                if (examiningElement.is_proper_noun === true) {
                                    elementName = toTitleCase(elementName);
                                }
                                else if (examiningElement.type === "person" || examiningElement.type === "system" && examiningElement.is_proper_noun === false) {
                                    elementName = "the " + elementName;
                                }
                                if(sentencePart.number_actor === "plural" && examiningElement.number === "singular" && examiningElement.is_proper_noun === false) {
                                    replacingStringList.push(pluralize(elementName));
                                }
                                else {
                                    replacingStringList.push(elementName);
                                }
                            }
                            return replacingStringList.join(" ");
                        }
                    }
                }
            }
            else if(part === "load" || part === "resilience") {
                if(placeholder === "system") {
                    let examiningElements = words.slice(1);
                    if (areValidElementsForDescription(examiningElements, sentencePart.number_actor)) {
                        let replacingStringList = [];
                        for (let examiningElement of examiningElements) {
                            let elementName = examiningElement.name;
                            if (examiningElement.is_proper_noun === true) {
                                elementName = toTitleCase(elementName);
                            } else if (examiningElement.type === "person" || examiningElement.type === "system" && examiningElement.is_proper_noun === false) {
                                elementName = "the " + elementName;
                            }
                            if (sentencePart.number_actor === "plural" && examiningElement.number === "singular" && examiningElement.is_proper_noun === false) {
                                replacingStringList.push(pluralize(elementName));
                            } else {
                                replacingStringList.push(elementName);
                            }
                        }
                        return replacingStringList.join(" ");
                    }
                }
                else if(placeholder === "load" || placeholder === "resilience") {
                    return whatIfDescription;
                }
            }

            return null;
        });
        if(result.includes("null")) {
            return null;
        }
        return result;
    }

    const fitsIn = (type, placeHolder) => {
        if(placeHolder === "actor") {
            return type === "person" || type === "system";
        }
        else {
            return type === placeHolder;
        }
    }

    const areValidElementsForDescription = (examiningElements, condition) => {
        for (const examiningElement of examiningElements) {
            if(examiningElement.type === "person" || examiningElement.type === "system" || examiningElement.type === "work object") {
                if(!(condition === examiningElement.number || examiningElement.change_allowed)) {
                    return false;
                }
            }
        }

        return true;
    }

    const toTitleCase = (str) => {
        return str.toLowerCase().replace(/(?:^|\s|-)\w/g, function(match) {
            return match.toUpperCase();
        });
    }

    const getLoadDesign = (loadDesignArray) => {
        let loadVariantString = loadDesignArray[Math.floor(Math.random() * loadDesignArray.length)];
        let numberLoadVariant;
        const allLoadDesigns = scenarioSpecs.load_design;
        if(loadVariantString === "load peak") {
            numberLoadVariant = 1;
        }
        else if(loadVariantString === "load increase") {
            numberLoadVariant = 2;
        }
        else if(loadVariantString === "constant load") {
            numberLoadVariant = 3;
        }
        else {
            return null;
        }
        let loadVariant = {name: allLoadDesigns[numberLoadVariant].name, design_parameters: []};
        for (const designParameter of allLoadDesigns[numberLoadVariant].design_parameters) {
            let numberOfValues = designParameter.values.length;
            let randomValue = Math.floor(Math.random() * numberOfValues);
            loadVariant.design_parameters.push({name: designParameter.name, value: designParameter.values[randomValue]});
        }
        return loadVariant;
    }

    const getResilienceDesign = (resilienceDesignArray) => {
        let resilienceVariantString = resilienceDesignArray[Math.floor(Math.random() * resilienceDesignArray.length)];
        let numberResilienceVariant;
        const allResilienceDesings = scenarioSpecs.resilience_design;
        if(resilienceVariantString === "failed request") {
            numberResilienceVariant = 1;
        }
        else if(resilienceVariantString === "late response") {
            numberResilienceVariant = 2;
        }
        else if(resilienceVariantString === "unavailable") {
            numberResilienceVariant = 3;
        }
        else {
            return null;
        }
        let resilienceVariant = {name: allResilienceDesings[numberResilienceVariant].name, design_parameters: []};
        for (const designParameter of allResilienceDesings[numberResilienceVariant].design_parameters) {
            let numberOfValues = designParameter.values.length;
            let randomValue = Math.floor(Math.random() * numberOfValues);
            resilienceVariant.design_parameters.push({name: designParameter.name, value: designParameter.values[randomValue]});
        }
        return resilienceVariant;
    }

    const getWhatIfDescription = (mode, audience, loadDescriptionToReplace, resilienceDescriptionToReplace, loadDesign, resilienceDesign) => {

        if(mode === "load") {
            let loadVariantWithPlaceholder = scenarioSpecs.load_design.find(loadVariant => loadVariant.name === loadDesign.name);
            let loadDescription = replaceWhatIfDescription(loadVariantWithPlaceholder, loadDesign);
            loadDescriptionToReplace = replacePlaceholders(loadDescriptionToReplace, audience, 'load', loadDescription);
            if (resilienceDesign === null) {
                return loadDescriptionToReplace;
            }
            let resilienceVariantWithPlaceholder = scenarioSpecs.resilience_design.find(resilienceVariant => resilienceVariant.name === resilienceDesign.name);
            let resilienceDescription = replaceWhatIfDescription(resilienceVariantWithPlaceholder, resilienceDesign);
            resilienceDescriptionToReplace = replacePlaceholders(resilienceDescriptionToReplace, audience, 'resilience', resilienceDescription);
            return loadDescriptionToReplace + " " + resilienceDescriptionToReplace;
        }
        else if(mode === "resilience") {
            let resilienceVariantWithPlaceholder = scenarioSpecs.resilience_design.find(resilienceVariant => resilienceVariant.name === resilienceDesign.name);
            let resilienceDescription = replaceWhatIfDescription(resilienceVariantWithPlaceholder, resilienceDesign);
            resilienceDescriptionToReplace = replacePlaceholders(resilienceDescriptionToReplace, audience, 'resilience', resilienceDescription);
            if (loadDesign === null) {
                return resilienceDescriptionToReplace;
            }
            let loadVariantWithPlaceholder = scenarioSpecs.load_design.find(loadVariant => loadVariant.name === loadDesign.name);
            let loadDescription = replaceWhatIfDescription(loadVariantWithPlaceholder, loadDesign);
            loadDescriptionToReplace = replacePlaceholders(loadDescriptionToReplace, audience, 'load', loadDescription);
            return resilienceDescriptionToReplace + " " + loadDescriptionToReplace;
        }
        return null;
    }

    const replaceWhatIfDescription = (whatIfVariant, whatIfDesign) => {
        let resultDescription = deepCopy(whatIfVariant.variant_placeholder);
        const placeholderRegex = /\[(.*?)\]/g;

        resultDescription = resultDescription.replace(placeholderRegex, (match, placeholder) => {
            for (let index in whatIfVariant.design_parameters) {
                if(whatIfVariant.design_parameters[index].param_placeholder === match) {
                    let value = whatIfVariant.design_parameters[index].values.find(value => value.name === whatIfDesign.design_parameters[index].value.name);
                    return value.placeholder_value;
                }
            }
            return null;
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
            if(whatIfDesign.design_parameters[0].value.name === "Once") {
                return resultDescription + " " + whatIfName;
            }
            else {
                return resultDescription + " " + pluralize(whatIfName);
            }
        }
        return null;

    }
    
    const allWhatIfMetrics = whatIfMetrics.metrics;
    const allMonitoringMetrics = monitoringMetrics.metrics;

    if(mode === "What if") {
        return generateWhatIfScenarios(wordArray);
    }
    else {
        return generateMonitoringScenarios(wordArray);
    }

}