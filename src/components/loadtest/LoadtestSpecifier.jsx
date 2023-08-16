import React, { useState, useEffect } from 'react'
import axios from 'axios';

import SpecSelect from './SpecSelect';
import SpecSlider from './SpecSlider';
import SpecButtons from './SpecButtons';
import * as loadtestSpecs from '../../data/loadtest-specs.json';

export default function LoadtestSpecifier({ selectedEdge }) {

    //Current Domain... we need State-Management
    const [domain, setDomain] = useState({});

    // Rqas
    const [rqas, setRqas] = useState([]);
    // The Loadtest, which is gonna be passed into the selected Rqa
    const [loadtest, setLoadtest] = useState({});

    // All the States of the Input-Fields
    const [inputs, setInputs] = useState({});


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

    // Get System based on Selected Edge
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



    const getActivities = () => {
        if (inputs.System) {
            return domain?.systems?.find((system) => system.system_id == inputs.System).activities
        }
        return [];

    }






    return (
        <div className="p-4 prose overflow-scroll h-full">
            <h3>Loadtest Specification</h3>
            <SpecSelect domain={domain} spec={"System"} data={domain.systems} inputs={inputs} setInputs={setInputs} />
            <SpecSelect spec={"Activity"} data={getActivities()} inputs={inputs} setInputs={setInputs} />
            <SpecSelect spec={"Stimulus"} data={loadtestSpecs.stimuluses} inputs={inputs} setInputs={setInputs} tooltip />
            <SpecSlider spec={"Accuracy"} data={loadtestSpecs.accuracy} inputs={inputs} setInputs={setInputs} tooltip />
            <SpecButtons spec={"Response Measure"} data={loadtestSpecs.responseMeasures} inputs={inputs} setInputs={setInputs} tooltip />
            {inputs.Stimulus && loadtestSpecs.stimuluses.find((stimulus) => stimulus.name == inputs.Stimulus).designParameters.map((parameter) =>
                <SpecButtons spec={parameter.name} data={parameter} inputs={inputs} setInputs={setInputs} tooltip />

            )}
        </div>
    )
}
