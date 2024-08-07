import "@/data/monitoring-metrics.json";
import "@/data/what-if-metrics.json";
import scenarioSpecs from "../../data/scenariotest-specs.json";
import RqsBuilderService from "./RqsBuilderService.jsx";

export default function ScenarioGenerator(mode, wordArray) {
  const generateRqs = (words, mode, metrics) => {
    const rqsArray = [];
    for (const metric of metrics) {
      const rqs = {
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

      if (mode === "What if") {
        rqs.load_design = getLoadDesign(metric.load_design.load_variants);
        rqs.resilience_design = getResilienceDesign(
          metric.resilience_design.resilience_variants,
        );
      }

      rqs.description = RqsBuilderService(rqs, mode);

      if (rqs.description === null) {
        continue;
      }
      rqsArray.push(rqs);
    }
    return rqsArray;
  };

  const chooseOptionOrExpected = (allOptions) => {
    if (allOptions == null) {
      return null;
    } else {
      const randomIndex = Math.floor(Math.random() * allOptions.length);
      return allOptions[randomIndex];
    }
  };

  const getLoadDesign = (loadDesignArray) => {
    const loadVariantString =
      loadDesignArray[Math.floor(Math.random() * loadDesignArray.length)];
    let numberLoadVariant;
    const allLoadDesigns = scenarioSpecs.load_design;
    if (loadVariantString === "load peak") {
      numberLoadVariant = 1;
    } else if (loadVariantString === "load increase") {
      numberLoadVariant = 2;
    } else if (loadVariantString === "constant load") {
      numberLoadVariant = 3;
    } else {
      return null;
    }
    const loadVariant = {
      name: allLoadDesigns[numberLoadVariant].name,
      design_parameters: [],
    };
    for (const designParameter of allLoadDesigns[numberLoadVariant]
      .design_parameters) {
      const numberOfValues = designParameter.values.length;
      const randomValue = Math.floor(Math.random() * numberOfValues);
      loadVariant.design_parameters.push({
        name: designParameter.name,
        value: designParameter.values[randomValue],
      });
    }
    return loadVariant;
  };

  const getResilienceDesign = (resilienceDesignArray) => {
    const resilienceVariantString =
      resilienceDesignArray[
        Math.floor(Math.random() * resilienceDesignArray.length)
      ];
    let numberResilienceVariant;
    const allResilienceDesings = scenarioSpecs.resilience_design;
    if (resilienceVariantString === "failed request") {
      numberResilienceVariant = 1;
    } else if (resilienceVariantString === "late response") {
      numberResilienceVariant = 2;
    } else if (resilienceVariantString === "unavailable") {
      numberResilienceVariant = 3;
    } else {
      return null;
    }
    const resilienceVariant = {
      name: allResilienceDesings[numberResilienceVariant].name,
      design_parameters: [],
    };
    for (const designParameter of allResilienceDesings[numberResilienceVariant]
      .design_parameters) {
      const numberOfValues = designParameter.values.length;
      const randomValue = Math.floor(Math.random() * numberOfValues);
      resilienceVariant.design_parameters.push({
        name: designParameter.name,
        value: designParameter.values[randomValue],
      });
    }
    return resilienceVariant;
  };

  const allWhatIfMetrics = whatIfMetrics.metrics;
  const allMonitoringMetrics = monitoringMetrics.metrics;

  if (mode === "What if") {
    return generateRqs(wordArray, mode, allWhatIfMetrics);
  } else if (mode === "Monitoring") {
    return generateRqs(wordArray, mode, allMonitoringMetrics);
  }
  return null;
}
