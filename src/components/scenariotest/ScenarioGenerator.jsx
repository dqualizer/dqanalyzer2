import * as whatIfMetrics from "../../data/what-if-metrics.json";
import * as monitoringMetrics from "../../data/monitoring-metrics.json";
import pluralize from "pluralize";
import compromise from "compromise";
import indefinite from "indefinite";
import deepCopy from "./deepCopy.jsx";
import scenarioSpecs from "../../data/scenariotest-specs.json";
import SentenceBuilder from "./SentenceBuilder.jsx";
import replacePlaceholders from "./replacePlaceholders.jsx";

export default function ScenarioGenerator(mode, wordArray) {

    const generateWhatIfScenarios = (words) => {

        let scenarioArray = [];
        for (const metric of allWhatIfMetrics) {
            let sentence = {
                metric: metric.metric,
                all_expected: metric.expected,
                what_if_mode: metric.what_if_mode
            };
            sentence.expected = getExpected(metric.expected);

            let descriptionSpeakers = replacePlaceholders(metric.speakers, words.speakers, "speakers", sentence.expected);
            let descriptionMessage = replacePlaceholders(metric.message, words.message, "message", sentence.expected)
            let descriptionAudience = replacePlaceholders(metric.audience, words.audience, "audience", sentence.expected);

            sentence.load_design = getLoadDesign(metric.load_design.load_variants);
            sentence.resilience_design = getResilienceDesign(metric.resilience_design.resilience_variants);

            if(descriptionSpeakers === null
                || descriptionMessage === null) {
                continue;
            }

            sentence.description_speakers = descriptionSpeakers;
            sentence.description_message = descriptionMessage;
            sentence.description_audience = descriptionAudience;
            sentence.attachment = metric.attachment;
            sentence.description_load = replacePlaceholders(metric.load_design, words.audience, "load", sentence.expected);
            sentence.description_resilience = replacePlaceholders(metric.resilience_design, words.audience, "resilience", sentence.expected);

            sentence.description = SentenceBuilder(sentence, "What if");

            if(sentence.description === null) {
                continue;
            }

            scenarioArray.push(sentence);
        }
        return scenarioArray;
    }

    const generateMonitoringScenarios = (words) => {

        let scenarioArray = [];
        for (const metric of allMonitoringMetrics) {
            let sentence = {
                metric: metric.metric,
                all_expected: metric.expected,
                load_design: null,
                resilience_design: null
            };
            sentence.expected = getExpected(metric.expected);

            let descriptionSpeakers = replacePlaceholders(metric.speakers, words.speakers, "speakers", sentence.expected);
            let descriptionMessage = replacePlaceholders(metric.message, words.message, "message", sentence.expected);
            let descriptionAudience = replacePlaceholders(metric.audience, words.audience, "audience", sentence.expected);


            if(descriptionSpeakers === null
                || descriptionMessage === null
                || (descriptionSpeakers === ""
                && descriptionMessage === ""
                && descriptionAudience === null)){
                continue;
            }

            sentence.description_speakers = descriptionSpeakers;
            sentence.description_message = descriptionMessage;
            sentence.description_audience = descriptionAudience;
            sentence.attachment = metric.attachment;

            sentence.description = SentenceBuilder(sentence, "Monitoring");

            scenarioArray.push(sentence);
        }
        return scenarioArray;
    }

    const getExpected = (allExpected) => {
        if(allExpected == null) {
            return null;
        }
        else {
            let randomIndex = Math.floor(Math.random() * allExpected.length);
            return allExpected[randomIndex];
        }
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
    
    const allWhatIfMetrics = whatIfMetrics.metrics;
    const allMonitoringMetrics = monitoringMetrics.metrics;

    if(mode === "What if") {
        return generateWhatIfScenarios(wordArray);
    }
    else {
        return generateMonitoringScenarios(wordArray);
    }

}