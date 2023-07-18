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
    const responseMeasures = scenarioSpecs.responseMeasures;
    const settings = scenarioSpecs.settings;

    let initRQADefiniton = {
        context: mapping.context,
        environment: mapping.server_info[0].environment,
        runtime_quality_analysis: {
            // scenariotests: [ {
            //
            // }]

            resilience: [],
            loadtests: [
                {
                    artifact: {object: props.selectedEdge?.system, activity: props.selectedEdge?.activity},
                    description: props.selectedEdge?.name,
                    parametrization: props.selectedEdge?.parametrization,
                    response_measure: {},
                    result_metrics: [],
                    stimulus: {
                        load_profile: allRqs[0].name.toUpperCase().replace(/\s+/g, '_'),
                        accuracy: 0
                    }
                }
            ]
        }
    }


    const [selectedActivity, setSelectedActivity] = useState(props.selectedEdge);
    const [rqs, setRqs] = useState(allRqs[0]);
    const [accuracy, setAccuracy] = useState(0);
    const [designParameters, setDesignParameters] = useState(allRqs[0].designParameters);
    // Later there could be more than one response measure...
    const [responseMeasure, setResponseMeasure] = useState([]);


    // state-based RQA-definition
    const [rqa, setRqa] = useState(initRQADefiniton);

    const [includedMetrics, setIncludedMetrics] = useState(["response_time"]);

    const reactFlowInstance = useReactFlow();

    const uniqueActivitys = props.edges.filter(
        (obj, index, self) => {
            return index === self.findIndex((t) => (
                t.name === obj.name
            ));
        });

    const handleSelectionChange = (e) => {

        let relatedEdgesArray = reactFlowInstance.getEdges().filter((edge) => edge.name == e.target.value);
        let unrelatedEdgesArray = reactFlowInstance.getEdges().filter((edge) => edge.name != e.target.value);

        let rqaArtifact;

        // const regexId = /^system_(\w+)$/;
        // const idMatch = regexId.exec(edgeToService.source);
        // const serviceId = idMatch ? idMatch[1] : null;

        unrelatedEdgesArray.forEach((edge) => {
            edge.selected = false;
        })

        relatedEdgesArray.forEach((edge) => {
            edge.selected = true;
        })

        let newEdgesArray = relatedEdgesArray.concat(unrelatedEdgesArray);

        // add the unselected version od the edge
        reactFlowInstance.setEdges(newEdgesArray);
        setSelectedActivity(e.target.value);
        let rqaCopy = rqa;


        // Only works with one loadtest
        rqaCopy.runtime_quality_analysis.loadtests[0].artifact.object = props.selectedEdge?.system;
        rqaCopy.runtime_quality_analysis.loadtests[0].artifact.activity = props.selectedEdge?.activity;
        rqaCopy.runtime_quality_analysis.loadtests[0].description = props.selectedEdge?.name;
        console.log(rqaCopy.runtime_quality_analysis.loadtests[0]);

        setRqa(rqaCopy);
    }

    const handleRqsChange = (e) => {
        const newRqs = allRqs.find((rqs) => rqs.name == e.target.value);
        let rqaCopy = rqa;
        rqaCopy.runtime_quality_analysis.loadtests[0].rqs.load_profile = e.target.value.toUpperCase().replace(/\s+/g, '_');
        console.log(newRqs);
        setRqs(newRqs);
        setDesignParameters(newRqs.designParameters);
        setRqa(rqaCopy);
    }

    const handleStimulusChange = (e) => {
        const newRqs = allRqs.find((rqs) => rqs.name == e.target.value);
        let rqaCopy = rqa;
        rqaCopy.runtime_quality_analysis.loadtests[0].rqs.load_profile = e.target.value.toUpperCase().replace(/\s+/g, '_');
        console.log(newRqs);
        setRqs(newRqs);
        setDesignParameters(newRqs.designParameters);
        setRqa(rqaCopy);
    }

    const handleAccuracyChange = (e) => {
        setAccuracy(e.target.value);
        let rqaCopy = rqa;
        rqaCopy.runtime_quality_analysis.loadtests[0].rqs.accuracy = e.target.value;
        console.log(accuracy);
    }

    const handleMetricsChange = (e) => {
        const value = e.target.value;
        const isChecked = e.target.checked;
        let rqaCopy = rqa;
        if (isChecked) {
            setIncludedMetrics([...includedMetrics, value]);
            rqaCopy.runtime_quality_analysis.loadtests[0].result_metrics.push(value);
        } else {
            setIncludedMetrics(includedMetrics.filter(item => item !== value));
            rqaCopy.runtime_quality_analysis.loadtests[0].result_metrics.filter((metric) => metric !== value);
        }
    }

    const handleDesignParameterChange = (e) => {
        const parameter_name = e.target.parentNode.id.toLowerCase().replace(/\s+/g, '_');
        const value = e.target.value.toUpperCase().replace(/\s+/g, '_');
        let rqaCopy = rqa;
        rqaCopy.runtime_quality_analysis.loadtests[0].rqs[parameter_name] = value;
        setRqa(rqaCopy);
        //setStimulusParameters([...stimulusParameters], parameter)
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
            rqaCopy.runtime_quality_analysis.loadtests[0].response_measure[measureNameRqaFormatted] = value;
            setRqa(rqaCopy);

        } else {
            // If an object with the measurename already exists, update its value property
            const updatedResponseMeasure = [...responseMeasure];
            updatedResponseMeasure[index].value = value;
            setResponseMeasure(updatedResponseMeasure);
            rqaCopy.runtime_quality_analysis.loadtests[0].response_measure[measureNameRqaFormatted] = value;
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
        let a = 100;    //Test command
        //submitScenariotest();
    }

    useEffect(() => {
        setSelectedActivity(props.selectedEdge);
        let rqaCopy = rqa;
        rqaCopy.runtime_quality_analysis.loadtests[0].artifact = {
            object: props.selectedEdge?.system,
            activity: props.selectedEdge?.activity
        }
        rqaCopy.runtime_quality_analysis.loadtests[0].description = props.selectedEdge?.name
        setRqa(rqaCopy);
    }, [props.selectedEdge]);

    return (
        <>
            <div className="p-4 prose overflow-scroll h-full"
                 style={{width: `${sidebarWidth}px`, cursor: isResizing ? 'col-resize' : 'default',}}>
                <h3>Scenario Test Specification</h3>
                <div className="actvity-container">
                    <label className="label">
                        <span className="label-text">Activity</span>
                    </label>
                    <select value={selectedActivity?.name} onChange={handleSelectionChange} id=""
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
                                <span className="ml-1 font-normal text-sm" data-tooltip-id="response-measure-tooltip" data-tooltip-place="right" data-tooltip-content='The Load Design allows you to further design the simulated load depending on the selected stimulus. For instance, if you design a "Load Peak" stimulus, you will need to specify the final peak to be achieved and how long it takes to reach it.'>&#9432;</span>
                            </h3>
                            <Tooltip id="response-measure-tooltip" style={{ maxWidth: '256px' }} />
                        </label>
                        {/*<select value={rqs.name} onChange={handleStimulusChange} id="" className="select select-bordered w-full max-w-xs">*/}
                        {/*    /!*{rqs.loadDesign.map((stimulus) => {*!/*/}
                        {/*    /!*    return <option value={stimulus.name} key={stimulus.name}>{stimulus.name}</option>*!/*/}
                        {/*    /!*})}*!/*/}
                        {/*</select>*/}
                        <select id="" className="select select-bordered w-full max-w-xs">
                            <option value={0}>None</option>
                            <option value={1}>Load Peak</option>
                            <option value={2}>Load Increase</option>
                            <option value={3}>Constant Load</option>
                        </select>
                        <div className="actvity-container">
                            <div>
                                <label className="label">
                                    <span className="label-text">
                                        Highest Load
                                        <span className="ml-1 font-normal text-sm" data-tooltip-id="response-measure-tooltip" data-tooltip-place="right" data-tooltip-content='The highest load defines how many users you simulate at most, therefor, the higher you select this field, the more users your test will simulate.'>&#9432;</span>
                                    </span>
                                </label>
                                <div className="btn-group">
                                    <input type="radio" value={10} onClick={handleDesignParameterChange} name={1} data-title="High" className="btn" data-tooltip-id={1} data-tooltip-content={'Value: ' + 10} />
                                    <Tooltip id={1} />
                                    <input type="radio" value={15} onClick={handleDesignParameterChange} name={2} data-title="Very High" className="btn" data-tooltip-id={2} data-tooltip-content={'Value: ' + 15} />
                                    <Tooltip id={2} />
                                    <input type="radio" value={20} onClick={handleDesignParameterChange} name={3} data-title="Extremly High" className="btn" data-tooltip-id={3} data-tooltip-content={'Value: ' + 20} />
                                    <Tooltip id={3} />
                                </div>
                                <label className="label">
                                    <span className="label-text">
                                        Time to Highest Load
                                        <span className="ml-1 font-normal text-sm" data-tooltip-id="response-measure-tooltip" data-tooltip-place="right" data-tooltip-content='The highest load defines how many users you simulate at most, therefor, the higher you select this field, the more users your test will simulate.'>&#9432;</span>
                                    </span>
                                </label>
                                <div className="btn-group">
                                    <input type="radio" value={10} onClick={handleDesignParameterChange} name={1} data-title="Slow" className="btn" data-tooltip-id={1} data-tooltip-content={'Value: ' + 10} />
                                    <Tooltip id={1} />
                                    <input type="radio" value={15} onClick={handleDesignParameterChange} name={2} data-title="Fast" className="btn" data-tooltip-id={2} data-tooltip-content={'Value: ' + 15} />
                                    <Tooltip id={2} />
                                    <input type="radio" value={20} onClick={handleDesignParameterChange} name={3} data-title="Very Fast" className="btn" data-tooltip-id={3} data-tooltip-content={'Value: ' + 20} />
                                    <Tooltip id={3} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="actvity-container">
                        <label className="label">
                            <h3>
                                Resilience Design
                                <span className="ml-1 font-normal text-sm" data-tooltip-id="response-measure-tooltip" data-tooltip-place="right" data-tooltip-content='The Load Design allows you to further design the simulated load depending on the selected stimulus. For instance, if you design a "Load Peak" stimulus, you will need to specify the final peak to be achieved and how long it takes to reach it.'>&#9432;</span>
                            </h3>
                            <Tooltip id="response-measure-tooltip" style={{ maxWidth: '256px' }} />
                        </label>
                        <select id="" className="select select-bordered w-full max-w-xs">
                            <option value={0}>None</option>
                            <option value={1}>Failed Request</option>
                            <option value={2}>Late Response</option>
                            <option value={3}>Unavailable</option>
                        </select>
                        <div className="actvity-container">
                            <div>
                                <label className="label">
                                    <span className="label-text">
                                        Error Rates
                                        <span className="ml-1 font-normal text-sm" data-tooltip-id="response-measure-tooltip" data-tooltip-place="right" data-tooltip-content='The highest load defines how many users you simulate at most, therefor, the higher you select this field, the more users your test will simulate.'>&#9432;</span>
                                    </span>
                                </label>
                                <div className="btn-group">
                                    <input type="radio" value={10} onClick={handleDesignParameterChange} name={1} data-title="None" className="btn" data-tooltip-id={1} data-tooltip-content={'Value: ' + 10} />
                                    <Tooltip id={1} />
                                    <input type="radio" value={15} onClick={handleDesignParameterChange} name={2} data-title="Low" className="btn" data-tooltip-id={2} data-tooltip-content={'Value: ' + 15} />
                                    <Tooltip id={2} />
                                    <input type="radio" value={20} onClick={handleDesignParameterChange} name={3} data-title="Medium" className="btn" data-tooltip-id={3} data-tooltip-content={'Value: ' + 20} />
                                    <Tooltip id={3} />
                                    <input type="radio" value={25} onClick={handleDesignParameterChange} name={4} data-title="High" className="btn" data-tooltip-id={4} data-tooltip-content={'Value: ' + 25} />
                                    <Tooltip id={4} />
                                </div>
                                <label className="label">
                                    <span className="label-text">
                                        Time to Highest Load
                                        <span className="ml-1 font-normal text-sm" data-tooltip-id="response-measure-tooltip" data-tooltip-place="right" data-tooltip-content='The highest load defines how many users you simulate at most, therefor, the higher you select this field, the more users your test will simulate.'>&#9432;</span>
                                    </span>
                                </label>
                                <div className="btn-group">
                                    <input type="radio" value={10} onClick={handleDesignParameterChange} name={1} data-title="Slow" className="btn" data-tooltip-id={1} data-tooltip-content={'Value: ' + 10} />
                                    <Tooltip id={1} />
                                    <input type="radio" value={15} onClick={handleDesignParameterChange} name={2} data-title="Fast" className="btn" data-tooltip-id={2} data-tooltip-content={'Value: ' + 15} />
                                    <Tooltip id={2} />
                                    <input type="radio" value={20} onClick={handleDesignParameterChange} name={3} data-title="Very Fast" className="btn" data-tooltip-id={3} data-tooltip-content={'Value: ' + 20} />
                                    <Tooltip id={3} />
                                </div>
                                <label className="label">
                                    <span className="label-text">
                                        How often do you want the stimulus to occur?
                                        <span className="ml-1 font-normal text-sm" data-tooltip-id="response-measure-tooltip" data-tooltip-place="right" data-tooltip-content='The highest load defines how many users you simulate at most, therefor, the higher you select this field, the more users your test will simulate.'>&#9432;</span>
                                    </span>
                                </label>
                                <div className="btn-group">
                                    <input type="radio" value={10} onClick={handleDesignParameterChange} name={1} data-title="One" className="btn" data-tooltip-id={1} data-tooltip-content={'Value: ' + 10} />
                                    <Tooltip id={1} />
                                    <input type="radio" value={15} onClick={handleDesignParameterChange} name={2} data-title="More than once" className="btn" data-tooltip-id={2} data-tooltip-content={'Value: ' + 15} />
                                    <Tooltip id={2} />
                                    <input type="radio" value={20} onClick={handleDesignParameterChange} name={3} data-title="Randomly" className="btn" data-tooltip-id={3} data-tooltip-content={'Value: ' + 20} />
                                    <Tooltip id={3} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="activity-container">
                    <h3>Metrics</h3>
                    <p>
                        The Metrics to include into the Scenario Test
                        <span className="ml-1 font-normal text-sm" data-tooltip-place="right" data-tooltip-id="metrics-tooltip" data-tooltip-content='You may check one or multiple of these fields to tell the system which metrics you would like to include in the final analysis results.'>&#9432;</span>
                    </p>
                    <Tooltip id="metrics-tooltip" style={{ maxWidth: '256px' }} />
                    <div className="activity-container">
                        {settings.metrics.map((metric) => {
                            return (
                                <div>
                                    <label className="label">
                                        <span className="label-text">{metric.name}</span>
                                    </label>
                                    <div className="btn-group">
                                        {metric.values.map((value) => {
                                            return (
                                                <React.Fragment>
                                                    <input type="radio" value={value.name} onClick={handleResponseMeasureChange} name={responseMeasure.name} data-title={value.name} className="btn" data-tooltip-id={value.name + '-' + value.value} data-tooltip-content={'Value: ' + value.value} />
                                                    <Tooltip id={value.name + '-' + value.value} />
                                                </React.Fragment>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
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
        </>
    )

}
