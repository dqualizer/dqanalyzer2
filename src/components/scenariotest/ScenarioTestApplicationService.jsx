import ScenarioService from "./ScenarioService.jsx";
import ActivityParser from "./ActivityParser.jsx";
import ActivityValidator from "./ActivityValidator.jsx";
import deepCopy from "./deepCopy.jsx";
import RqsBuilderService from "./RqsBuilderService.jsx";
import axios from "axios";
import ScenarioDescriptionFormatter from "./ScenarioDescriptionFormatter.jsx";

class ScenarioTestApplicationService {

    handleActivityChange(event, reactFlowInstance, selectedActivity, scenario, nodes, edges) {
        // update the view for the selected edge
        ScenarioService.colorActiveActivities(event, reactFlowInstance);

        // validate activity
        let wordArray = ActivityParser(nodes, edges, selectedActivity);
        let isValidActivity = ActivityValidator(wordArray);

        ScenarioService.setAttributesForActivityChange(scenario, selectedActivity, isValidActivity);
    }

    handleModeChange(scenario, selectedMode, nodes, edges) {
        let scenarioListForActivityAndMode = ScenarioService.getRqsForActivityAndMode(scenario.activity, selectedMode, nodes, edges);
        ScenarioService.setAttributesForModeChange(scenario, selectedMode, scenarioListForActivityAndMode);
    }

    handleScenarioChange(scenario, selectedScenario) {
        ScenarioService.setAttributesForScenarioChange(scenario, selectedScenario);

        document.getElementById("search-input").value = "";
    }

    setDesignChange(scenario, newVariant, isLoad) {
        ScenarioService.deleteDesignparametersFromVariant(scenario, newVariant);

        ScenarioService.saveNewDesign(scenario, newVariant, isLoad);
    }

    filterScenarios(scenario, inputText) {
        let allScenarios = deepCopy(scenario.generatedScenariosList);
        scenario.filteredScenariosList = allScenarios.filter(isShownScenario =>
            isShownScenario.description.toLowerCase().includes(inputText.toLowerCase())
        );
    }

    handleDecisionChange(scenario, decision, isLoad) {
        if (isLoad) {
            scenario.load_decision = decision;
            if (decision === "No") {
                scenario.load_design = scenario.saved_load_design;
                scenario.description = RqsBuilderService(scenario, scenario.selected_mode);
            }
        } else {
            scenario.resilience_decision = decision;
            if (decision === "No") {
                scenario.resilience_design = scenario.saved_resilience_design;
                scenario.description = RqsBuilderService(scenario, scenario.selected_mode);
            }
        }
    }

    handleDesignParameterChange(scenario, paramIndex, value, isLoad) {
        if (isLoad) {
            let copyDesignParameter = deepCopy(scenario.load_design.design_parameters[paramIndex]);
            copyDesignParameter.value = value;

            scenario.load_design.design_parameters[paramIndex] = copyDesignParameter;
        } else {
            let copyDesignParameter = deepCopy(scenario.resilience_design.design_parameters[paramIndex]);
            copyDesignParameter.value = value;

            scenario.resilience_design.design_parameters[paramIndex] = copyDesignParameter;
        }
        scenario.description = RqsBuilderService(scenario, scenario.selected_mode);
    }

    handleExpectedChange(scenario, responseParameter) {
        scenario.expected = responseParameter;

        scenario.description = RqsBuilderService(scenario, scenario.selected_mode);
    }

    addScenario(newScenarioList) {
        let newScenario = {
            "activity": null,
            "selected_mode": null,
            "generatedScenariosList": null,
            "filteredScenariosList": null,
            "description": null,
            "load_decision": null,
            "load_design": null,
            "resilience_decision": null,
            "resilience_design": null,
            "metric": null,
            "expected": null,
            "isValid": null
        };
        newScenarioList.push(newScenario);
    }

    isAddingButtonDisabled(allDefinedScenarios, accuracy, enviroment, timeSlot) {
        let isDisabled = false;

        isDisabled = ScenarioService.isActivityViewInvalid(isDisabled, allDefinedScenarios);
        isDisabled = ScenarioService.isSettingsViewInvalid(isDisabled, accuracy, enviroment, timeSlot);

        return isDisabled;
    }

    addScenarioTest(allDefinedScenarios, accuracy, enviroment, timeSlot, setScenarioExplorerShow, setScenarioTestShow) {
        let rqa = ScenarioService.createScenarioTest(allDefinedScenarios, accuracy, enviroment, timeSlot);

        // post the RQA to the axios api
        axios.post(`https://64bbef8f7b33a35a4446d353.mockapi.io/dqualizer/scenarios/v1/scenarios`, rqa);

        // close the Scenario Test Window and open the Scenario Explorer
        setScenarioExplorerShow(true);
        setScenarioTestShow(false);
    }

    isAllActivitiesButtonDiasabled(allDefinedScenarios) {
        let isDisabled = false;
        for (let scenario of allDefinedScenarios) {
            if (scenario.activity !== null) {
                isDisabled = true;
            }
        }
        if (allDefinedScenarios.length > 1) {
            isDisabled = true;
        }

        return isDisabled;
    }

    generateScenariosForAllActivities(uniqueActivitys, allActivities, nodes, edges) {
        let scenariosForAllActivities = [];
        for (let activity of uniqueActivitys) {
            let activityEdges = allActivities.find((artifact) => artifact.description === activity.name);

            // validate activity
            let wordArray = ActivityParser(nodes, edges, activityEdges);
            let isValidActivity = ActivityValidator(wordArray);
            if (!isValidActivity) {
                continue;
            }
            let allWhatIfScenariosForActivity = ScenarioService.getRqsForActivityAndMode(activityEdges, "What if", nodes, edges);
            let allMonitoringScenariosForActivity = ScenarioService.getRqsForActivityAndMode(activityEdges, "Monitoring", nodes, edges);

            for (let whatIfScenario of allWhatIfScenariosForActivity) {
                scenariosForAllActivities.push(
                    {
                        "activity": activityEdges,
                        "selected_mode": "What if",
                        "generatedScenariosList": allWhatIfScenariosForActivity,
                        "filteredScenariosList": null,
                        "description": whatIfScenario.description,
                        "load_decision": null,
                        "load_design": whatIfScenario.load_design,
                        "resilience_decision": null,
                        "resilience_design": whatIfScenario.resilience_design,
                        "metric": whatIfScenario.metric,
                        "expected": whatIfScenario.expected,
                        "isValid": true,
                        "description_speakers": whatIfScenario.description_speakers,
                        "description_message": whatIfScenario.description_message,
                        "description_audience": whatIfScenario.description_audience,
                        "attachment": whatIfScenario.attachment,
                        "description_load": whatIfScenario.description_load,
                        "description_resilience": whatIfScenario.description_resilience,
                        "what_if_mode": whatIfScenario.what_if_mode,
                        "saved_load_design": whatIfScenario.saved_load_design,
                        "saved_resilience_design": whatIfScenario.saved_resilience_design,
                        "all_expected": whatIfScenario.all_expected,
                        "metric_load": whatIfScenario.metric_load,
                        "metric_resilience": whatIfScenario.metric_resilience,
                        "mandatory": whatIfScenario.mandatory,
                        "optional": whatIfScenario.optional,
                        "words": whatIfScenario.words,
                    }
                )
            }

            for (let monitoringScenario of allMonitoringScenariosForActivity) {
                scenariosForAllActivities.push(
                    {
                        "activity": activityEdges,
                        "selected_mode": "Monitoring",
                        "generatedScenariosList": allMonitoringScenariosForActivity,
                        "filteredScenariosList": null,
                        "description": monitoringScenario.description,
                        "load_decision": null,
                        "load_design": monitoringScenario.load_design,
                        "resilience_decision": null,
                        "resilience_design": monitoringScenario.resilience_design,
                        "metric": monitoringScenario.metric,
                        "expected": monitoringScenario.expected,
                        "isValid": true,
                        "description_speakers": monitoringScenario.description_speakers,
                        "description_message": monitoringScenario.description_message,
                        "description_audience": monitoringScenario.description_audience,
                        "attachment": monitoringScenario.attachment,
                        "description_load": monitoringScenario.description_load,
                        "description_resilience": monitoringScenario.description_resilience,
                        "what_if_mode": monitoringScenario.what_if_mode,
                        "saved_load_design": monitoringScenario.saved_load_design,
                        "saved_resilience_design": monitoringScenario.saved_resilience_design,
                        "all_expected": monitoringScenario.all_expected,
                        "metric_load": monitoringScenario.metric_load,
                        "metric_resilience": monitoringScenario.metric_resilience,
                        "mandatory": monitoringScenario.mandatory,
                        "optional": monitoringScenario.optional,
                        "words": monitoringScenario.words,
                    }
                )
            }
        }
        return scenariosForAllActivities;
    }

    handleAllActivityScenarioChange(scenario, selectedScenario) {
        scenario.activity = selectedScenario.activity;
        scenario.selected_mode = selectedScenario.selected_mode;
        scenario.description = selectedScenario.description;
        scenario.metric = selectedScenario.metric;
        scenario.expected = selectedScenario.expected;
        scenario.load_design = selectedScenario.load_design;
        scenario.resilience_design = selectedScenario.resilience_design;
        scenario.filteredScenariosList = null;
        scenario.load_decision = null;
        scenario.resilience_decision = null;
        scenario.description_speakers = selectedScenario.description_speakers;
        scenario.description_message = selectedScenario.description_message;
        scenario.description_audience = selectedScenario.description_audience;
        scenario.attachment = selectedScenario.attachment;
        scenario.description_load = selectedScenario.description_load;
        scenario.description_resilience = selectedScenario.description_resilience;
        scenario.what_if_mode = selectedScenario.what_if_mode;
        scenario.saved_load_design = selectedScenario.load_design;
        scenario.saved_resilience_design = selectedScenario.resilience_design;
        scenario.isValid = selectedScenario.isValid;
        scenario.generatedScenariosList = selectedScenario.generatedScenariosList;
        scenario.all_expected = selectedScenario.all_expected;
        scenario.metric_load = selectedScenario.metric_load;
        scenario.metric_resilience = selectedScenario.metric_resilience;
        scenario.mandatory = selectedScenario.mandatory;
        scenario.optional = selectedScenario.optional;
        scenario.words = selectedScenario.words;
    }

    filterAllScenarios(allActivityScenarios, inputText) {
        let filteredScenarios = deepCopy(allActivityScenarios);
        return filteredScenarios.filter(isShownScenario =>
            isShownScenario.description.toLowerCase().includes(inputText.toLowerCase())
        );
    }

    formatDescription(scenario) {
        return ScenarioDescriptionFormatter(scenario);
    }

    isVariantAvailable(scenario, variant, isLoad) {
        return ScenarioService.isVariantAvailable(scenario, variant, isLoad);
    }
}

export default new ScenarioTestApplicationService();