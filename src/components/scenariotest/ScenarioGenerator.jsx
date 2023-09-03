import * as whatIfMetrics from "../../data/what-if-metrics.json";
import * as monitoringMetrics from "../../data/monitoring-metrics.json";
import pluralize from "pluralize";
import compromise from "compromise";
import indefinite from "indefinite";
import deepCopy from "./deepCopy.jsx";
import scenarioSpecs from "../../data/scenariotest-specs.json";
import RqsBuilderService from "./RqsBuilderService.jsx";
import replacePlaceholders from "./replacePlaceholders.jsx";

export default function ScenarioGenerator(mode, wordArray) {

    const generateRqs = (words, mode, metrics) => {

        let rqsArray = [];
        for (const metric of metrics) {
            let rqs = {
                metric: metric.metric,
                all_options: metric.options,
                all_expected: metric.expected,
                load_design: null,
                resilience_design: null,
                metric_load: metric.load_design,
                metric_resilience: metric.resilience_design,
            };
            rqs.options = chooseOptionOrExpected(metric.options);
            rqs.expected = chooseOptionOrExpected(metric.expected);

            rqs.mandatory = metric.mandatory;
            rqs.optional = metric.optional;
            rqs.attachment = metric.attachment;
            rqs.words = words;

            if(mode === "What if") {
                rqs.load_design = getLoadDesign(metric.load_design.load_variants);
                rqs.resilience_design = getResilienceDesign(metric.resilience_design.resilience_variants);
            }

            rqs.description = RqsBuilderService(rqs, mode);

            if(rqs.description === null) {
                continue;
            }
            rqsArray.push(rqs);
        }
        return rqsArray;
    }

    const chooseOptionOrExpected = (allOptions) => {
        if(allOptions == null) {
            return null;
        }
        else {
            let randomIndex = Math.floor(Math.random() * allOptions.length);
            return allOptions[randomIndex];
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
        return generateRqs(wordArray, mode, allWhatIfMetrics);
    }
    else if(mode === "Monitoring") {
        return generateRqs(wordArray, mode, allMonitoringMetrics);
    }
    return null;
}