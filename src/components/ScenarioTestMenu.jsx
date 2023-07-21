import React, {useEffect, useState} from 'react'
import {useEdges, useOnSelectionChange, useReactFlow} from 'reactflow';
import * as scenarioSpecs from '../data/scenariotest-specs.json';
import ResizeBar from './ResizeBar';
import * as mapping from '../data/werkstatt.json';
import {Tooltip} from 'react-tooltip'

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

    // [
    //     {
    //         artifact: {object: props.selectedEdge?.system, activity: props.selectedEdge?.activity},
    //         description: props.selectedEdge?.name,
    //         load_design: {
    //             load_variant: null,
    //             design_parameters: null
    //         },
    //         resilience_design: {
    //             load_variant: null,
    //             design_parameters: null
    //         },
    //         response_measure: {}
    //     }
    // ],

    let initRQADefiniton = {
        context: mapping.context, environment: mapping.server_info[0].environment, runtime_quality_analysis: {
            artifacts: [], settings: {
                accuracy: 0, environment: settings.enviroment[0], timeSlot: null
            }

            // resilience: [],
            // loadtests: [
            //     {
            //         artifact: {object: props.selectedEdge?.system, activity: props.selectedEdge?.activity},
            //         description: props.selectedEdge?.name,
            //         parametrization: props.selectedEdge?.parametrization,
            //         response_measure: {},
            //         result_metrics: [],
            //         stimulus: {
            //             load_profile: allRqs.loadDesign[0].name.toUpperCase().replace(/\s+/g, '_'),
            //             accuracy: 0
            //         }
            //     }
            // ]
        }
    }

    // initialize the artifacts key with the activities in the domain
    props.edges.forEach((edge) => {
        if (edge.activity !== undefined) {
            initRQADefiniton.runtime_quality_analysis.artifacts.push({
                artifact: {object: edge.system, activity: edge.activity}, description: edge.name, load_design: {
                    load_variant: null, design_parameters: null
                }, resilience_design: {
                    load_variant: null, design_parameters: null
                }, response_measures: {}
            });
        }
    });

    const [selectedActivity, setSelectedActivity] = useState(0);
    const [loadDesign, setLoadDesign] = useState(allRqs.loadDesign[0]);
    const [loadDesignParameters, setLoadDesignParameters] = useState([]);    //null
    const [resilienceDesign, setResilienceDesign] = useState(allRqs.resilienceDesign[0]);
    //const [resilienceDesignParameters, setResilienceDesignParameters] = useState(allRqs.resilienceDesign[0].designParameters);    //null
    // Later there could be more than one response measure...
    const [responseMeasure, setResponseMeasure] = useState({});
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

        // updates reactFlowInstance
        let relatedEdgesArray = reactFlowInstance.getEdges().filter((edge) => edge.name == e.target.value);
        let unrelatedEdgesArray = reactFlowInstance.getEdges().filter((edge) => edge.name != e.target.value);

        unrelatedEdgesArray.forEach((edge) => {
            edge.selected = false;
        })

        relatedEdgesArray.forEach((edge) => {
            edge.selected = true;
        })

        let newEdgesArray = relatedEdgesArray.concat(unrelatedEdgesArray);

        // add the unselected version od the edge
        reactFlowInstance.setEdges(newEdgesArray);

        //let rqaCopy = rqa;

        // update the view for the selected edge
        //let newSelectedActivity = rqa.runtime_quality_analysis.artifacts.findIndex((artifact) => artifact.description === e.target.value);
        setSelectedActivity(e.target.value);

        // Only works with one loadtest
        // rqaCopy.runtime_quality_analysis.loadtests.artifacts[selectedActivity].artifact.object = props.selectedEdge?.system;
        // rqaCopy.runtime_quality_analysis.loadtests.artifacts[selectedActivity].artifact.activity = props.selectedEdge?.activity;
        // rqaCopy.runtime_quality_analysis.loadtests.artifacts[selectedActivity].description = props.selectedEdge?.name;
        //  console.log(selectedActivity);
        // setSelectedActivity(e.target.value);
        // console.log(rqa.runtime_quality_analysis.artifacts.indexOf(e.target));
        //console.log(rqaCopy.runtime_quality_analysis.artifacts[selectedActivity]);
        //
        // setRqa(rqaCopy);
    }

    const handleLoadDesignChange = (e) => {
        let loadVariant = allRqs.loadDesign.find((loadVariant) => loadVariant.name === e.target.value);
        let copyLoadVariant = deepCopy(loadVariant);

        copyLoadVariant.designParameters.forEach((parameter) => {
            delete parameter.values;
            parameter.value = null;
        });
        setLoadDesign(copyLoadVariant);
    }

    const handleLoadDesignParameterChange = (value, index) => {
        //let entity = object;
        //let index = loadDesign.designParameters.findIndex;
        let copyDesignParameter = deepCopy(loadDesign.designParameters[index]);
        copyDesignParameter.value = value;
        let newLoadDesign = deepCopy(loadDesign);

        newLoadDesign.designParameters[index] = copyDesignParameter;
        // (((parameter) => parameter.name === object.name));
        // ((parameter) => parameter.name === object.name);
        // let values = loadDesign.designParameters[index].values;
        //setLoadDesignParameters((oldParameters) => oldParameters.push(newDesignParameter));
        setLoadDesign(newLoadDesign);
    }

    const handleRqsChange = (e) => {
        const newRqs = allRqs.find((rqs) => rqs.name === e.target.value);
        let rqaCopy = rqa;
        //rqaCopy.runtime_quality_analysis.loadtests[0].rqs.load_profile = e.target.value.toUpperCase().replace(/\s+/g, '_');
        console.log(newRqs);
        setRqs(newRqs);
        setDesignParameters(newRqs.designParameters);
        setRqa(rqaCopy);
    }

    const handleStimulusChange = (e) => {
        const newRqs = allRqs.loadDesign.find((rqs) => rqs.name == e.target.value);
        let rqaCopy = rqa;
        //rqaCopy.runtime_quality_analysis.loadtests[0].stimulus = e.target.value.toUpperCase().replace(/\s+/g, '_');
        console.log(newRqs);
        //setRqs(newRqs);
        //setDesignParameters(newRqs.designParameters);
        //setRqa(rqaCopy);
    }

    const handleAccuracyChange = (e) => {
        setAccuracy(e.target.value);
        let rqaCopy = rqa;
        //rqaCopy.runtime_quality_analysis.loadtests[0].rqs.accuracy = e.target.value;
        console.log(accuracy);
    }

    const handleMetricsChange = (e) => {
        const value = e.target.value;
        const isChecked = e.target.checked;
        let rqaCopy = rqa;
        if (isChecked) {
            setIncludedMetrics([...includedMetrics, value]);
            //rqaCopy.runtime_quality_analysis.loadtests[0].result_metrics.push(value);
        } else {
            setIncludedMetrics(includedMetrics.filter(item => item !== value));
            //rqaCopy.runtime_quality_analysis.loadtests[0].result_metrics.filter((metric) => metric !== value);
        }
    }

    const handleDesignParameterChange = (e) => {
        const parameter_name = e.target.parentNode.id.toLowerCase().replace(/\s+/g, '_');
        const value = e.target.value.toUpperCase().replace(/\s+/g, '_');
        let rqaCopy = rqa;
        //rqaCopy.runtime_quality_analysis.loadtests[0].rqs.loadDesign[parameter_name] = value;
        setRqa(rqaCopy);
        setStimulusParameters([...stimulusParameters], parameter)
    }

    const handleResponseMeasureChange = (event) => {
        const measureName = event.target.parentNode.parentNode.firstChild.innerText;
        const value = event.target.value.toUpperCase();
        let rqaCopy = rqa;

        // Check if an object with the measurename already exists in the responseMeasure-State
        const index = responseMeasure.findIndex((obj) => obj.measureName === measureName);

        let measureNameRqaFormatted = measureName.toLowerCase().replace(/\s+/g, '_');

        if (index === -1) {
            // If an object with the measurename does not exist, add a new object to the responseMeasure array
            setResponseMeasure([...responseMeasure, {value, measureName}]);
            //rqaCopy.runtime_quality_analysis.loadtests[0].response_measure[measureNameRqaFormatted] = value;
            setRqa(rqaCopy);

        } else {
            // If an object with the measurename already exists, update its value property
            const updatedResponseMeasure = [...responseMeasure];
            updatedResponseMeasure[index].value = value;
            setResponseMeasure(updatedResponseMeasure);
            //rqaCopy.runtime_quality_analysis.loadtests[0].response_measure[measureNameRqaFormatted] = value;
            setRqa(rqaCopy);

        }
        console.log(responseMeasure)

    }

    const handleEnviromentChange = (event) => {
        console.log("Env has changed.");

    }

    const handleTimeSlotChange = (event) => {
        console.log("Time slot has changed.");
    }

    const submitScenariotest = () => {

        const selectedEdges = reactFlowInstance.getEdges().filter((edge) => edge.selected == true);
        const regex = /^system_/; // matches strings that start with "system_"

        //only works with one Service in path...
        const edgeToService = selectedEdges.find((edge) => regex.test(edge.source));

        const regexId = /^system_(\w+)$/;
        const idMatch = regexId.exec(edgeToService.source);
        const serviceId = idMatch ? idMatch[1] : null;

        let includedMetricsFormatted = [];
        includedMetrics.forEach((metric) => {
            let formattedMetric = metric.toUpperCase().replace(/\s+/g, '_');
            includedMetricsFormatted.push(formattedMetric);
        });

        //TODO: Validate, if all the Settings are set.

        //First server_info of the mapping is hardcoded
        // Only the response_measure "response_time" is used for now. RQA-Definition Schema should be changed in dqTranslator
        // const rqaDefinition = {
        //     context: mapping.context,
        //     environment: mapping.server_info[0].environment,
        //     runtime_quality_analysis: {
        //         resilience: [],
        //         loadtests: [
        //             {
        //                 artifact: {
        //                     object: serviceId,
        //                     activity: selectedActivity.mappingId
        //                 },
        //                 description: selectedActivity.name,
        //                 parametrization: selectedActivity.parametrization,
        //                 response_measure: { response_time: responseMeasure[0].value },
        //                 result_metrics: includedMetricsFormatted

        //             }
        //         ]
        //     }
        // }

        console.log("Current RQA:");
        console.log(rqa);
    }

    const addScenarioTest = (event) => {
        let a = selectedActivity;
        let copyRqa = deepCopy(rqa);
        let copyActivity = deepCopy(rqa.runtime_quality_analysis.artifacts[selectedActivity]);
        copyActivity.load_design.load_variant = loadDesign.name;
        copyActivity.load_design.design_parameters = loadDesign.designParameters;
        copyRqa.runtime_quality_analysis.artifacts[selectedActivity] = copyActivity;
        // copyActivity
        // copyRqa.runtime_quality_analysis.

        //Test command
        //submitScenariotest();
        console.log("Current RQA:");
        console.log(copyRqa);
        setRqa(copyRqa);
    }

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

    return (<React.Fragment>
        <div className="p-4 prose overflow-scroll h-full"
             style={{width: `${sidebarWidth}px`, cursor: isResizing ? 'col-resize' : 'default',}}>
            <h3>Scenario Test Specification</h3>
            <div className="actvity-container">
                <label className="label">
                    <span className="label-text">Activity</span>
                </label>
                <select value={selectedActivity} onChange={handleSelectionChange} id=""
                        className="select select-bordered w-full max-w-xs">
                    {uniqueActivitys.map((edge) => {
                        return <option value={edge.name} key={edge.id}>{edge.name}</option>
                    })}
                </select>
            </div>
            {/*<div className="actvity-container">*/}
            {/*    <label className="label">*/}
            {/*		<span className="label-text">*/}
            {/*			Scenario*/}
            {/*			<span className="ml-1 font-normal text-sm" data-tooltip-id="stimulus-tooltip"*/}
            {/*                  data-tooltip-place="right"*/}
            {/*                  data-tooltip-content='The stimulus specifies how the load should look like. For instance, a "Load peak" will lead to a massive spike in simulated users accessing the application in a secure environment whereas a "Load Increase" may lead to a slow in crease in users accessing the application.'>&#9432;</span>*/}
            {/*		</span>*/}
            {/*    </label>*/}
            {/*    <Tooltip id="stimulus-tooltip" style={{maxWidth: '256px'}}/>*/}
            {/*    <select value={rqs} onChange={handleRqsChange} id=""*/}
            {/*            className="select select-bordered w-full max-w-xs">*/}
            {/*        {allRqs.map((rqs) => {*/}
            {/*            return <option value={rqs.name} key={rqs.name}>{rqs.name}</option>*/}
            {/*        })}*/}
            {/*    </select>*/}
            {/*</div>*/}

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
                                <React.Fragment>
                                    {loadVariant.name === loadDesign.name ? loadVariant.designParameters != null && loadVariant.designParameters.map((parameter, index) => {
                                        return (
                                            <React.Fragment>
                                                <label className="label">
                                                    <span className="label-text">
                                                        {parameter.name}
                                                    </span>
                                                </label>
                                                <div className="btn-group">
                                                    {parameter.values != null && parameter.values.map((value) => {
                                                        return (
                                                            <React.Fragment>
                                                                <input type="radio" value={value}
                                                                       onClick={() => handleLoadDesignParameterChange(value, index)}
                                                                       name={parameter.name}
                                                                       data-title={value.name}
                                                                       className="btn"
                                                                       data-tooltip-id={value.name + '-' + value.value}
                                                                       data-tooltip-content={'Value: ' + value.value}/>
                                                                <Tooltip
                                                                    id={value.name + '-' + value.value}/>
                                                            </React.Fragment>
                                                        )
                                                    })}
                                                </div>
                                            </React.Fragment>
                                        )
                                    }) : null
                                    }
                                </React.Fragment>)
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
                    <select value={resilienceDesign} onChange={handleStimulusChange} id=""
                            className="select select-bordered w-full max-w-xs">
                        {allRqs.resilienceDesign.map((resilienceVariant) => {
                            return <option value={resilienceVariant.name}
                                           key={resilienceVariant.name}>{resilienceVariant.name}</option>
                        })}
                    </select>
                    {/*TODO: Add Tooltip for each element*/}
                    <div className="actvity-container">
                        {allRqs.resilienceDesign.map((resilienceDesign) => {
                            return (<div>
                                {/*TODO: The designparams should only be visible for the right resilienceDesign*/}
                                {resilienceDesign.designParameters != null && resilienceDesign.designParameters.map((parameter) => {
                                    return (<React.Fragment>
                                        <label className="label">
										                <span className="label-text">
                                                            {parameter.name}
                                                        </span>
                                        </label>
                                        <div className="btn-group">
                                            {parameter.values.map((value) => {
                                                return (<React.Fragment>
                                                    <input type="radio" value={value.name}
                                                           onClick={handleDesignParameterChange}
                                                           name={parameter.name} data-title={value.name}
                                                           className="btn"
                                                           data-tooltip-id={value.name + '-' + value.value}
                                                           data-tooltip-content={'Value: ' + value.value}/>
                                                    <Tooltip id={value.name + '-' + value.value}/>
                                                </React.Fragment>)
                                            })}
                                        </div>
                                    </React.Fragment>)
                                })}
                            </div>)
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
                                    return (<React.Fragment>
                                        <input type="radio" value={value.name}
                                               onClick={handleResponseMeasureChange}
                                               name={responseMeasure.name} data-title={value.name}
                                               className="btn"
                                               data-tooltip-id={value.name + '-' + value.value}
                                               data-tooltip-content={'Value: ' + value.value}/>
                                        <Tooltip id={value.name + '-' + value.value}/>
                                    </React.Fragment>)
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
                    <select value={settings.enviroment} onChange={handleEnviromentChange} id=""
                            className="select select-bordered w-full max-w-xs">
                        {settings.enviroment.map((enviroment) => {
                            return <option value={enviroment} key={enviroment}>{enviroment}</option>
                        })}
                    </select>
                </div>

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
                    <select value={settings.timeSlot} onChange={handleTimeSlotChange} id=""
                            className="select select-bordered w-full max-w-xs">
                        {settings.timeSlot.map((timeSlot) => {
                            return <option value={timeSlot} key={timeSlot}>{timeSlot.representation}</option>
                        })}
                    </select>
                </div>
            </div>

            <button onClick={addScenarioTest} className="btn btn-primary">
                Add Test
            </button>

        </div>
        <ResizeBar setIsResizing={setIsResizing} setSidebarWidth={setSidebarWidth}/>
    </React.Fragment>)

}
