import React, {useEffect, useState} from 'react';
import {useEdges, useOnSelectionChange, useReactFlow} from 'reactflow';
import * as scenarioSpecs from '../data/scenariotest-specs.json';
import ResizeBar from './ResizeBar';
import * as mapping from '../data/werkstatt.json';
import {Tooltip} from 'react-tooltip';
import axios from 'axios';

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
    const allRqs = scenarioSpecs.rqs;
    const metrics = scenarioSpecs.metrics;
    const settings = scenarioSpecs.settings;

    let initRQADefiniton = {
        context: mapping.context,
        environment: mapping.server_info[0].environment,
        runtime_quality_analysis: {
            artifacts: [],
            settings: {
                accuracy: 0, environment: settings.enviroment[0], timeSlot: null
            }
        }
    }

    // initialize the artifacts key with the activities in the domain
    props.edges.forEach((edge) => {
        if (edge.activity !== undefined) {
            initRQADefiniton.runtime_quality_analysis.artifacts.push({
                artifact: {object: edge.system, activity: edge.activity}, description: edge.name, load_design: {
                    load_variant: null,
                    design_parameters: null
                },
                resilience_design: {
                    resilience_variant: null,
                    design_parameters: null
                },
                response_measures: []
            });
        }
    });


    const [selectedActivity, setSelectedActivity] = useState(0);
    const [loadDesign, setLoadDesign] = useState(allRqs.loadDesign[0]);
    const [resilienceDesign, setResilienceDesign] = useState(allRqs.resilienceDesign[0]);
    const [responseMeasures, setResponseMeasures] = useState([]);
    const [accuracy, setAccuracy] = useState(0);
    const [enviroment, setEnviroment] = useState(settings.enviroment[0]);
    const [timeSlot, setTimeSlot] = useState(null);

    // state-based RQA-definition
    const [rqa, setRqa] = useState(initRQADefiniton);

    const [includedMetrics, setIncludedMetrics] = useState(["response_time"]);

    const reactFlowInstance = useReactFlow();

    const uniqueActivitys = props.edges.filter((obj, index, self) => {
        return index === self.findIndex((t) => (t.name === obj.name));
    });

    const handleSelectionChange = (e) => {

        let relatedEdgesArray = reactFlowInstance.getEdges().filter((edge) => edge.name == e.target.value);
        let unrelatedEdgesArray = reactFlowInstance.getEdges().filter((edge) => edge.name != e.target.value);

        unrelatedEdgesArray.forEach((edge) => {
            edge.selected = false;
        })

        relatedEdgesArray.forEach((edge) => {
            edge.selected = true;
        })

        let newEdgesArray = relatedEdgesArray.concat(unrelatedEdgesArray);

        // updates reactFlowInstance
        reactFlowInstance.setEdges(newEdgesArray);

        // update the view for the selected edge
        let newSelectedActivity = rqa.runtime_quality_analysis.artifacts.findIndex((artifact) => artifact.description === e.target.value);
        setSelectedActivity(newSelectedActivity);
    }

    const handleLoadDesignChange = (e) => {
        let loadVariant = allRqs.loadDesign.find((variant) => variant.name === e.target.value);
        let copyLoadVariant = deepCopy(loadVariant);

        copyLoadVariant.designParameters.forEach((parameter) => {
            delete parameter.values;
            parameter.value = null;
        });
        setLoadDesign(copyLoadVariant);
    }

    const handleLoadDesignParameterChange = (value, index) => {
        let copyDesignParameter = deepCopy(loadDesign.designParameters[index]);
        copyDesignParameter.value = value;
        let newLoadDesign = deepCopy(loadDesign);

        newLoadDesign.designParameters[index] = copyDesignParameter;
        setLoadDesign(newLoadDesign);
    }

    const handleResilienceDesignChange = (e) => {
        let resilienceVariant = allRqs.resilienceDesign.find((variant) => variant.name === e.target.value);
        let copyResilienceVariant = deepCopy(resilienceVariant);

        copyResilienceVariant.designParameters.forEach((parameter) => {
            delete parameter.values;
            parameter.value = null;
        });
        setResilienceDesign(copyResilienceVariant);
    }

    const handleResilienceDesignParameterChange = (value, index) => {
        let copyResilienceParameter = deepCopy(resilienceDesign.designParameters[index]);
        copyResilienceParameter.value = value;
        let newResilienceDesign = deepCopy(resilienceDesign);

        newResilienceDesign.designParameters[index] = copyResilienceParameter;
        setResilienceDesign(newResilienceDesign);
    }

    const handleResponseParameterChange = (parameterName, parameterValue) => {
        let newResponseMeasures = deepCopy(responseMeasures);
        let metricIndex = newResponseMeasures.findIndex((metric) => metric.name === parameterName)
        if (metricIndex === -1) {
            let newMetric = {name: parameterName, value: parameterValue};
            newResponseMeasures.push(newMetric);
        } else {
            newResponseMeasures[metricIndex].value = parameterValue;
        }
        setResponseMeasures(newResponseMeasures);
    }

    const handleAccuracyChange = (e) => {
        console.log(e.target.value);
        setAccuracy(e.target.value);
    }

    const handleEnviromentChange = (e) => {
        console.log("Env has changed.");
        let newEnviroment = e.target.value;

        if (newEnviroment === 'Test') {
            setTimeSlot(settings.timeSlot[0]);
        } else {
            setTimeSlot(null);
        }
        setEnviroment(newEnviroment);
    }

    const handleTimeSlotChange = (e) => {
        let newTimeSlot = settings.timeSlot.find((time) => time.representation === e.target.value);
        setTimeSlot(newTimeSlot);
    }

    const addScenarioTest = (event) => {
        let copyActivity = deepCopy(rqa.runtime_quality_analysis.artifacts[selectedActivity]);

        copyActivity.load_design.load_variant = loadDesign.name;
        copyActivity.load_design.design_parameters = loadDesign.designParameters;
        copyActivity.resilience_design.resilience_variant = resilienceDesign.name;
        copyActivity.resilience_design.design_parameters = resilienceDesign.designParameters;
        copyActivity.response_measures = responseMeasures;
        rqa.runtime_quality_analysis.artifacts[selectedActivity] = copyActivity;

        // set the settings config
        rqa.runtime_quality_analysis.settings.accuracy = accuracy;
        rqa.runtime_quality_analysis.settings.environment = enviroment;
        rqa.runtime_quality_analysis.settings.timeSlot = timeSlot;

        // post the RQA to the axios api
        axios.post(`https://64917f002f2c7ee6c2c85311.mockapi.io/api/v1/rqas`, rqa);

        // close the Scenario Test Window and open the Scenario Explorer
        props.setScenarioTestShow(false);
        props.setScenarioExplorerShow(true);
    }

    //TODO: What does useEffect do here?
    // useEffect(() => {
    //     setSelectedActivity(props.selectedEdge);
    //     let rqaCopy = rqa;
    //     // rqaCopy.runtime_quality_analysis.loadtests[0].artifact = {
    //     //     object: props.selectedEdge?.system,
    //     //     activity: props.selectedEdge?.activity
    //     // }
    //     // rqaCopy.runtime_quality_analysis.loadtests[0].description = props.selectedEdge?.name
    //     setRqa(rqaCopy);
    // }, [props.selectedEdge]);

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

    return (
        <>
            <div className="p-4 prose overflow-scroll h-full"
                 style={{width: `${sidebarWidth}px`, cursor: isResizing ? 'col-resize' : 'default',}}>
                <h3>Scenario Test Specification</h3>
                <div className="actvity-container">
                    <label className="label">
                        <span className="label-text">Activity</span>
                    </label>
                    <select value={selectedActivity.name} onChange={handleSelectionChange} id=""
                            className="select select-bordered w-full max-w-xs">
                        {uniqueActivitys.map((edge) => {
                            return <option value={edge.name} key={edge.id}>{edge.name}</option>
                        })}
                    </select>
                </div>

                <div className="actvity-container">
                    <div className="actvity-container">
                        <label className="label">
                            <h3>
                                Load Design
                                <span className="ml-1 font-normal text-sm" data-tooltip-id="response-measure-tooltip"
                                      data-tooltip-place="right"
                                      data-tooltip-content='The Load Design allows you to further design the simulated load depending on the selected stimulus. For instance, if you design a "Load Peak" stimulus, you will need to specify the final peak to be achieved and how long it takes to reach it.'>&#9432;</span>
                            </h3>
                            <Tooltip id="response-measure-tooltip" style={{maxWidth: '256px'}}/>
                        </label>
                        <select value={loadDesign.name} onChange={handleLoadDesignChange} id=""
                                className="select select-bordered w-full max-w-xs">
                            {allRqs.loadDesign.map((loadVariant) => {
                                return <option value={loadVariant.name}
                                               key={loadVariant.name}>{loadVariant.name}</option>
                            })}
                        </select>
                        <div className="actvity-container">
                            {allRqs.loadDesign.map((loadVariant) => {
                                return (
                                    <>
                                        {loadVariant.name === loadDesign.name ? loadVariant.designParameters != null && loadVariant.designParameters.map((parameter, index) => {
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
                                                                           onClick={() => handleLoadDesignParameterChange(value, index)}
                                                                           name={parameter.name}
                                                                           data-title={value.name}
                                                                           className="btn"
                                                                           data-tooltip-id={value.name + '-' + value.value}
                                                                           data-tooltip-content={'Value: ' + value.value}/>
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

                    <div className="actvity-container">
                        <label className="label">
                            <h3>
                                Resilience Design
                                <span className="ml-1 font-normal text-sm" data-tooltip-id="response-measure-tooltip"
                                      data-tooltip-place="right"
                                      data-tooltip-content='The Load Design allows you to further design the simulated load depending on the selected stimulus. For instance, if you design a "Load Peak" stimulus, you will need to specify the final peak to be achieved and how long it takes to reach it.'>&#9432;</span>
                            </h3>
                            <Tooltip id="response-measure-tooltip" style={{maxWidth: '256px'}}/>
                        </label>
                        <select value={resilienceDesign.name} onChange={handleResilienceDesignChange} id=""
                                className="select select-bordered w-full max-w-xs">
                            {allRqs.resilienceDesign.map((resilienceVariant) => {
                                return <option value={resilienceVariant.name}
                                               key={resilienceVariant.name}>{resilienceVariant.name}</option>
                            })}
                        </select>
                        {/*TODO: Add Tooltip for each element*/}
                        <div className="actvity-container">
                            {allRqs.resilienceDesign.map((resilienceVariant) => {
                                return (
                                    <>
                                        {resilienceVariant.name === resilienceDesign.name ? resilienceVariant.designParameters != null && resilienceVariant.designParameters.map((parameter, index) => {
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
                                                                           onClick={() => handleResilienceDesignParameterChange(value, index)}
                                                                           name={parameter.name}
                                                                           data-title={value.name}
                                                                           className="btn"
                                                                           data-tooltip-id={value.name + '-' + value.value}
                                                                           data-tooltip-content={'Value: ' + value.value}/>
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
                </div>

                <div className="activity-container">
                    <h3>Metrics</h3>
                    <p>
                        The Metrics to include into the Scenario Test
                        <span className="ml-1 font-normal text-sm" data-tooltip-place="right"
                              data-tooltip-id="metrics-tooltip"
                              data-tooltip-content='You may check one or multiple of these fields to tell the system which metrics you would like to include in the final analysis results.'>&#9432;</span>
                    </p>
                    <Tooltip id="metrics-tooltip" style={{maxWidth: '256px'}}/>
                    <div className="activity-container">
                        {metrics.map((metric) => {
                            return (<div>
                                <label className="label">
                                    <span className="label-text">{metric.name}</span>
                                </label>
                                <div className="btn-group">
                                    {metric.values.map((value) => {
                                        return (<>
                                            <input type="radio" value={value}
                                                   onClick={() => handleResponseParameterChange(metric.name, value)}
                                                   name={metric.name} data-title={value.name}
                                                   className="btn"
                                                   data-tooltip-id={value.name + '-' + value.value}
                                                   data-tooltip-content={'Value: ' + value.value}/>
                                            <Tooltip id={value.name + '-' + value.value}/>
                                        </>)
                                    })}
                                </div>
                            </div>)
                        })}
                    </div>
                </div>

                <div className="activity-container">
                    <h3>Settings</h3>
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
                            <select value={timeSlot.representation} onChange={handleTimeSlotChange} id=""
                                    className="select select-bordered w-full max-w-xs">
                                {settings.timeSlot.map((timeSlot) => {
                                    return <option value={timeSlot.representation}
                                                   key={timeSlot.representation}>{timeSlot.representation}</option>
                                })}
                            </select>
                        </div>
                        : null}
                </div>

                <button onClick={addScenarioTest} className="btn btn-primary">
                    Add Test
                </button>

            </div>
            <ResizeBar setIsResizing={setIsResizing} setSidebarWidth={setSidebarWidth}/>
        </>)

}
