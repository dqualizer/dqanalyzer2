import React, { useEffect, useState } from 'react'
import { useEdges, useOnSelectionChange, useReactFlow } from 'reactflow';
import * as loadtestSpecs from '../data/loadtest-specs.json';

export default function LoadTestMenu(props) {

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
			<div className="menu-container prose overflow-scroll" style={{ width: `${sidebarWidth}px`, cursor: isResizing ? 'col-resize' : 'default', }} >
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
										return <input type="radio" name={responseMeasure.name} data-title={value} className="btn" />
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
											return <input type="radio" name={parameter.name} data-title={value} className="btn" />
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
													<option value="">{value}</option>
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
			<div className='hover:cursor-col-resize'
				style={{
					width: '5px',
					height: '100%',
					// backgroundColor: isResizing ? 'red' : 'transparent', // Change the color of the border when resizing
					// cursor: isResizing ? 'col-resize' : 'default',
				}}
				onMouseDown={handleMouseDown}
			/>

		</>
	)
}
