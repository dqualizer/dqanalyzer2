import React, {useEffect, useState} from 'react';
import {useReactFlow} from 'reactflow';
import * as scenarioSpecs from '../../data/scenariotest-specs.json';
import * as monitoringMetrics from '../../data/monitoring-metrics.json';
import ResizeBar from '../ResizeBar.jsx';
import * as mapping from '../../data/werkstatt-en.json';
import {Tooltip} from 'react-tooltip';
import axios from 'axios';
import pluralize from 'pluralize';
import compromise from 'compromise';
import ActivityValidator from './ActivityValidator';
import ActivityParser from "./ActivityParser.jsx";
import ScenarioGenerator from "./ScenarioGenerator.jsx";

export default function ScenarioTestMenu(props) {

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
    const allMonitoringMetrics = monitoringMetrics.metrics;
    // const metrics = scenarioSpecs.metrics;
    const settings = scenarioSpecs.settings;

    let initRQADefiniton = {
        context: mapping.context,
        scenarios: [],
        settings: {
            accuracy: 0,
            environment: null,
            timeSlot: null
        }
    }

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
    const [enviroment, setEnviroment] = useState(null);
    const [timeSlot, setTimeSlot] = useState(null);

    const [isActivityView, setIsActivityView] = useState(true);
    const [isDeletingContainerDisabled, setIsDeletingContainerDisabled] = useState(true);

    // state-based RQA-definition
    const [rqa, setRqa] = useState(initRQADefiniton);

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

    const colorActiveActivities = (event) => {
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

    const handleActivityChange = (event, index) => {
        colorActiveActivities(event);

        // update the view for the selected edge
        let selectedActivity = allActivities.find((artifact) => artifact.description === event.target.value);

        // validate activity
        let wordArray = ActivityParser(props.nodes, props.edges, selectedActivity);
        let isValidActivity = ActivityValidator(wordArray);

        let allDefinedScenariosCopy = deepCopy(allDefinedScenarios);
        allDefinedScenariosCopy[index].activity = selectedActivity;
        allDefinedScenariosCopy[index].selected_mode = null;
        allDefinedScenariosCopy[index].generatedScenariosList = null;
        allDefinedScenariosCopy[index].filteredScenariosList = null;
        allDefinedScenariosCopy[index].isValid = isValidActivity;

        setAllDefinedScenarios(allDefinedScenariosCopy);
    }

    const handleLoadDesignChange = (event, index) => {
        let loadVariant = allLoadDesigns.find((variant) => variant.name === event.target.value);
        let copyLoadVariant = deepCopy(loadVariant);

        copyLoadVariant.designParameters?.forEach((parameter) => {
            delete parameter.values;
            parameter.value = null;
        });

        // save
        let allDefinedScenariosCopy = deepCopy(allDefinedScenarios);
        allDefinedScenariosCopy[index].load_design = copyLoadVariant;

        setAllDefinedScenarios(allDefinedScenariosCopy);
    }

    const handleModeChange = (event, scenario, index) => {
        let selectedMode = event.target.value;
        let allDefinedScenariosCopy = deepCopy(allDefinedScenarios);
        allDefinedScenariosCopy[index].selected_mode = selectedMode;
        allDefinedScenariosCopy[index].generatedScenariosList = getScenariosForActivityAndMode(scenario.activity, selectedMode);

        setAllDefinedScenarios(allDefinedScenariosCopy);
    }

    const handleScenarioChange = (selectedScenario, index) => {
        let allDefinedScenariosCopy = deepCopy(allDefinedScenarios);
        allDefinedScenariosCopy[index].description = selectedScenario.description;
        allDefinedScenariosCopy[index].metric = selectedScenario.metric;
        allDefinedScenariosCopy[index].load_design = selectedScenario.load_design;
        allDefinedScenariosCopy[index].resilience_design = selectedScenario.resilience_design;
        allDefinedScenariosCopy[index].filteredScenariosList = null;
        allDefinedScenariosCopy[index].expected = null;
        allDefinedScenariosCopy[index].load_decision = null;
        allDefinedScenariosCopy[index].resilience_decision = null;

        setAllDefinedScenarios(allDefinedScenariosCopy);
    }

    const filterScenarios = (event, index) => {
        const inputText = event.target.value;
        let allDefinedScenariosCopy = deepCopy(allDefinedScenarios);
        let scenarioCopy = allDefinedScenariosCopy[index];
        let filteredScenarios = deepCopy(scenarioCopy.generatedScenariosList);
        scenarioCopy.filteredScenariosList = filteredScenarios.filter(isShownScenario =>
            isShownScenario.description.toLowerCase().includes(inputText.toLowerCase())
        );
        setAllDefinedScenarios(allDefinedScenariosCopy);
    }

    const handleLoadDecisionChange = (event, index) => {
        let chosenLoadDecision = event.target.value;
        let allDefinedScenariosCopy = deepCopy(allDefinedScenarios);
        allDefinedScenariosCopy[index].load_decision = chosenLoadDecision;
        setAllDefinedScenarios(allDefinedScenariosCopy);
    }

    const handleResilienceDecisionChange = (event, index) => {
        let chosenResilienceDecision = event.target.value;
        let allDefinedScenariosCopy = deepCopy(allDefinedScenarios);
        allDefinedScenariosCopy[index].resilience_decision = chosenResilienceDecision;
        setAllDefinedScenarios(allDefinedScenariosCopy);
    }

    const handleResilienceDesignChange = (event, index) => {
        let resilienceVariant = allResilienceDesigns.find((variant) => variant.name === event.target.value);
        let copyResilienceVariant = deepCopy(resilienceVariant);

        copyResilienceVariant.designParameters?.forEach((parameter) => {
            delete parameter.values;
            parameter.value = null;
        });

        // save
        let allDefinedScenariosCopy = deepCopy(allDefinedScenarios);
        allDefinedScenariosCopy[index].resilience_design = copyResilienceVariant;
        setAllDefinedScenarios(allDefinedScenariosCopy);
    }

    const handleResilienceDesignParameterChange = (value, index, paramIndex) => {
        let allDefinedScenariosCopy = deepCopy(allDefinedScenarios);
        let indexScenario = allDefinedScenariosCopy[index];

        let copyDesignParameter = deepCopy(indexScenario.resilience_design.designParameters[paramIndex]);
        copyDesignParameter.value = value;

        indexScenario.resilience_design.designParameters[paramIndex] = copyDesignParameter;
        setAllDefinedScenarios(allDefinedScenariosCopy);

    }

    const handleResponseParameterChange = (responseParameter, index) => {
        let allDefinedScenariosCopy = deepCopy(allDefinedScenarios);
        allDefinedScenariosCopy[index].expected = responseParameter;
        setAllDefinedScenarios(allDefinedScenariosCopy);
    }

    const handleAccuracyChange = (e) => {
        setAccuracy(e.target.value);
    }

    const handleEnviromentChange = (e) => {
        let newEnviroment = e.target.value;

        setEnviroment(newEnviroment);
    }

    const handleLoadDesignParameterChange = (value, index, paramIndex) => {
        let allDefinedScenariosCopy = deepCopy(allDefinedScenarios);
        let indexScenario = allDefinedScenariosCopy[index];

        let copyDesignParameter = deepCopy(indexScenario.load_design.designParameters[paramIndex]);
        copyDesignParameter.value = value;

        indexScenario.load_design.designParameters[paramIndex] = copyDesignParameter;
        setAllDefinedScenarios(allDefinedScenariosCopy);
    }

    const handleTimeSlotChange = (e) => {
        let newTimeSlot = settings.timeSlot.find((time) => time.representation === e.target.value);
        setTimeSlot(newTimeSlot);
    }

    const addScenario = () => {
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
        let newScenarioList = deepCopy(allDefinedScenarios);
        newScenarioList.push(newScenario);
        setAllDefinedScenarios(newScenarioList);

        setIsDeletingContainerDisabled(false);
    }

    const deleteScenario = () => {
        let newScenarioList = deepCopy(allDefinedScenarios);
        newScenarioList.pop();

        setAllDefinedScenarios(newScenarioList);
        setIsDeletingContainerDisabled(newScenarioList.length === 1);
    }

    const addScenarioTest = (event) => {
        let scenarios = [];
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
            rqa.scenarios.push(rqaScenario);
        }
        rqa.settings.accuracy = accuracy;
        rqa.settings.environment = enviroment;
        rqa.settings.timeSlot = timeSlot;
        console.log(rqa);

        // post the RQA to the axios api
        axios.post(`https://64bbef8f7b33a35a4446d353.mockapi.io/dqualizer/scenarios/v1/scenarios`, rqa);

        // close the Scenario Test Window and open the Scenario Explorer
        props.setScenarioExplorerShow(true);
        props.setScenarioTestShow(false);
    }

    /*
        Produces a copy of the input object to detach the operations from its original
     */
    const deepCopy = (obj) => {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }

        let copiedObject;
        if (obj instanceof Array) {
            copiedObject = [];
            for (let i = 0; i < obj.length; i++) {
                copiedObject.push(deepCopy(obj[i]));
            }
        } else {
            copiedObject = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    copiedObject[key] = deepCopy(obj[key]);
                }
            }
        }

        return copiedObject;
    };

    const getScenariosForActivityAndMode = (activity, mode) => {
        let wordArray = ActivityParser(props.nodes, props.edges, activity);

        let generatedSentences = ScenarioGenerator(mode, wordArray);

        //console.log(generatedSentences);
        return generatedSentences;
    }

    return (
        <>
            <div className="p-4 prose overflow-scroll h-full"
                 style={{width: `${sidebarWidth}px`, cursor: isResizing ? 'col-resize' : 'default',}}>
                <h3>Scenario Test Specification</h3>

                {isActivityView ?
                    <div>
                        <h3>Activity View</h3>
                        {allDefinedScenarios?.map((scenario, index) => {

                            return (
                                <div className="scenario-container">
                                    <div className="actvity-container">
                                        <label className="label">
                                            <span className="label-text">Activity</span>
                                        </label>
                                        <select value={scenario.activity?.description} onChange={(event) => handleActivityChange(event, index)} id=""
                                                className="select select-bordered w-full max-w-xs">
                                            <option selected={true} value="" disabled>
                                                Choose an activity
                                            </option>
                                            {uniqueActivitys.map((edge) => {
                                                return <option value={edge.name} key={edge.id}>{edge.name}</option>
                                            })}
                                        </select>
                                    </div>

                                    {scenario.activity !== null && !scenario.isValid ?
                                        <p className="description">You cannot examine the activity {scenario.activity.description} because it is invalid.</p>
                                    : null}

                                    {scenario.activity !== null && scenario.isValid ?
                                        <div className="activity-container">
                                            <label className="label">
                                                <span className="label-text">Choose Mode</span>
                                            </label>
                                            <div className="btn-group">
                                                {allModes.map(((mode) => {
                                                    return (
                                                        <>
                                                            <input type="radio" value={mode.name}
                                                                   onClick={(event) => handleModeChange(event, scenario, index)}
                                                                   name="Mode"
                                                                   data-title={mode.name}
                                                                   className={scenario.selected_mode === mode.name? "btn btn-primary" : "btn"}
                                                                   id={mode.name + '-' + mode.description}
                                                                   data-tooltip-content={mode.description}/>
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
                                            <span className="ml-1 font-normal text-sm" data-tooltip-id="stimulus-tooltip"
                                                  data-tooltip-place="right"
                                                  data-tooltip-content='The environment is the system on which the scenario test is executed. Warning: If the test is executed on the production environment, system failures may occur.'>&#9432;</span>
                                        </span>
                                    </label>
                                    <Tooltip id="enviroment-tooltip" style={{maxWidth: '256px'}}/>
                                    <input type="text" id="search-input" placeholder="Search" autoComplete="off" value={scenario.description} onChange={(event) => filterScenarios(event, index)} className="searchScenarioInputField"/>
                                    <div className="generated-scenarios">
                                        {scenario.filteredScenariosList?.map((filteredScenario) => {
                                            return (
                                                <div className="suggestionItem"
                                                     key={filteredScenario.description} onClick={() => handleScenarioChange(filteredScenario, index)}>{filteredScenario.description}
                                                </div>
                                            )
                                        })}
                                    </div>
                                    {scenario.description !== null ? <p className="description">{scenario.description}</p> : null}
                                </div>
                                : null}

                            {scenario.selected_mode === "What if" && scenario.description !== null ?
                                <div className="activity-container">
                                    <label className="label">
                                        <h6>
                                            Load Design
                                            <span className="ml-1 font-normal text-sm"
                                                  data-tooltip-id="response-measure-tooltip"
                                                  data-tooltip-place="right"
                                                  data-tooltip-content='The Load Design allows you to further design the simulated load depending on the selected stimulus. For instance, if you design a "Load Peak" stimulus, you will need to specify the final peak to be achieved and how long it takes to reach it.'>&#9432;</span>
                                        </h6>
                                        <Tooltip id="response-measure-tooltip" style={{maxWidth: '256px'}}/>
                                    </label>
                                    <label className="label">
                                        <span className="label-text">Do you want to change the Load Design?</span>
                                    </label>
                                    <div className="btn-group">
                                        <input type="radio" value="Yes"
                                               onClick={(event) => handleLoadDecisionChange(event, index)}
                                               name="ChangeLoadDesign"
                                               data-title="Yes"
                                               className="btn"
                                               id={"ChangeLoadDesign" + "-" + "Yes"}
                                               data-tooltip-content={"Choose your own load design"}
                                               checked={scenario.load_decision === "Yes"}/>
                                        <Tooltip
                                            id={"ChangeLoadDesign" + "-" + "Yes"}/>

                                        <input type="radio" value="No"
                                               onClick={(event) => handleLoadDecisionChange(event, index)}
                                               name="ChangeLoadDesign"
                                               data-title="No"
                                               className="btn"
                                               id={"ChangeLoadDesign" + "-" + "No"}
                                               data-tooltip-content={"Keep the load design"}
                                               checked={scenario.load_decision === "No"}/>
                                        <Tooltip
                                            id={"ChangeLoadDesign" + "-" + "No"}/>
                                    </div>

                                    {scenario.load_decision === "Yes" ?
                                        <div className="actvity-container">
                                            <div className="actvity-container">
                                                <select value={scenario.load_design.name} onChange={(event) => handleLoadDesignChange(event, index)} id=""
                                                        className="select select-bordered w-full max-w-xs">
                                                    {allLoadDesigns.map((loadVariant) => {
                                                        return <option value={loadVariant.name}
                                                                       key={loadVariant.name}>{loadVariant.name}</option>
                                                    })}
                                                </select>
                                            </div>
                                            <div className="actvity-container">
                                                {allLoadDesigns.map((loadVariant) => {
                                                    return (
                                                        <>
                                                            {loadVariant.name === scenario.load_design.name ? loadVariant.designParameters != null && loadVariant.designParameters.map((parameter, paramIndex) => {
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
                                                                                               name={parameter.name}
                                                                                               data-title={value.name}
                                                                                               className="btn"
                                                                                               data-tooltip-id={value.name + '-' + value.value}
                                                                                               data-tooltip-content={'Value: ' + value.value}
                                                                                               checked={scenario.load_design.designParameters[paramIndex].value?.name === value.name}/>
                                                                                        <Tooltip
                                                                                            id={value.name + '-' + value.value}/>
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
                                                  data-tooltip-id="response-measure-tooltip"
                                                  data-tooltip-place="right"
                                                  data-tooltip-content='The Load Design allows you to further design the simulated load depending on the selected stimulus. For instance, if you design a "Load Peak" stimulus, you will need to specify the final peak to be achieved and how long it takes to reach it.'>&#9432;</span>
                                        </h6>
                                        <Tooltip id="response-measure-tooltip" style={{maxWidth: '256px'}}/>
                                    </label>
                                    <label className="label">
                                        <span className="label-text">Do you want to change the Resilience Design?</span>
                                    </label>
                                    <div className="btn-group">
                                        <input type="radio" value="Yes"
                                               onClick={(event) => handleResilienceDecisionChange(event, index)}
                                               name="ChangeResilienceDesign"
                                               data-title="Yes"
                                               className="btn"
                                               id={"ChangeResilienceDesign" + "-" + "Yes"}
                                               data-tooltip-content={"Choose your own resilience design"}
                                               checked={scenario.resilience_decision === "Yes"}/>
                                        <Tooltip
                                            id={"ChangeResilienceDesign" + "-" + "Yes"}/>

                                        <input type="radio" value="No"
                                               onClick={(event) => handleResilienceDecisionChange(event, index)}
                                               name="ChangeResilienceDesign"
                                               data-title="No"
                                               className="btn"
                                               id={"ChangeResilienceDesign" + "-" + "No"}
                                               data-tooltip-content={"Keep the resilience design"}
                                               checked={scenario.resilience_decision === "No"}/>
                                        <Tooltip
                                            id={"ChangeResilienceDesign" + "-" + "No"}/>
                                    </div>

                                    {scenario.resilience_decision === "Yes" ?
                                        <div className="actvity-container">
                                            <select value={scenario.resilience_design.name} onChange={(event) => handleResilienceDesignChange(event, index)} id=""
                                                    className="select select-bordered w-full max-w-xs">
                                                {allResilienceDesigns.map((resilienceVariant) => {
                                                    return <option value={resilienceVariant.name}
                                                                   key={resilienceVariant.name}>{resilienceVariant.name}</option>
                                                })}
                                            </select>

                                            {/*TODO: Add Tooltip for each element*/}
                                            <div className="actvity-container">
                                                {allResilienceDesigns.map((resilienceVariant) => {
                                                    return (
                                                        <>
                                                            {resilienceVariant.name === scenario.resilience_design.name ? resilienceVariant.designParameters != null && resilienceVariant.designParameters.map((parameter, paramIndex) => {
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
                                                                                        <input type="radio" value={value}
                                                                                               onClick={() => handleResilienceDesignParameterChange(value, index, paramIndex)}
                                                                                               name={parameter.name}
                                                                                               data-title={value.name}
                                                                                               className="btn"
                                                                                               data-tooltip-id={value.name + '-' + value.value}
                                                                                               data-tooltip-content={'Value: ' + value.value}
                                                                                               checked={scenario.resilience_design.designParameters[paramIndex].value?.name === value.name}/>
                                                                                        <Tooltip
                                                                                            id={value.name + '-' + value.value}/>
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

                            {scenario.selected_mode !== null && scenario.description !== null && (scenario.selected_mode === "Monitoring" || (scenario.selected_mode === "What if" && scenario.load_decision !== null && scenario.resilience_decision !== null)) ?
                                <div>
                                    <label className="label">
                                        <h6>
                                            Response Measure
                                            <span className="ml-1 font-normal text-sm"
                                                  data-tooltip-id="response-measure-tooltip"
                                                  data-tooltip-place="right"
                                                  data-tooltip-content='The Load Design allows you to further design the simulated load depending on the selected stimulus. For instance, if you design a "Load Peak" stimulus, you will need to specify the final peak to be achieved and how long it takes to reach it.'>&#9432;</span>
                                        </h6>
                                        <Tooltip id="response-measure-tooltip" style={{maxWidth: '256px'}}/>
                                    </label>

                                    <div className="btn-group">
                                        {allMonitoringMetrics.find((metric) => metric.metric === scenario.metric).expected.map((responseParameter => {
                                            return (
                                                <>
                                                    <input type="radio" value={responseParameter.value}
                                                           onClick={() => handleResponseParameterChange(responseParameter, index)}
                                                           name={"Response Measure" + index}
                                                           data-title={responseParameter.value}
                                                           className={scenario.expected === responseParameter? "btn btn-primary" : "btn"}
                                                           data-tooltip-id={responseParameter.value}
                                                           data-tooltip-content={"Value: " + responseParameter.value + " " + responseParameter.unit}/>
                                                    <Tooltip
                                                        id={responseParameter.value}/>
                                                </>
                                            )
                                        }))}
                                    </div>

                                </div>
                                : null}
                                <button className="btn deleting-container-button" disabled={isDeletingContainerDisabled} onClick={deleteScenario}>X</button>
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
                    :
                    <div>
                        <div className="activity-container">
                            <h3>Settings View</h3>
                            <p>
                                The Settings to include into the Scenario Test
                                <span className="ml-1 font-normal text-sm" data-tooltip-place="right"
                                      data-tooltip-id="metrics-tooltip"
                                      data-tooltip-content='You may check one or multiple of these fields to tell the system which metrics you would like to include in the final analysis results.'>&#9432;</span>
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
                                       className="range range-primary"/>
                            </div>

                            <div className="actvity-container">
                                <label className="label">
                            <span className="label-text">
                                Enviroment
                                <span className="ml-1 font-normal text-sm" data-tooltip-id="stimulus-tooltip"
                                      data-tooltip-place="right"
                                      data-tooltip-content='The environment is the system on which the scenario test is executed. Warning: If the test is executed on the production environment, system failures may occur.'>&#9432;</span>
                            </span>
                                </label>
                                <Tooltip id="enviroment-tooltip" style={{maxWidth: '256px'}}/>
                                <select value={enviroment} onChange={handleEnviromentChange} id=""
                                        className="select select-bordered w-full max-w-xs">
                                    <option selected={true} value="" disabled>
                                        Choose an enviroment
                                    </option>
                                    {settings.enviroment.map((enviroment) => {
                                        return <option value={enviroment} key={enviroment}>{enviroment}</option>
                                    })}
                                </select>
                            </div>

                            {enviroment === 'Test' ?
                                <div className="actvity-container">
                                    <label className="label">
                            <span className="label-text">
                                Time Slot
                                <span className="ml-1 font-normal text-sm" data-tooltip-id="stimulus-tooltip"
                                      data-tooltip-place="right"
                                      data-tooltip-content='The stimulus specifies how the load should look like. For instance, a "Load peak" will lead to a massive spike in simulated users accessing the application in a secure environment whereas a "Load Increase" may lead to a slow in crease in users accessing the application.'>&#9432;</span>
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

                            <button onClick={addScenarioTest} className="btn">
                                Add Test
                            </button>
                        </div>
                    </div>}
            </div>
            <ResizeBar setIsResizing={setIsResizing} setSidebarWidth={setSidebarWidth}/>
        </>
    )

}
