import React, { useEffect, useState } from 'react'
import { useEdges, useOnSelectionChange, useReactFlow } from 'reactflow';
import * as loadtestSpecs from '../data/loadtest-specs.json';

export default function LoadTestMenu(props) {

    // Getting Loadtest Definition Parameters from the Json
    const stimuluses = loadtestSpecs.stimuluses;
    const responseMeasures = loadtestSpecs.responseMeasures;
    const metrics = loadtestSpecs.metrics;


    const [selectedActivity, setSelectedActivity] = useState(props.selectedEdge);
    const [stimulus, setStimulus] = useState(stimuluses[0]);
    const [accuracy, setAccuracy] = useState(0);
    const [designParameters, setDesignParameters] = useState(stimuluses[0].designParameters);


    const [includedMetrics, setIncludedMetrics] = useState(["Response Times"]);

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

    }

    const handleStimulusChange = (e) => {
        const newStimulus = stimuluses.find((stimulus) => stimulus.name == e.target.value);
        console.log(newStimulus);
        setStimulus(newStimulus);

        setDesignParameters(newStimulus.designParameters);
    }

    const handleAccuracyChange = (e) => {
        setAccuracy(e.target.value);
        console.log(accuracy);
    }

    const handleMetricsChange = (e) => {
        const value = e.target.value;
        const isChecked = e.target.checked;
        if (isChecked) {
            setIncludedMetrics([...includedMetrics, value]);
        } else {
            setIncludedMetrics(includedMetrics.filter(item => item !== value));
        }

    }

    const submitLoadtest = () => {

    }


    useEffect(() => {
        console.log(props.selectedEdge);
        setSelectedActivity(props.selectedEdge);
    }, [props.selectedEdge]);

    return (
        <>
            <div className="menu-container">
                <h3>Loadtest Specification</h3>
                < div className="actvity-container" >
                    <p>Activity</p>
                    <select value={selectedActivity.name} onChange={handleSelectionChange} id="">
                        {uniqueActivitys.map((edge) => {
                            return <option value={edge.name} key={edge.id}>{edge.name}</option>
                        })}
                    </select>
                </div >
                < div className="actvity-container" >
                    <p>Stimulus</p>
                    <select value={stimulus.name} onChange={handleStimulusChange} id="">
                        {stimuluses.map((stimulus) => {
                            return <option value={stimulus.name} key={stimulus.name}>{stimulus.name}</option>
                        })}
                    </select>
                </div >
                < div className="actvity-container" >
                    <p>Accuracy</p>
                    <div className="slidecontainer">
                        <input type="range" value={accuracy} onChange={handleAccuracyChange} name="" id="" />
                    </div>
                </div >
                < div className="actvity-container" >
                    <p>Response Measure</p>
                    {responseMeasures.map((responseMeasure) => {
                        return (
                            <div>
                                <p>{responseMeasure.name}</p>
                                <div className="button-group">
                                    {responseMeasure.values.map((value) => {
                                        return <button>{value}</button>
                                    })}
                                </div>
                            </div>
                        )
                    })}
                </div >
                <hr />
                <h3>Load Design</h3>
                {stimulus.name == "LOAD PEAK" ?
                    < div className="actvity-container" >
                        {designParameters.map((parameter) => {
                            return (
                                <div>
                                    <p>{parameter.name}</p>
                                    <div className="button-group">
                                        {parameter.values.map((value) => {
                                            return <button>{value}</button>
                                        })}
                                    </div>
                                </div>
                            )
                        })}
                    </div >
                    : stimulus.name == "Load Increase" ?
                        <div className="activity-container">

                            {designParameters.map((parameter) => {
                                return (
                                    <div>
                                        <p>{parameter.name}</p>
                                        <select name="" id="">
                                            {parameter.values.map((value) => {
                                                return (
                                                    <option value="">{value}</option>
                                                )

                                            })}
                                        </select>
                                    </div>
                                )
                            })}

                        </div>
                        : stimulus.name == "Constant Load" ?
                            < div className="actvity-container" >
                                {designParameters.map((parameter) => {
                                    return (
                                        <div>
                                            <p>{parameter.name}</p>
                                            <div className="button-group">
                                                {parameter.values.map((value) => {
                                                    return <button>{value}</button>
                                                })}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div >
                            : null
                }
                <hr />
                <h3>Metrics</h3>
                <p>The Metrics to include into the Load Test</p>

                <div className="activity-container">
                    {metrics.map((metric, index) => {
                        return (
                            <div>
                                <span>{metric}</span>
                                <input type="checkbox"
                                    key={index}
                                    value={metric}
                                    checked={includedMetrics.includes(metric)}
                                    onChange={handleMetricsChange}
                                    name=""
                                    id="" />
                            </div>
                        )
                    })}
                </div>

                <hr />
                <button onClick={submitLoadtest}>
                    Execute
                </button>

            </div >

        </>
    )
}
