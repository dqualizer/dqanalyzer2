import React, { useEffect, useState } from 'react'
import { useEdges, useOnSelectionChange, useReactFlow } from 'reactflow';
import * as loadtestSpecs from '../data/loadtest-specs.json';
import * as mapping from '../data/werkstatt.json';

export default function LoadTestMenu(props) {

	// Getting Loadtest Definition Parameters from the Json
	const stimuluses = loadtestSpecs.stimuluses;
	const responseMeasures = loadtestSpecs.responseMeasures;
	const metrics = loadtestSpecs.metrics;

	let initRQADefiniton = {
		context: mapping.context,
		environment: mapping.server_info[0].environment,
		runtime_quality_analysis: {
			resilience: [],
			loadtests: [
				{
					artifact: { object: props.selectedEdge.system, activity: props.selectedEdge.activity },
					description: props.selectedEdge.name,
					parametrization: props.selectedEdge.parametrization,
					response_measure: {},
					result_metrics: [],
					stimulus: {
						load_profile: stimuluses[0].name.toUpperCase().replace(/\s+/g, '_'),
						accuracy: 0
					}


				}
			]
		}
	}





	const [selectedActivity, setSelectedActivity] = useState(props.selectedEdge);
	const [stimulus, setStimulus] = useState(stimuluses[0]);
	const [accuracy, setAccuracy] = useState(0);
	const [designParameters, setDesignParameters] = useState(stimuluses[0].designParameters);
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
		rqaCopy.runtime_quality_analysis.loadtests[0].artifact.object = props.selectedEdge.system;
		rqaCopy.runtime_quality_analysis.loadtests[0].artifact.activity = props.selectedEdge.activity;
		rqaCopy.runtime_quality_analysis.loadtests[0].description = props.selectedEdge.name;
		console.log(rqaCopy.runtime_quality_analysis.loadtests[0]);

		setRqa(rqaCopy);


	}

	const handleStimulusChange = (e) => {
		const newStimulus = stimuluses.find((stimulus) => stimulus.name == e.target.value);
		let rqaCopy = rqa;
		rqaCopy.runtime_quality_analysis.loadtests[0].stimulus.load_profile = e.target.value.toUpperCase().replace(/\s+/g, '_');
		console.log(newStimulus);
		setStimulus(newStimulus);
		setDesignParameters(newStimulus.designParameters);
		setRqa(rqaCopy);
	}

	const handleAccuracyChange = (e) => {
		setAccuracy(e.target.value);
		let rqaCopy = rqa;
		rqaCopy.runtime_quality_analysis.loadtests[0].stimulus.accuracy = e.target.value;
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
		rqaCopy.runtime_quality_analysis.loadtests[0].stimulus[parameter_name] = value;
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
			setResponseMeasure([...responseMeasure, { value, measureName }]);
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

	const submitLoadtest = () => {

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


	useEffect(() => {
		setSelectedActivity(props.selectedEdge);
		let rqaCopy = rqa;
		rqaCopy.runtime_quality_analysis.loadtests[0].artifact = { object: props.selectedEdge.system, activity: props.selectedEdge.activity }
		rqaCopy.runtime_quality_analysis.loadtests[0].description = props.selectedEdge.name
		setRqa(rqaCopy);
	}, [props.selectedEdge]);


	return (
		<>
			<div className="menu-container prose overflow-scroll">
				<h3>Loadtest Specification</h3>
				<div className="actvity-container">
					<label className="label">
						<span className="label-text">Activity</span>
					</label>
					<select value={selectedActivity.name} onChange={handleSelectionChange} id="" className="select select-bordered w-full max-w-xs">
						{uniqueActivitys.map((edge) => {
							return <option value={edge.name} key={edge.id}>{edge.name}</option>
						})}
					</select>
				</div>
				<div className="actvity-container">
					<label className="label">
						<span className="label-text">Stimulus</span>
					</label>
					<select value={stimulus.name} onChange={handleStimulusChange} id="" className="select select-bordered w-full max-w-xs">
						{stimuluses.map((stimulus) => {
							return <option value={stimulus.name} key={stimulus.name}>{stimulus.name}</option>
						})}
					</select>
				</div>
				<div className="actvity-container">
					<label className="label">
						<span className="label-text">Accuracy</span>
					</label>
					<input type="range" value={accuracy} onChange={handleAccuracyChange} name="" id="" className="range range-primary" />
				</div>
				<div className="actvity-container">
					<h4>Response Measure</h4>
					{responseMeasures.map((responseMeasure) => {
						return (
							<div>
								<label className="label">
									<span className="label-text">{responseMeasure.name}</span>
								</label>
								<div className="btn-group">
									{responseMeasure.values.map((value) => {
										return <input type="radio" value={value} onClick={handleResponseMeasureChange} name={responseMeasure.name} data-title={value} className="btn" />
									})}
								</div>
							</div>
						)
					})}
				</div>
				<h3>Load Design</h3>
				{stimulus.name == "LOAD PEAK" ?
					<div className="actvity-container">
						{designParameters.map((parameter) => {
							return (
								<div>
									<label className="label">
										<span className="label-text">{parameter.name}</span>
									</label>
									<div className="btn-group">
										{parameter.values.map((value) => {
											return <input type="radio" value={value} onClick={handleDesignParameterChange} name={parameter.name} data-title={value} className="btn" />
										})}
									</div>
								</div>
							)
						})}
					</div>
					: stimulus.name == "Load Increase" ?
						<div className="activity-container">

							{designParameters.map((parameter) => {
								return (
									<div>
										<label className="label">
											<span className="label-text">{parameter.name}</span>
										</label>
										<select name="" id="" className="select select-bordered w-full max-w-xs">
											{parameter.values.map((value) => {
												return (
													<option value={value}>{value}</option>
												)
											})}
										</select>
									</div>
								)
							})}

						</div>
						: stimulus.name == "Constant Load" ?
							<div className="actvity-container">
								{designParameters.map((parameter) => {
									return (
										<div>
											<label className="label">
												<span className="label-text">{parameter.name}</span>
											</label>
											<div className="btn-group">
												{parameter.values.map((value) => {
													return <input type="radio" name={parameter.name} data-title={value} className="btn" />
												})}
											</div>
										</div>
									)
								})}
							</div>
							: null
				}
				<h3>Metrics</h3>
				<p>The Metrics to include into the Load Test</p>
				<div className="activity-container">
					{metrics.map((metric, index) => {
						return (
							<div className="form-control">
								<label className="label cursor-pointer">
									<span className="label-text">{metric}</span>
									<input type="checkbox"
										key={index}
										value={metric}
										checked={includedMetrics.includes(metric)}
										onChange={handleMetricsChange}
										name=""
										id=""
										className="checkbox checkbox-primary" />
								</label>
							</div>
						)
					})}
				</div>

				<button onClick={submitLoadtest} className="btn btn-primary">
					Execute
				</button>

			</div >

		</>
	)

	/* return (
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
																			return <button value={value} onClick={handleResponseMeasureChange}>{value}</button>
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
																	<div id={parameter.name} className="button-group">
																			{parameter.values.map((value) => {
																					return <button value={value} onClick={handleDesignParameterChange}>{value}</button>
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
																					{parame1ter.values.map((value) => {
																							return (
																									<option value={value}>{value}</option>
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
	) */
}
