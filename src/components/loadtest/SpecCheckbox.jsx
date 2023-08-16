import React, { useState, useEffect } from 'react'

export default function SpecCheckbox({ spec, setInputs, inputs, data, tooltip }) {
    const [checked, setChecked] = useState({});

    const handleMetricsCheck = (e) => {

        const { name, checked } = e.target;
        setChecked((prevState) => ({
            ...prevState,
            [name]: checked
        }))
        setInputs((prevState) => ({
            ...prevState,
            ["Result Metrics"]: prevState.result_metrics ? [...prevState.result_metrics, name] : [name]
        }));
    }

    // Initializing the checkbox state, so the warning with the controlled / uncontrolled problem goes away
    useEffect(() => {
        const initialCheckedState = {};
        data.forEach((metric) => {
            initialCheckedState[metric] = false;
        });
        setChecked(initialCheckedState);
    }, [data]);

    return (
        <div className="activity-container">
            {data.map((metric, index) => {
                return (
                    <div key={metric} className="form-control">
                        <label className="label cursor-pointer">
                            <span className="label-text">{metric}</span>
                            <input type="checkbox"
                                key={index}
                                value={metric}
                                name={metric}
                                checked={checked[metric] || false}
                                onChange={handleMetricsCheck}
                                className="checkbox checkbox-primary" />
                        </label>
                    </div>
                )
            })}
        </div>
    )
}
