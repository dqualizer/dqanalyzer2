import ActivityParser from "./ActivityParser.jsx";
import ScenarioGenerator from "./ScenarioGenerator.jsx";
import ScenariosToFileWriter from "./ScenariosToFileWriter.jsx";
import * as mapping from '../../data/werkstatt-en.json';
import deepCopy from "./deepCopy.jsx";

class ScenarioService {
    colorActiveActivities(event, reactFlowInstance) {
        let relatedEdgesArray = reactFlowInstance.getEdges().filter((edge) => edge.name === event.target.value);
        let unrelatedEdgesArray = reactFlowInstance.getEdges().filter((edge) => edge.name !== event.target.value);

        unrelatedEdgesArray.forEach((edge) => {
            edge.selected = false;
        })

        relatedEdgesArray.forEach((edge) => {
            edge.selected = true;
        })

        let newEdgesArray = relatedEdgesArray.concat(unrelatedEdgesArray);

        // updates reactFlowInstance
        reactFlowInstance.setEdges(newEdgesArray);
    }

    setAttributesForActivityChange(scenario, selectedActivity, isValidActivity) {
        // set attributes for scenario
        scenario.activity = selectedActivity;
        scenario.isValid = isValidActivity;

        // reset other attributes of scenario
        scenario.generatedScenariosList = null;
        scenario.filteredScenariosList = null;
        scenario.selected_mode = null;
        scenario.description = null;
        scenario.metric = null;
        scenario.expected = null;
        scenario.load_design = null;
        scenario.resilience_design = null;
        scenario.load_decision = null;
        scenario.resilience_decision = null;
        scenario.description_speakers = null;
        scenario.description_message = null;
        scenario.description_audience = null;
        scenario.attachment = null;
        scenario.description_load = null;
        scenario.description_resilience = null;
        scenario.what_if_mode = null;
        scenario.saved_load_design = null;
        scenario.saved_resilience_design = null;
        scenario.saved_resilience_design = null;
        scenario.all_expected = null;
    }

    getScenariosForActivityAndMode = (activity, mode, nodes, edges) => {
        let wordArray = ActivityParser(nodes, edges, activity);

        let generatedSentences = ScenarioGenerator(mode, wordArray);

        ScenariosToFileWriter(generatedSentences);

        return generatedSentences;
    }

    setAttributesForModeChange(scenario, selectedMode, scenarioListForActivityAndMode) {
        scenario.selected_mode = selectedMode;
        scenario.generatedScenariosList = scenarioListForActivityAndMode;
        scenario.filteredScenariosList = scenarioListForActivityAndMode;

        scenario.description = null;
        scenario.metric = null;
        scenario.expected = null;
        scenario.load_design = null;
        scenario.resilience_design = null;
        scenario.load_decision = null;
        scenario.resilience_decision = null;
        scenario.description_speakers = null;
        scenario.description_message = null;
        scenario.description_audience = null;
        scenario.attachment = null;
        scenario.description_load = null;
        scenario.description_resilience = null;
        scenario.what_if_mode = null;
        scenario.saved_load_design = null;
        scenario.saved_resilience_design = null;
        scenario.all_expected = null;
    }

    setAttributesForScenarioChange(scenario, selectedScenario) {
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
        scenario.all_expected = selectedScenario.all_expected;
    }

    deleteDesignparametersFromVariant(scenario, newVariant) {
        if (newVariant.name === "None") {
            newVariant = null;
        } else {
            newVariant.design_parameters.forEach((parameter) => {
                delete parameter.values;
                parameter.value = null;
            });
        }
    }

    saveNewDesign(scenario, newVariant, isLoad) {
        if (isLoad) {
            scenario.load_design = newVariant;
        } else {
            scenario.resilience_design = newVariant;
        }
    }


    isActivityViewInvalid(isDisabled, allDefinedScenarios) {
        for (const scenario of allDefinedScenarios) {
            if (scenario.activity === null
                || scenario.selected_mode === null
                || scenario.description === null
                || (scenario.selected_mode === "What if"
                    && (scenario.load_decision === null
                        || scenario.resilience_decision === null)) //TODO: add scenario.metric
                || scenario.isValid === null
                || scenario.isValid === false) {
                isDisabled = true;
            }
            else if(scenario.selected_mode === "What if" && (scenario.load_design?.design_parameters.find(param => param.value === null)
                || scenario.resilience_design?.design_parameters.find(param => param.value === null))) {
                isDisabled = true;
            }
        }

        return isDisabled;
    }

    isSettingsViewInvalid(isDisabled, accuracy, enviroment, timeSlot) {
        if (accuracy === null
            || enviroment === null
            || (enviroment === "Test" && timeSlot === null)) {
            isDisabled = true;
        }
        return isDisabled;
    }

    createScenarioTest(allDefinedScenarios, accuracy, enviroment, timeSlot) {
        let rqa = {
            context: mapping.context,
            scenarios: [],
            settings: {
                accuracy: 0,
                environment: null,
                time_slot: null
            }
        }

        for (const definedScenario of allDefinedScenarios) {
            let rqaScenario = {
                activity: definedScenario.activity,
                mode: definedScenario.selected_mode,
                description: definedScenario.description,
                metric: definedScenario.metric,
                expected: definedScenario.expected,
                load_design: definedScenario.load_design,
                resilience_design: definedScenario.resilience_design
            };
            rqaScenario.load_design?.design_parameters?.forEach(param => delete param.value.placeholder_value);
            rqaScenario.resilience_design?.design_parameters?.forEach(param => delete param.value.placeholder_value);
            rqa.scenarios.push(rqaScenario);
        }
        rqa.settings.accuracy = accuracy;
        rqa.settings.environment = enviroment;
        rqa.settings.time_slot = timeSlot;

        return rqa;
    }
}

export default new ScenarioService();
