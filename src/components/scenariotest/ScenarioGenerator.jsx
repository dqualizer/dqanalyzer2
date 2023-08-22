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
                description: "",
                metric: metric.metric,
                expected: null,
                load_design: null,
                resilience_design: null,
                what_if_mode: metric.what_if_mode
            };
            let descriptionSpeakers = replacePlaceholders(metric.speakers, words.speakers, "speakers");
            let descriptionMessage = replacePlaceholders(metric.message, words.message, "message")
            let descriptionAudience = replacePlaceholders(metric.audience, words.audience, "audience");

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
            sentence.description_load = replacePlaceholders(metric.load_design, words.audience, "load");
            sentence.description_resilience = replacePlaceholders(metric.resilience_design, words.audience, "resilience");

            sentence.description = SentenceBuilder(sentence, "What if");

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

            sentence.description_speakers = descriptionSpeakers;
            sentence.description_message = descriptionMessage;
            sentence.description_audience = descriptionAudience;
            sentence.attachment = metric.attachment;

            sentence.description = SentenceBuilder(sentence, "Monitoring");

            scenarioArray.push(sentence);
        }
        return scenarioArray;
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