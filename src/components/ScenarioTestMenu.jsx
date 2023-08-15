import React, {useEffect, useState} from 'react';
import {useReactFlow} from 'reactflow';
import * as scenarioSpecs from '../data/scenariotest-specs.json';
import ResizeBar from './ResizeBar';
import * as mapping from '../data/werkstatt-en.json';
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
        scenarios: [],
        settings: {
            accuracy: 0,
            environment: settings.enviroment[0],
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
            "expected": null
        }
    ]);
    const [accuracy, setAccuracy] = useState(0);
    const [enviroment, setEnviroment] = useState(settings.enviroment[0]);
    const [timeSlot, setTimeSlot] = useState(null);

    // const [selectedActivity, setSelectedActivity] = useState(0);
    const [selectedMode, setSelectedMode] = useState(null);
    const [loadDesign, setLoadDesign] = useState(allRqs.loadDesign[0]);
    const [resilienceDesign, setResilienceDesign] = useState(allRqs.resilienceDesign[0]);
    const [responseMeasure, setResponseMeasure] = useState([]);
    // const [scenarios, setScenarios] = useState([]);
    const [selectedScenario, setSelectedScenario] = useState(null);
    const [loadDecision, setLoadDecision] = useState(null);
    const [resilienceDecision, setResilienceDecision] = useState(null);
    const [isActivityView, setIsActivityView] = useState(true);
    // const [filteredScenarios, setFilteredScenarios] = useState(null);
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

    const allModes = [{name: "What if", description: "Check your activity under specific conditions"}, {name: "Monitoring", description: "Monitor your activity in the context of expected behavior"}];

    const [allMetrics, setAllMetrics] = useState([{
        metric: "maximum_response_time",
        description_begin: "What is the maximum time it may take for ",
        description_end: null,
        insert_to: true,
        expected: [
            {
                value: 2,
                unit: "Seconds"
            },
            {
                value: 5,
                unit: "Seconds"
            },
            {
                value: 7,
                unit: "Seconds"
            }
        ]
    },
        {
            metric: "minimum_throughput",
            description_begin: "How often do at least ",
            description_end: null,
            insert_to: false,
            expected: [
                {
                    value: 1000,
                    unit: "Requests/Day"
                },
                {
                    value: 3000,
                    unit: "Requests/Day"
                },
                {
                    value: 7000,
                    unit: "Requests/Day"
                }
            ]
        }]);

    const load = [
        {
            "name": "None",
            "description": null,
            "designParameters": null
        },
        {
            "name": "Load Peak",
            "description": "[intensity] and [time] load peak",
            "designParameters": [
                {
                    "name": "Highest Load",
                    "placeholder": "[intensity]",
                    "values": [
                        {
                            "name": "High",
                            "value": 10
                        },
                        {
                            "name": "Very High",
                            "value": 15
                        },
                        {
                            "name": "Extremly High",
                            "value": 30
                        }
                    ]
                },
                {
                    "name": "Time to Highest load",
                    "placeholder": "[time]",
                    "values": [
                        {
                            "name": "Slow",
                            "value": "20s"
                        },
                        {
                            "name": "Fast",
                            "value": "15s"
                        },
                        {
                            "name": "Very Fast",
                            "value": "10s"
                        }
                    ]
                }
            ]
        },
        {
            "name": "Load Increase",
            "description": "[velocity] load increase",
            "designParameters": [
                {
                    "name": "Type of Increase",
                    "placeholder": "[velocity]",
                    "values": [
                        {
                            "name": "Linear",
                            "value": 1
                        },
                        {
                            "name": "Quadratic",
                            "value": 2
                        },
                        {
                            "name": "Cubic",
                            "value": 3
                        }
                    ]
                }
            ]
        },
        {
            "name": "Constant Load",
            "description": "[base load] constant load",
            "designParameters": [
                {
                    "name": "Base Load",
                    "placeholder": "[base load]",
                    "values": [
                        {
                            "name": "Low",
                            "value": 10
                        },
                        {
                            "name": "Medium",
                            "value": 20
                        },
                        {
                            "name": "High",
                            "value": 30
                        }
                    ]
                }
            ]
        }
    ];
    const resilience = [
        {
            "name": "None",
            "description": null,
            "designParameters": null
        },
        {
            "name": "Failed Request",
            "description": "[error_rate] and [frequency] failed request",
            "designParameters": [
                {
                    "name": "Error Rate",
                    "placeholder": "[error_rate]",
                    "values": [
                        {
                            "name": "Low",
                            "value": 20
                        },
                        {
                            "name": "Medium",
                            "value": 30
                        },
                        {
                            "name": "High",
                            "value": 30
                        }
                    ]
                },
                {
                    "name": "How often does the stimulus occur?",
                    "placeholder": "[frequency]",
                    "values": [
                        {
                            "name": "Once",
                            "value": 10
                        },
                        {
                            "name": "More than once",
                            "value": 20
                        },
                        {
                            "name": "Frustrated",
                            "value": 30
                        }
                    ]
                }
            ]
        },
        {
            "name": "Late Response",
            "description": "[frequency] late responses",
            "designParameters": [
                {
                    "name": "How often does the stimulus occur?",
                    "placeholder": "[frequency]",
                    "values": [
                        {
                            "name": "Once",
                            "value": 10
                        },
                        {
                            "name": "More than once",
                            "value": 20
                        },
                        {
                            "name": "Frustrated",
                            "value": 30
                        }
                    ]
                }
            ]
        },
        {
            "name": "Unavailable",
            "description": "[recovery time] and [frequency] unavailable",
            "designParameters": [
                {
                    "name": "Recovery Time",
                    "placeholder": "[recovery time]",
                    "values": [
                        {
                            "name": "Satisfied",
                            "value": 10
                        },
                        {
                            "name": "Tolerated",
                            "value": 20
                        },
                        {
                            "name": "Frustrated",
                            "value": 30
                        }
                    ]
                },
                {
                    "name": "How often does the stimulus occur?",
                    "placeholder": "[frequency]",
                    "values": [
                        {
                            "name": "Once",
                            "value": 10
                        },
                        {
                            "name": "More than once",
                            "value": 20
                        },
                        {
                            "name": "Frustrated",
                            "value": 30
                        }
                    ]
                }
            ]
        }
    ];

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

    const handleSelectionChange = (event, index) => {
        colorActiveActivities(event);

        // update the view for the selected edge
        let newSelectedActivity = allActivities.find((artifact) => artifact.description === event.target.value);

        let allDefinedScenariosCopy = deepCopy(allDefinedScenarios);
        allDefinedScenariosCopy[index].activity = newSelectedActivity;
        allDefinedScenariosCopy[index].selected_mode = null;
        allDefinedScenariosCopy[index].generatedScenariosList = null;
        allDefinedScenariosCopy[index].filteredScenariosList = null;
        setAllDefinedScenarios(allDefinedScenariosCopy);
        // scenario.generatedScenariosList = null;
        // scenario.generatedScenariosList = null;
        // scenario.generatedScenariosList = null;

        // setSelectedActivity(newSelectedActivity);
        // setSelectedMode(null);
        // setScenarios([]);
        //
        // setSelectedScenario(null);
        // setLoadDecision(null);
        // setResilienceDecision(null);
        // setResponseMeasure(null);
    }

    const handleLoadDesignChange = (event, index) => {
        let loadVariant = allRqs.loadDesign.find((variant) => variant.name === event.target.value);
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
        //scenario.selected_mode = event.target.value;
        //console.log(allDefinedScenarios);
        // setSelectedMode(mode);
        // scenario.
        // setSelectedScenario(null);
        // setLoadDecision(null);
        // setResilienceDecision(null);
        // setResponseMeasure(null);
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
        let resilienceVariant = allRqs.resilienceDesign.find((variant) => variant.name === event.target.value);
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

        if (newEnviroment === 'Test') {
            setTimeSlot(settings.timeSlot[0]);
        } else {
            setTimeSlot(null);
        }

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
            "generatedScenariosList": [],
            "description": null,
            "load_design": null,
            "resilience_design": null,
            "expected": null
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

    //TODO: What does useEffect do here?
    // useEffect(() => {
    //     setSelectedActivity(props.selectedEdge);
    //     let rqaCopy = rqa;
    //     rqaCopy.runtime_quality_analysis.loadtests[0].artifact = {
    //         object: props.selectedEdge?.system,
    //         activity: props.selectedEdge?.activity
    //     }
    //     rqaCopy.runtime_quality_analysis.loadtests[0].description = props.selectedEdge?.name
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

    const getScenariosForActivityAndMode = (activity, mode) => {
        let activityDescription = activity.description;
        let allActiveEdges = props.edges.filter((edge) => edge.name === activityDescription);
        let allElements = findAllElements(allActiveEdges);
        let wordArray = buildWordArray(allElements);
        let generatedSentences = generateScenarios(wordArray, mode);
        console.log(generatedSentences);
        return generatedSentences;
    }

    const findAllElements = (edges) => {
        const allElements = [];
        let currentSource = null;

        //finding the first element
        for (const edge of edges) {
            const source = edge.source;
            let isFirstElement = true;

            for (const otherEdge of edges) {
                const otherSource = otherEdge.source;
                const otherTarget = otherEdge.target;

                if (source !== otherSource && source === otherTarget) {
                    isFirstElement = false;
                    break;
                }
            }

            if (isFirstElement) {
                currentSource = source;
                break;
            }
        }

        while (currentSource !== null) {
            let found = false;

            for (const edge of edges) {
                const source = edge.source;
                const target = edge.target;

                if (currentSource === source) {
                    found = true;
                    const node = props.nodes.find((n) => n.id === currentSource);
                    allElements.push(node);
                    allElements.push(edge);
                    currentSource = target;
                    break;
                }
            }

            if (!found) {
                break;
            }
        }

        //finding the last element
        for (const edge of edges) {
            const target = edge.target;

            if (currentSource === target) {
                const node = props.nodes.find((n) => n.id === target);
                allElements.push(node);
            }
        }

        return allElements.reverse();
    }

    const buildWordArray = (allElements) => {
        let sentenceArray = [];
        for (const element of allElements) {
            // if element is not an edge
            if (element.data !== undefined) {
                let typeString = null;
                if (element.data.icon === "Document") {
                    typeString = "Work Object";
                } else {
                    typeString = element.data.icon;
                }
                let wordObject = {name: element.data.label.toLowerCase(), type: typeString};
                sentenceArray.push(wordObject);
            }
            // else element is an edge
            else {
                let name = element.label.endsWith("s") ? element.label.slice(0, -1) : element.label;
                let wordObject = {name: name.toLowerCase(), type: "Activity"};
                sentenceArray.push(wordObject);
            }
        }
        return sentenceArray;
    }

    const generateScenarios = (wordArray, mode) => {
        let scenarioArray = [];
        for (const metric of allMetrics) {
            let sentence = {
                description: "",
                metric: metric.metric,
                expected: null,
                load_design: load[0],
                resilience_design: resilience[0]
            };
            if (metric.description_begin !== null) {
                sentence.description += metric.description_begin;
            }
            for (let wordIndex = 0; wordIndex < wordArray.length; wordIndex++) {
                if (wordIndex === 0) {
                    sentence.description += wordArray[wordIndex].name + "s";
                    if (metric.insert_to) {
                        sentence.description += " to";
                    }
                } else if (wordIndex === wordArray.length - 1) {
                    sentence.description += " the " + wordArray[wordIndex].name;
                } else if (wordArray[wordIndex].type === "Work Object") {
                    if (wordArray[wordIndex].name.endsWith("s")) {
                        sentence.description += " their " + wordArray[wordIndex].name + "es";
                    } else {
                        sentence.description += " their " + wordArray[wordIndex].name + "s";
                    }
                } else {
                    sentence.description += " " + wordArray[wordIndex].name;
                }
            }
            if (mode === "What if") {
                let randomDesign = Math.round(Math.random());
                let designDescription = null
                // 1 = Load
                if (randomDesign === 1) {
                    let numberLoadCategories = load.length - 1; //Without "None"
                    let randomLoadCategory = Math.floor(Math.random() * numberLoadCategories) + 1;  // + 1 to avoid getting the "None" category
                    designDescription = load[randomLoadCategory].description;
                    sentence.load_design = deepCopy(load[randomLoadCategory]);
                    sentence.load_design.designParameters.forEach((parameter) => {
                        delete parameter.values;
                        parameter.value = null;
                    });
                    for (let parameter in load[randomLoadCategory].designParameters) {
                        let numberOfParamValues = load[randomLoadCategory].designParameters[parameter].values.length;
                        let randomValue = Math.floor(Math.random() * numberOfParamValues);
                        let valuePlaceHolder = load[randomLoadCategory].designParameters[parameter].placeholder;
                        let valueDescription = load[randomLoadCategory].designParameters[parameter].values[randomValue].name.toLowerCase();
                        designDescription = designDescription.replace(valuePlaceHolder, valueDescription);
                        sentence.load_design.designParameters[parameter].value = load[randomLoadCategory].designParameters[parameter].values[randomValue];
                    }
                }
                // 0 = Resilience
                else {
                    let numberResilienceCategories = resilience.length - 1; //Without "None"
                    let randomResilienceCategory = Math.floor(Math.random() * numberResilienceCategories) + 1;  // + 1 to avoid getting the "None" category
                    designDescription = resilience[randomResilienceCategory].description;
                    sentence.resilience_design = deepCopy(resilience[randomResilienceCategory]);
                    sentence.resilience_design.designParameters.forEach((parameter) => {
                        delete parameter.values;
                        parameter.value = null;
                    });
                    for (let parameter in resilience[randomResilienceCategory].designParameters) {
                        let numberOfParamValues = resilience[randomResilienceCategory].designParameters[parameter].values.length;
                        let randomValue = Math.floor(Math.random() * numberOfParamValues);
                        let valuePlaceHolder = resilience[randomResilienceCategory].designParameters[parameter].placeholder;
                        let valueDescription = resilience[randomResilienceCategory].designParameters[parameter].values[randomValue].name.toLowerCase();
                        designDescription = designDescription.replace(valuePlaceHolder, valueDescription);
                        sentence.resilience_design.designParameters[parameter].value = resilience[randomResilienceCategory].designParameters[parameter].values[randomValue];
                    }
                }
                sentence.description += " under " + designDescription;
            }

            if (metric.description_end !== null) {
                sentence.description += metric.description_end + "?";
            } else {
                sentence.description += "?";
            }
            scenarioArray.push(sentence)
        }
        return scenarioArray;
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
                                        <select value={scenario.activity?.description} onChange={(event) => handleSelectionChange(event, index)} id=""
                                                className="select select-bordered w-full max-w-xs">
                                            {uniqueActivitys.map((edge) => {
                                                return <option value={edge.name} key={edge.id}>{edge.name}</option>
                                            })}
                                        </select>
                                    </div>

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
                                                               className="btn"
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
                                    {scenario.description !== null ? <p className="selected-scenario-description">{scenario.description}</p> : null}
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
                                                    {load.map((loadVariant) => {
                                                        return <option value={loadVariant.name}
                                                                       key={loadVariant.name}>{loadVariant.name}</option>
                                                    })}
                                                </select>
                                            </div>
                                            <div className="actvity-container">
                                                {load.map((loadVariant) => {
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
                                                {resilience.map((resilienceVariant) => {
                                                    return <option value={resilienceVariant.name}
                                                                   key={resilienceVariant.name}>{resilienceVariant.name}</option>
                                                })}
                                            </select>

                                            {/*TODO: Add Tooltip for each element*/}
                                            <div className="actvity-container">
                                                {resilience.map((resilienceVariant) => {
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
                                        {allMetrics.find((metric) => metric.metric === scenario.metric).expected.map((responseParameter => {
                                            return (
                                                <>
                                                    <input type="radio" value={responseParameter.value}
                                                           onClick={() => handleResponseParameterChange(responseParameter, index)}
                                                           name={scenario.metric}
                                                           data-title={responseParameter.value}
                                                           className="btn"
                                                           data-tooltip-id={responseParameter.value}
                                                           data-tooltip-content={"Value: " + responseParameter.value + " " + responseParameter.unit}
                                                           checked={scenario.expected === responseParameter}/>
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

                        <div className="button-group">
                            <button onClick={() => setIsActivityView(true)} className="btn button-left">
                                Back
                            </button>

                            <button onClick={addScenarioTest} className="btn">
                                Add Test
                            </button>
                        </div>
                    </div>}

                {/*<div className="activity-container">*/}
                {/*    <h3>Metrics</h3>*/}
                {/*    <p>*/}
                {/*        The Metrics to include into the Scenario Test*/}
                {/*        <span className="ml-1 font-normal text-sm" data-tooltip-place="right"*/}
                {/*              data-tooltip-id="metrics-tooltip"*/}
                {/*              data-tooltip-content='You may check one or multiple of these fields to tell the system which metrics you would like to include in the final analysis results.'>&#9432;</span>*/}
                {/*    </p>*/}
                {/*    <Tooltip id="metrics-tooltip" style={{maxWidth: '256px'}}/>*/}
                {/*    <div className="activity-container">*/}
                {/*        {metrics.map((metric) => {*/}
                {/*            return (<div>*/}
                {/*                <label className="label">*/}
                {/*                    <span className="label-text">{metric.name}</span>*/}
                {/*                </label>*/}
                {/*                <div className="btn-group">*/}
                {/*                    {metric.values.map((value) => {*/}
                {/*                        return (<>*/}
                {/*                            <input type="radio" value={value}*/}
                {/*                                   onClick={() => handleResponseParameterChange(metric.name, value)}*/}
                {/*                                   name={metric.name} data-title={value.name}*/}
                {/*                                   className="btn"*/}
                {/*                                   data-tooltip-id={value.name + '-' + value.value}*/}
                {/*                                   data-tooltip-content={'Value: ' + value.value}/>*/}
                {/*                            <Tooltip id={value.name + '-' + value.value}/>*/}
                {/*                        </>)*/}
                {/*                    })}*/}
                {/*                </div>*/}
                {/*            </div>)*/}
                {/*        })}*/}
                {/*    </div>*/}
                {/*</div>*/}

            </div>
            <ResizeBar setIsResizing={setIsResizing} setSidebarWidth={setSidebarWidth}/>
        </>
    )

}
