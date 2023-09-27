import React, {useEffect, useState} from 'react';
import {useReactFlow} from 'reactflow';
import * as scenarioSpecs from '../../data/scenariotest-specs.json';
import ResizeBar from '../ResizeBar.jsx';
import * as mapping from '../../data/werkstatt-en.json';
import {Tooltip} from 'react-tooltip';
import deepCopy from "./deepCopy.jsx";
import ScenarioDescriptionFormatter from "./ScenarioDescriptionFormatter.jsx";
import ScenarioTestApplicationService from "./ScenarioTestApplicationService.jsx";

export default function ScenarioTestController(props) {

    // Resize States
    const [isResizing, setIsResizing] = useState(false);
    const [sidebarWidth, setSidebarWidth] = useState(1000); // Initial width of the sidebar

    const handleMouseDown = () => {
        setIsResizing(true);
    };

    const handleMouseUp = () => {
        setIsResizing(false);
    };

    const handleMouseMove = (event) => {
        if (isResizing) {
            const newWidth = event.clientX;
            setSidebarWidth(newWidth);
        }
    };

    useEffect(() => {
        console.log("isResizing")
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing]);


    // Getting Scenario Test Definition Parameters from the Json
    const allLoadDesigns = scenarioSpecs.load_design;
    const allResilienceDesigns = scenarioSpecs.resilience_design;
    const allModes = scenarioSpecs.mode;
    const settings = scenarioSpecs.settings;

    const [allDefinedScenarios, setAllDefinedScenarios] = useState([
        {
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
        }
    ]);
    const [accuracy, setAccuracy] = useState(0);
    const [environment, setEnvironment] = useState(null);
    const [timeSlot, setTimeSlot] = useState(null);

    const [isAllActivities, setIsAllActivities] = useState(false);
    const [isActivityView, setIsActivityView] = useState(true);
    const [isDeletingContainerDisabled, setIsDeletingContainerDisabled] = useState(true);
    const [allActivityScenarios, setAllActivityScenarios] = useState([]);
    const [filteredActivityScenarios, setFilteredActivityScenarios] = useState([]);

    const allActivities = [];

    // initialize the artifacts key with the activities in the domain
    props.edges.forEach((edge) => {
        if (edge.activity !== undefined) {
            allActivities.push({
                artifact: {object: edge.system, activity: edge.activity},
                description: edge.name
            });
        }
    });

    const reactFlowInstance = useReactFlow();

    const uniqueActivitys = props.edges.filter((obj, index, self) => {
        return index === self.findIndex((t) => (t.name === obj.name));
    });

    const handleActivityChange = (event, index) => {
        let selectedActivity = allActivities.find((artifact) => artifact.description === event.target.value);
        let allDefinedScenariosCopy = deepCopy(allDefinedScenarios);
        let scenario = allDefinedScenariosCopy[index];

        ScenarioTestApplicationService.handleActivityChange(event, reactFlowInstance, selectedActivity, scenario, props.nodes, props.edges);

        setAllDefinedScenarios(allDefinedScenariosCopy);
    }

    const handleModeChange = (event, index) => {
        let selectedMode = event.target.value;
        let allDefinedScenariosCopy = deepCopy(allDefinedScenarios);
        let scenario = allDefinedScenariosCopy[index];

        ScenarioTestApplicationService.handleModeChange(scenario, selectedMode, props.nodes, props.edges);

        setAllDefinedScenarios(allDefinedScenariosCopy);
    }

    const handleScenarioChange = (selectedScenario, index) => {
        let allDefinedScenariosCopy = deepCopy(allDefinedScenarios);
        let scenario = allDefinedScenariosCopy[index];

        ScenarioTestApplicationService.handleScenarioChange(scenario, selectedScenario);

        setAllDefinedScenarios(allDefinedScenariosCopy);
    }

    const filterScenarios = (event, index) => {
        const inputText = event.target.value;
        let allDefinedScenariosCopy = deepCopy(allDefinedScenarios);
        let scenario = allDefinedScenariosCopy[index];

        ScenarioTestApplicationService.filterScenarios(scenario, inputText);

        setAllDefinedScenarios(allDefinedScenariosCopy);
    }

    const handleLoadDecisionChange = (event, index) => {
        let loadDecision = event.target.value;
        let allDefinedScenariosCopy = deepCopy(allDefinedScenarios);
        let scenario = allDefinedScenariosCopy[index];

        ScenarioTestApplicationService.handleDecisionChange(scenario, loadDecision, true);

        setAllDefinedScenarios(allDefinedScenariosCopy);
    }

    const handleResilienceDecisionChange = (event, index) => {
        let resilienceDecision = event.target.value;
        let allDefinedScenariosCopy = deepCopy(allDefinedScenarios);
        let scenario = allDefinedScenariosCopy[index];

        ScenarioTestApplicationService.handleDecisionChange(scenario, resilienceDecision, false);

        setAllDefinedScenarios(allDefinedScenariosCopy);
    }

    const handleLoadDesignChange = (event, index) => {
        let loadVariant = allLoadDesigns.find((variant) => variant.name === event.target.value);
        let copyLoadVariant = deepCopy(loadVariant);
        let allDefinedScenariosCopy = deepCopy(allDefinedScenarios);
        let scenario = allDefinedScenariosCopy[index];

        ScenarioTestApplicationService.setDesignChange(scenario, copyLoadVariant, true);

        setAllDefinedScenarios(allDefinedScenariosCopy);
    }

    const handleResilienceDesignChange = (event, index) => {
        let resilienceVariant = allResilienceDesigns.find((variant) => variant.name === event.target.value);
        let copyResilienceVariant = deepCopy(resilienceVariant);
        let allDefinedScenariosCopy = deepCopy(allDefinedScenarios);
        let scenario = allDefinedScenariosCopy[index];

        ScenarioTestApplicationService.setDesignChange(scenario, copyResilienceVariant, false);

        setAllDefinedScenarios(allDefinedScenariosCopy);
    }

    const handleLoadDesignParameterChange = (value, index, paramIndex) => {
        let allDefinedScenariosCopy = deepCopy(allDefinedScenarios);
        let scenario = allDefinedScenariosCopy[index];

        ScenarioTestApplicationService.handleDesignParameterChange(scenario, paramIndex, value, true);

        setAllDefinedScenarios(allDefinedScenariosCopy);
    }

    const handleResilienceDesignParameterChange = (value, index, paramIndex) => {
        let allDefinedScenariosCopy = deepCopy(allDefinedScenarios);
        let scenario = allDefinedScenariosCopy[index];

        ScenarioTestApplicationService.handleDesignParameterChange(scenario, paramIndex, value, false);

        setAllDefinedScenarios(allDefinedScenariosCopy);

    }

    const handleOptionsChange = (responseParameter, index) => {
        let allDefinedScenariosCopy = deepCopy(allDefinedScenarios);
        let scenario = allDefinedScenariosCopy[index];

        ScenarioTestApplicationService.handleOptionsChange(scenario, responseParameter);

        setAllDefinedScenarios(allDefinedScenariosCopy);
    }

    const handleExpectedChange = (responseParameter, index) => {
        let allDefinedScenariosCopy = deepCopy(allDefinedScenarios);
        let scenario = allDefinedScenariosCopy[index];

        ScenarioTestApplicationService.handleExpectedChange(scenario, responseParameter);

        setAllDefinedScenarios(allDefinedScenariosCopy);
    }

    const handleAccuracyChange = (event) => {
        setAccuracy(Number(event.target.value));
    }

    const handleEnvironmentChange = (event) => {
        let newEnvironment = event.target.value;

        setEnvironment(newEnvironment);
    }

    const handleTimeSlotChange = (event) => {
        let newTimeSlot = settings.timeSlot.find((time) => time.representation === event.target.value);
        setTimeSlot(newTimeSlot);
    }

    const addScenario = () => {
        let newScenarioList = deepCopy(allDefinedScenarios);
        ScenarioTestApplicationService.addScenario(newScenarioList);

        setAllDefinedScenarios(newScenarioList);
        setIsDeletingContainerDisabled(false);
    }

    const isAddingButtonDisabled = () => {
        return ScenarioTestApplicationService.isAddingButtonDisabled(allDefinedScenarios, accuracy, environment, timeSlot);
    }

    const deleteScenario = (indexToDelete) => {
        let newScenarioList = deepCopy(allDefinedScenarios);

        newScenarioList.splice(indexToDelete, 1);

        setAllDefinedScenarios(newScenarioList);
        setIsDeletingContainerDisabled(newScenarioList.length === 1);
    }

    const addScenarioTest = () => {
        ScenarioTestApplicationService.addScenarioTest(allDefinedScenarios, accuracy, environment, timeSlot, props.setScenarioExplorerShow, props.setScenarioTestShow);
    }

    const isAllActivitiesButtonDisabled = () => {
        return ScenarioTestApplicationService.isAllActivitiesButtonDiasabled(allDefinedScenarios);
    }

    const switchToAllActivities = () => {
        if (isActivityView) {
            let scenariosForAllActivities = ScenarioTestApplicationService.generateScenariosForAllActivities(uniqueActivitys, allActivities, props.nodes, props.edges);

            setIsActivityView(false);
            setIsAllActivities(true);
            setAllActivityScenarios(scenariosForAllActivities);
            setFilteredActivityScenarios(scenariosForAllActivities);

        } else {
            setIsActivityView(true);
            setIsAllActivities(false);
            setAllActivityScenarios([]);
            setFilteredActivityScenarios([]);
        }
    }

    const filterAllActivityScenarios = (event) => {
        const inputText = event.target.value;

        let result = ScenarioTestApplicationService.filterAllScenarios(allActivityScenarios, inputText);

        setFilteredActivityScenarios(result);
    }

    const handleAllActivityScenarioChange = (selectedScenario) => {
        let allDefinedScenariosCopy = deepCopy(allDefinedScenarios);
        let scenario = allDefinedScenariosCopy[0];

        ScenarioTestApplicationService.handleAllActivityScenarioChange(scenario, selectedScenario);

        setAllDefinedScenarios(allDefinedScenariosCopy);
        switchToAllActivities();
    }

    const isLoadDesignNotAvailable = (loadVariant, index) => {
        let scenario = allDefinedScenarios[index];
        return !ScenarioTestApplicationService.isVariantAvailable(scenario, loadVariant, true);
    }

    return (
        <>
            <div className="p-4 prose overflow-scroll h-full"
                 style={{width: `${sidebarWidth}px`, cursor: isResizing ? 'col-resize' : 'default'}}>
                <div style={{display: "flex"}}>
                    <h3>Scenario Test Specification</h3>

                    {isActivityView || isAllActivities ?
                        <div>
                            <button className="btn all-activities-button"
                                    disabled={isAllActivitiesButtonDisabled()}
                                    onClick={switchToAllActivities}>{isActivityView ? "All Activities" : "Activity View"}
                            </button>
                            <span className="ml-1 font-normal text-sm"
                                  data-tooltip-id="all-activities-tooltip"
                                  data-tooltip-place="right"
                                  data-tooltip-content='You can choose if you want to generate scenarios over all activities or select a specific activity.'>&#9432;</span>
                            <Tooltip id="all-activities-tooltip" style={{maxWidth: '256px'}}/>

                        </div>
                        : null}
                </div>

                {!isActivityView && isAllActivities ?
                    <div>
                        <h3>Scenarios For All Activities</h3>
                        {allActivityScenarios.length === 0 ?
                            <p className="description">You cannot search for a scenario because there are no valid
                                activities.</p>
                            :
                            <div>
                                <input type="text" id="search-input"
                                       placeholder="Search for an interesting scenario" autoComplete="off"
                                       onChange={(event) => filterAllActivityScenarios(event)}
                                       className="searchScenarioInputField"/>
                                <div className="generated-scenarios">
                                    {filteredActivityScenarios.map((filteredScenario) => {
                                        return (
                                            <div className="suggestionItem"
                                                 key={filteredScenario.description}
                                                 onClick={() => handleAllActivityScenarioChange(filteredScenario)}>{filteredScenario.description}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>}
                    </div>
                    : null}

                {isActivityView && !isAllActivities ?
                    <div>
                        <h3>Activity View</h3>
                        {allDefinedScenarios?.map((scenario, index) => {

                            return (
                                <div className="scenario-container">
                                    <div className="actvity-container">
                                        <label className="label">
                                            <span className="label-text">Activity
                                                <span className="ml-1 font-normal text-sm"
                                                      data-tooltip-id="activity-tooltip"
                                                      data-tooltip-place="right"
                                                      data-tooltip-content='Choose the activity you want to examine.'>&#9432;</span>
                                            </span>
                                            <Tooltip id="activity-tooltip" style={{maxWidth: '256px'}}/>
                                        </label>
                                        <select value={scenario.activity?.description}
                                                onChange={(event) => handleActivityChange(event, index)} id=""
                                                className="select select-bordered w-full max-w-xs">
                                            <option selected={true} value="" disabled>
                                                Choose an activity
                                            </option>
                                            {uniqueActivitys.map((edge) => {
                                                return <option
                                                    disabled={allDefinedScenarios.find(s => s.activity?.description === edge.name)}
                                                    value={edge.name} key={edge.id}>{edge.name}</option>
                                            })}
                                        </select>
                                    </div>

                                    {scenario.activity !== null && !scenario.isValid ?
                                        <p className="description">You cannot examine the
                                            activity <span
                                                className="bold-text">{scenario.activity.description}</span> because it
                                            is invalid.</p>
                                        : null}

                                    {scenario.activity !== null && scenario.isValid ?
                                        <div className="activity-container">
                                            <label className="label">
                                                <span className="label-text">Choose Mode
                                                    <span className="ml-1 font-normal text-sm"
                                                          data-tooltip-id="mode-tooltip"
                                                          data-tooltip-place="right"
                                                          data-tooltip-content="By choosing 'What if' scenarios are created that are testing runtime quality requirement under specific load or resilience conditions. 'Monitoring' generates scenarios that are do not include load and resilience changes.">&#9432;
                                                </span>
                                                </span>
                                                <Tooltip id="mode-tooltip" style={{maxWidth: '256px'}}/>
                                            </label>
                                            <div className="btn-group">
                                                {allModes.map(((mode) => {
                                                    return (
                                                        <>
                                                            <input type="radio" value={mode.name}
                                                                   onClick={(event) => handleModeChange(event, index)}
                                                                   name={"Mode" + index}
                                                                   data-title={mode.name}
                                                                   className={scenario.selected_mode === mode.name ? "btn btn-primary" : "btn"}
                                                                   id={mode.name + '-' + mode.description}
                                                                   data-tooltip-content={mode.description}
                                                                   checked={scenario.selected_mode === mode.name}/>
                                                            <Tooltip
                                                                id={mode.name + '-' + mode.description}/>
                                                        </>
                                                    )
                                                }))}
                                            </div>
                                        </div>
                                        : null}

                                    {scenario.selected_mode !== null ?
                                        <div className="actvity-container">
                                            <label className="label">
                                                <span className="label-text">
                                                    Scenario
                                                    <span className="ml-1 font-normal text-sm"
                                                          data-tooltip-id="scenario-tooltip"
                                                          data-tooltip-place="right"
                                                          data-tooltip-content='Choose a scenario that is interesting to examine. You can search for a specific scenario with the search bar.'>&#9432;</span>
                                                </span>
                                                <Tooltip id="scenario-tooltip" style={{maxWidth: '256px'}}/>
                                            </label>
                                            {scenario.generatedScenariosList.length === 0 ?
                                                <p className="description">The activity <span
                                                    className="bold-text">{scenario.activity.description}</span> has
                                                    no <span className="bold-text">Runtime Quality Scenarios</span> for
                                                    the mode <span
                                                        className="bold-text">"{scenario.selected_mode}"</span>.</p>
                                                :
                                                <div>
                                                    <input type="text" id="search-input"
                                                           placeholder="Search for an interesting scenario"
                                                           autoComplete="off"
                                                           onChange={(event) => filterScenarios(event, index)}
                                                           className="searchScenarioInputField"/>
                                                    <div className="generated-scenarios">
                                                        {scenario.filteredScenariosList?.map((filteredScenario) => {
                                                            return (
                                                                <div className="suggestionItem"
                                                                     key={filteredScenario.description}
                                                                     onClick={() => handleScenarioChange(filteredScenario, index)}>{filteredScenario.description}
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            }
                                            {scenario.description !== null ? ScenarioTestApplicationService.formatDescription(scenario) : null}
                                        </div>
                                        : null}


                                    {scenario.selected_mode !== null && scenario.description !== null && (scenario.options !== null || scenario.expected !== null) ?
                                        <div>
                                            <label className="label">
                                                <h6>
                                                    Response Measure
                                                    <span className="ml-1 font-normal text-sm"
                                                          data-tooltip-id="response-measure-tooltip"
                                                          data-tooltip-place="right"
                                                          data-tooltip-content='By changing the response measures you can specify the metric the test should examine or change the expected behavior of your system.'>&#9432;</span>
                                                </h6>
                                                <Tooltip id="response-measure-tooltip" style={{maxWidth: '256px'}}/>
                                            </label>

                                            <div className="btn-group">
                                                {scenario.all_options !== null && scenario.all_options.map(expectedParameter => {
                                                    return (
                                                        <>
                                                            <input type="radio" value={expectedParameter}
                                                                   onClick={() => handleOptionsChange(expectedParameter, index)}
                                                                   name={"Response Measure Option: Index" + index}
                                                                   data-title={expectedParameter}
                                                                   className={scenario.options === expectedParameter ? "btn btn-primary" : "btn"}
                                                                   data-tooltip-id={expectedParameter + index}
                                                                   data-tooltip-content={"Value: " + expectedParameter}
                                                                   checked={scenario.options === expectedParameter}/>
                                                            <Tooltip
                                                                id={expectedParameter + index}/>
                                                        </>
                                                    )
                                                })}
                                            </div>

                                            <div className="btn-group">
                                                {scenario.all_expected !== null && scenario.all_expected.map(expectedParameter => {
                                                    return (
                                                        <>
                                                            <input type="radio" value={expectedParameter.value}
                                                                   onClick={() => handleExpectedChange(expectedParameter, index)}
                                                                   name={"Response Measure Expected: Index" + index}
                                                                   data-title={expectedParameter.value}
                                                                   className={scenario.expected === expectedParameter ? "btn btn-primary" : "btn"}
                                                                   data-tooltip-id={expectedParameter.value + index}
                                                                   data-tooltip-content={"Value: " + expectedParameter.value + " " + expectedParameter.unit}
                                                                   checked={scenario.expected.value === expectedParameter.value}/>
                                                            <Tooltip
                                                                id={expectedParameter.value + index}/>
                                                        </>
                                                    )
                                                })}
                                            </div>

                                        </div>
                                        : null}

                                    {scenario.selected_mode === "What if" && scenario.description !== null ?
                                        <div className="activity-container">
                                            <label className="label">
                                                <h6>
                                                    Load Design
                                                    <span className="ml-1 font-normal text-sm"
                                                          data-tooltip-id="load-design-tooltip"
                                                          data-tooltip-place="right"
                                                          data-tooltip-content='The Load Design allows you to further design the simulated load depending on the selected stimulus. For instance, if you design a "Load Peak" stimulus, you will need to specify the final peak to be achieved and how long it takes to reach it.'>&#9432;</span>
                                                </h6>
                                                <Tooltip id="load-design-tooltip" style={{maxWidth: '256px'}}/>
                                            </label>
                                            <label className="label">
                                                <span
                                                    className="label-text">Do you want to change the Load Design?
                                                <span className="ml-1 font-normal text-sm"
                                                      data-tooltip-id="load-decision-tooltip"
                                                      data-tooltip-place="right"
                                                      data-tooltip-content='You can choose if you want to customize the load design or pick the preselected settings from dqualizer.'>&#9432;</span>
                                                </span>
                                                <Tooltip id="load-decision-tooltip" style={{maxWidth: '256px'}}/>
                                            </label>
                                            <div className="btn-group">
                                                <input type="radio" value="Yes"
                                                       onClick={(event) => handleLoadDecisionChange(event, index)}
                                                       name={"ChangeLoadDesign" + index}
                                                       data-title="Yes"
                                                       className="btn"
                                                       id={"ChangeLoadDesign" + "-" + "Yes" + index}
                                                       data-tooltip-content={"Choose your own load design"}
                                                       checked={scenario.load_decision === "Yes"}/>
                                                <Tooltip
                                                    id={"ChangeLoadDesign" + "-" + "Yes" + index}/>

                                                <input type="radio" value="No"
                                                       onClick={(event) => handleLoadDecisionChange(event, index)}
                                                       name={"ChangeLoadDesign" + index}
                                                       data-title="No"
                                                       className="btn"
                                                       id={"ChangeLoadDesign" + "-" + "No" + index}
                                                       data-tooltip-content={"Keep the load design"}
                                                       checked={scenario.load_decision === "No"}/>
                                                <Tooltip
                                                    id={"ChangeLoadDesign" + "-" + "No" + index}/>
                                            </div>

                                            {scenario.load_decision === "Yes" ?
                                                <div className="actvity-container">
                                                    <div className="actvity-container design-select">
                                                        <select value={scenario.load_design?.name}
                                                                onChange={(event) => handleLoadDesignChange(event, index)}
                                                                id=""
                                                                className="select select-bordered w-full max-w-xs">
                                                            {allLoadDesigns.map((loadVariant) => {
                                                                return <option value={loadVariant.name}
                                                                               key={loadVariant.name}
                                                                               disabled={isLoadDesignNotAvailable(loadVariant, index)}>{loadVariant.name}</option>
                                                            })}
                                                        </select>
                                                    </div>
                                                    <div className="actvity-container">
                                                        {allLoadDesigns.map((loadVariant) => {
                                                            return (
                                                                <>
                                                                    {loadVariant.name === scenario.load_design?.name ? loadVariant.design_parameters != null && loadVariant.design_parameters.map((parameter, paramIndex) => {
                                                                        return (
                                                                            <>
                                                                                <label className="label">
                                                                                    <span className="label-text">
                                                                                        {parameter.name}
                                                                                    </span>
                                                                                </label>
                                                                                <div className="btn-group">
                                                                                    {parameter.values != null && parameter.values.map((value) => {
                                                                                        return (
                                                                                            <>
                                                                                                <input type="radio"
                                                                                                       value={value}
                                                                                                       onClick={() => handleLoadDesignParameterChange(value, index, paramIndex)}
                                                                                                       name={"Load Parameter: Index " + index + ", ParamIndex:" + paramIndex}
                                                                                                       data-title={value.name}
                                                                                                       className="btn"
                                                                                                       data-tooltip-id={value.name + '-' + value.value + index}
                                                                                                       data-tooltip-content={'Value: ' + value.value}
                                                                                                       checked={scenario.load_design?.design_parameters[paramIndex].value?.name === value.name}/>
                                                                                                <Tooltip
                                                                                                    id={value.name + '-' + value.value + index}/>
                                                                                            </>
                                                                                        )
                                                                                    })}
                                                                                </div>
                                                                            </>
                                                                        )
                                                                    }) : null
                                                                    }
                                                                </>)
                                                        })}
                                                    </div>
                                                </div>
                                                : null}
                                        </div>
                                        : null}

                                    {scenario.selected_mode === "What if" && scenario.description !== null && scenario.load_decision !== null ?
                                        <div className="activity-container">
                                            <label className="label">
                                                <h6>
                                                    Resilience Design
                                                    <span className="ml-1 font-normal text-sm"
                                                          data-tooltip-id="resilience-design-tooltip"
                                                          data-tooltip-place="right"
                                                          data-tooltip-content='The Resilience Design allows you to further design the simulated resilience depending on the selected stimulus. For instance, if you design a "Failed Request" stimulus, the system can let requests fail. You can specify how often it should happen.'>&#9432;</span>
                                                </h6>
                                                <Tooltip id="resilience-design-tooltip" style={{maxWidth: '256px'}}/>
                                            </label>
                                            <label className="label">
                                                <span className="label-text">Do you want to change the Resilience Design?
                                                    <span className="ml-1 font-normal text-sm"
                                                          data-tooltip-id="resilience-decision-tooltip"
                                                          data-tooltip-place="right"
                                                          data-tooltip-content='You can choose if you want to customize the resilience design or pick the preselected settings from dqualizer.'>&#9432;</span>

                                                </span>
                                                <Tooltip id="resilience-decision-tooltip" style={{maxWidth: '256px'}}/>
                                            </label>
                                            <div className="btn-group">
                                                <input type="radio" value="Yes"
                                                       onClick={(event) => handleResilienceDecisionChange(event, index)}
                                                       name={"ChangeResilienceDesign" + index}
                                                       data-title="Yes"
                                                       className="btn"
                                                       id={"ChangeResilienceDesign" + "-" + "Yes" + index}
                                                       data-tooltip-content={"Choose your own resilience design"}
                                                       checked={scenario.resilience_decision === "Yes"}/>
                                                <Tooltip
                                                    id={"ChangeResilienceDesign" + "-" + "Yes" + index}/>

                                                <input type="radio" value="No"
                                                       onClick={(event) => handleResilienceDecisionChange(event, index)}
                                                       name={"ChangeResilienceDesign" + index}
                                                       data-title="No"
                                                       className="btn"
                                                       id={"ChangeResilienceDesign" + "-" + "No" + index}
                                                       data-tooltip-content={"Keep the resilience design"}
                                                       checked={scenario.resilience_decision === "No"}/>
                                                <Tooltip
                                                    id={"ChangeResilienceDesign" + "-" + "No" + index}/>
                                            </div>

                                            {scenario.resilience_decision === "Yes" ?
                                                <div className="actvity-container">
                                                    <div className="actvity-container design-select">
                                                        <select value={scenario.resilience_design?.name}
                                                                onChange={(event) => handleResilienceDesignChange(event, index)}
                                                                id=""
                                                                className="select select-bordered w-full max-w-xs">
                                                            {allResilienceDesigns.map((resilienceVariant) => {
                                                                return <option value={resilienceVariant.name}
                                                                               key={resilienceVariant.name}>{resilienceVariant.name}</option>
                                                            })}
                                                        </select>
                                                    </div>

                                                    {/*TODO: Add Tooltip for each element*/}
                                                    <div className="actvity-container">
                                                        {allResilienceDesigns.map((resilienceVariant) => {
                                                            return (
                                                                <>
                                                                    {resilienceVariant.name === scenario.resilience_design?.name ? resilienceVariant.design_parameters != null && resilienceVariant.design_parameters.map((parameter, paramIndex) => {
                                                                        return (
                                                                            <>
                                                                                <label className="label">
                                                                                    <span className="label-text">
                                                                                        {parameter.name}
                                                                                    </span>
                                                                                </label>
                                                                                <div className="btn-group">
                                                                                    {parameter.values != null && parameter.values.map((value) => {
                                                                                        return (
                                                                                            <>
                                                                                                <input type="radio"
                                                                                                       value={value}
                                                                                                       onClick={() => handleResilienceDesignParameterChange(value, index, paramIndex)}
                                                                                                       name={"Resilience Parameter: Index " + index + ", ParamIndex:" + paramIndex}
                                                                                                       data-title={value.name}
                                                                                                       className="btn"
                                                                                                       data-tooltip-id={value.name + '-' + value.value + index}
                                                                                                       data-tooltip-content={'Value: ' + value.value}
                                                                                                       checked={scenario.resilience_design.design_parameters[paramIndex].value?.name === value.name}/>
                                                                                                <Tooltip
                                                                                                    id={value.name + '-' + value.value + index}/>
                                                                                            </>
                                                                                        )
                                                                                    })}
                                                                                </div>
                                                                            </>
                                                                        )
                                                                    }) : null
                                                                    }
                                                                </>)
                                                        })}
                                                    </div>
                                                </div>
                                                : null}
                                        </div>
                                        : null}
                                    <button className="btn deleting-container-button"
                                            disabled={isDeletingContainerDisabled}
                                            onClick={() => deleteScenario(index)}>X
                                    </button>
                                </div>
                            )
                        })}


                        <div className="button-group">
                            <button onClick={() => props.setScenarioTestShow()} className="btn button-left">
                                Cancel
                            </button>

                            <button className="btn button-left" onClick={addScenario}>
                                Add Scenario
                            </button>

                            <button onClick={() => setIsActivityView(false)} className="btn">
                                Next
                            </button>
                        </div>
                    </div>
                    : null}

                {!isActivityView && !isAllActivities ?
                    <div>
                        <div className="activity-container">
                            <h3>Settings View</h3>
                            <p>
                                The Settings to include into the Scenario Test
                                <span className="ml-1 font-normal text-sm" data-tooltip-place="right"
                                      data-tooltip-id="settings-view-tooltip"
                                      data-tooltip-content='Here you can set the settings for the whole scenario test.'>&#9432;</span>
                                <Tooltip
                                    id={"settings-view-tooltip"}/>
                            </p>

                            <div className="actvity-container">
                                <label className="label">
                            <span className="label-text">
                                Accuracy
                                <span className="ml-1 font-normal text-sm" data-tooltip-id="accuracy-tooltip"
                                      data-tooltip-place="right"
                                      data-tooltip-content='The accuracy defines how long the test will be executed. The higher the accuracy is, the longer the test will be executed. By default, a 100% accuracy is set to a test duration of 1 week. An accuracy of 1% relates to approximately 1 hour. An accuracy value of 0% is not possible. We advise to use at least 60% accuracy to receive meaningful results. With a value of 60% the test will run approximately 60 hours, i.e., two and a half days.'>&#9432;</span>
                            </span>
                                </label>
                                <Tooltip id="accuracy-tooltip" style={{maxWidth: '256px'}}/>
                                <input type="range" value={accuracy} onChange={handleAccuracyChange} name="" id=""
                                       className="range range-primary" min={0} max={100} step={10}/>
                                <div className="w-full flex justify-between text-xs px-2">
                                    <span>0%</span>
                                    <span>10%</span>
                                    <span>20%</span>
                                    <span>30%</span>
                                    <span>40%</span>
                                    <span>50%</span>
                                    <span>60%</span>
                                    <span>70%</span>
                                    <span>80%</span>
                                    <span>90%</span>
                                    <span>100%</span>
                                </div>
                            </div>

                            <div className="actvity-container">
                                <label className="label">
                            <span className="label-text">
                                Environment
                                <span className="ml-1 font-normal text-sm" data-tooltip-id="environment-tooltip"
                                      data-tooltip-place="right"
                                      data-tooltip-content='The environment is the system on which the scenario test is executed. Warning: If the test is executed on the production environment, system failures may occur.'>&#9432;</span>
                            </span>
                                    <Tooltip id="environment-tooltip" style={{maxWidth: '256px'}}/>
                                </label>
                                <select value={environment} onChange={handleEnvironmentChange} id=""
                                        className="select select-bordered w-full max-w-xs">
                                    <option selected={true} value="" disabled>
                                        Choose an environment
                                    </option>
                                    {settings.environment.map((environment) => {
                                        return <option value={environment} key={environment}>{environment}</option>
                                    })}
                                </select>
                            </div>

                            {environment === 'Test' ?
                                <div className="actvity-container">
                                    <label className="label">
                            <span className="label-text">
                                Time Slot
                                <span className="ml-1 font-normal text-sm" data-tooltip-id="timeslot-tooltip"
                                      data-tooltip-place="right"
                                      data-tooltip-content='The time slot defines your environment in more detail as a means to be as close to your productive environment as possible. It says that the test environment should simulate the load of office hours, the hours after work or the night.'>&#9432;</span>
                            </span>
                                    </label>
                                    <Tooltip id="timeslot-tooltip" style={{maxWidth: '256px'}}/>
                                    <select value={timeSlot?.representation} onChange={handleTimeSlotChange} id=""
                                            className="select select-bordered w-full max-w-xs">
                                        <option selected={true} value="" disabled>
                                            Choose a time slot
                                        </option>
                                        {settings.timeSlot.map((timeSlot) => {
                                            return <option value={timeSlot.representation}
                                                           key={timeSlot.representation}>{timeSlot.representation}</option>
                                        })}
                                    </select>
                                </div>
                                : null}
                        </div>

                        <div className="button-group">
                            <button onClick={() => setIsActivityView(true)} className="btn button-left">
                                Back
                            </button>

                            <button onClick={addScenarioTest} className="btn" disabled={isAddingButtonDisabled()}>
                                Add Scenario Test
                            </button>
                        </div>
                    </div>
                    : null}
            </div>
            <ResizeBar setIsResizing={setIsResizing} setSidebarWidth={setSidebarWidth}/>
        </>
    )

}
