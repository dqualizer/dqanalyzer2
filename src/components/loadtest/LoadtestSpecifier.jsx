import React, { useState, useEffect } from 'react'
import axios from 'axios';

import SpecSelect from './SpecSelect';
import SpecSlider from './SpecSlider';
import SpecButtons from './SpecButtons';
import * as loadtestSpecs from '../../data/loadtest-specs.json';
import DropdownLeft from '../DropdownLeft';
import SpecCheckbox from './SpecCheckbox';
import { toSnakeCase } from '../../utils/formatting';

export default function LoadtestSpecifier({ selectedEdge }) {

    // Current Domain... we need State-Management
    const [domain, setDomain] = useState({});

    // Endpoint of Activity in Mapping of selected Activity in Menu
    // Used to make Html more readable 
    const [endpoint, setEndpoint] = useState();

    // Rqas
    const [rqas, setRqas] = useState([]);
    // The Loadtest, which is gonna be passed into the selected Rqa
    const [loadtest, setLoadtest] = useState({});

    // All the States of the Input-Fields
    const [inputs, setInputs] = useState({});

    const [showAddButton, setShowAddButton] = useState(false);


    // Get Rqas
    useEffect(() => {
        axios.get(`https://64917f002f2c7ee6c2c85311.mockapi.io/api/v1/rqas`).then((response) => {
            setRqas(response.data);
        })
    }, []);

    // Get Domain
    useEffect(() => {
        const fetchData = async () => {
            await axios.get(`https://64917f002f2c7ee6c2c85311.mockapi.io/api/v1/domain/1`).then((response) => {
                setDomain(response.data);
            })
        }

        fetchData();

    }, []);

    // Show only the Activities for the selected System
    const getActivities = () => {
        if (inputs.System) {
            return domain?.systems?.find((system) => system.system_id == inputs.System).activities
        }
        return [];
    }

    // Cahnge System and Actvitivity, when selecte Eddge changes
    useEffect(() => {
        if (domain) {
            getSystemAndActivityBasedOnSelectedEdge();
        }

    }, [selectedEdge, domain]);

    const getSystemAndActivityBasedOnSelectedEdge = async () => {
        if (selectedEdge) {
            let system = domain.systems.find((system) => system.system_id == selectedEdge.system);
            let activity = system.activities.find((activity) => activity.activity_id == selectedEdge.mappingId);
            setInputs((prevState) => ({
                ...prevState,
                System: system.system_id,
                Activity: activity.activity_id
            }));

        }
    }

    // Specify Endpoint of Activity
    // Show the Button to add the Loadtest to an Rqa
    useEffect(() => {
        if (inputs.System && inputs.Activity) {

            let selectedStimulus;
            let areAllDesignParametersSelected;
            let accuracyBiggerNull;

            let endpoint = domain.systems.find(
                system => system.system_id == inputs.System
            ).activities.find(
                activity => activity.activity_id == inputs.Activity
            ).endpoint

            setEndpoint(endpoint);
            if (inputs.Stimulus) {
                selectedStimulus = loadtestSpecs.stimuluses.find(stimulus => stimulus.name == inputs.Stimulus);

                areAllDesignParametersSelected = selectedStimulus.designParameters.every((parameter) => Object.keys(inputs["Load Design"]).includes(parameter.name));
                accuracyBiggerNull = parseInt(inputs["Load Design"].Accuracy) > 0 ? true : false;
            }
            if (inputs["Response Measures"] && areAllDesignParametersSelected && accuracyBiggerNull && inputs["Result Metrics"]) {
                setShowAddButton(true)
            }

        }
        else setEndpoint();

        // if (inputs.System && inputs.Activity && inputs.Stimulus && inputs["Response Measures"]) {
        //     let accuracyBiggerNull = parseInt(inputs.load_design.Accuracy) > 0 ? true : false;
        //     if (areAllDesignParametersSelected && accuracyBiggerNull) {
        //         setShowAddButton(true);
        //     }
        // }
    }, [inputs]);

    const addToRqa = async (id) => {
        try {
            const rqa = await getRqaById(id);
            const loadtest = composeLoadtest();
            rqa.runtime_quality_analysis.loadtests.push(loadtest);
            await updateRqa(id, rqa);
            console.log('RQA updated successfully');
        } catch (error) {
            console.error('Error adding to RQA:', error);
        }
    };

    const getRqaById = async (id) => {
        try {
            const response = await axios.get(`https://64917f002f2c7ee6c2c85311.mockapi.io/api/v1/rqas/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(`Failed to get RQA with ID ${id}`);
        }
    };

    const updateRqa = async (id, rqa) => {
        try {
            const response = await axios.put(`https://64917f002f2c7ee6c2c85311.mockapi.io/api/v1/rqas/${id}`, rqa);
            return response.data;
        } catch (error) {
            throw new Error(`Failed to update RQA with ID ${id}`);
        }
    };

    const composeLoadtest = () => {

        const stimulus = {
            load_profile: inputs.Stimulus
        }

        for (const property in inputs["Load Design"]) {
            const formattedProperty = toSnakeCase(property);
            stimulus[formattedProperty] = inputs["Load Design"][property];
        }
        //path_variables_key = endpoint?.path_variables?.find(path => path.path == inputs["Path Variables"])
        let parametrization = {
            ...(inputs.hasOwnProperty('path_variables') && { path_variables: { ...inputs.path_variables } }),
            ...(inputs.hasOwnProperty('request_parameter') && { ...inputs.request_parameter })
        };

        let system = domain.systems.find(system => system.system_id == inputs.System);
        let activity = system.activities.find(activity => activity.activity_id == inputs.Activity);



        const loadtest = {
            name: activity.name,
            artifact: {
                object: inputs.System,
                activity: inputs.Activity
            },
            stimulus,
            parametrization,
            response_measure: {
                response_time: inputs["Response Measures"]["Response Time"]
            },
            result_metrics: inputs["Result Metrics"]
        }

        return loadtest
    }





    return (
        <div className="p-4 prose overflow-scroll h-full">
            <h3>Loadtest Specification</h3>
            <h4>System</h4>
            <SpecSelect domain={domain} spec={"System"} data={domain.systems} inputs={inputs} setInputs={setInputs} />
            <SpecSelect spec={"Activity"} data={getActivities()} inputs={inputs} setInputs={setInputs} />
            {(endpoint?.path_variables || endpoint?.request_parameter) && <h4>Szenario</h4>}
            {endpoint?.path_variables.length > 0 &&
                endpoint?.path_variables.map(variable => {
                    return <SpecSelect spec={variable.name} context={"path_variables"} data={variable.szenarios} inputs={inputs} setInputs={setInputs} />
                })
            }
            {endpoint?.request_parameter.length > 0 &&
                endpoint?.request_parameter.map((param) => {
                    return <SpecSelect spec={param.name} context={"request_parameter"} data={param.szenarios} inputs={inputs} setInputs={setInputs} />

                })

            }

            <h4>Load Design</h4>
            <SpecSelect spec={"Stimulus"} data={loadtestSpecs.stimuluses} inputs={inputs} setInputs={setInputs} tooltip />
            <SpecSlider spec={"Accuracy"} context={"Load Design"} inputs={inputs} setInputs={setInputs} tooltip />

            <SpecButtons spec={"Response Measures"} context={"Response Measures"} data={loadtestSpecs.responseMeasures} inputs={inputs} setInputs={setInputs} tooltip />
            {inputs.Stimulus && <SpecButtons spec={"Load Design"} context={"Load Design"} data={loadtestSpecs.stimuluses.find((stimulus) => stimulus.name == inputs.Stimulus).designParameters} inputs={inputs} setInputs={setInputs} tooltip />}


            <SpecCheckbox spec={"Metrics"} context={"Result Metrics"} data={loadtestSpecs.metrics} inputs={inputs} setInputs={setInputs} tooltip />

            {showAddButton && <DropdownLeft rqas={rqas} action={addToRqa} />}
        </div>
    )
}
