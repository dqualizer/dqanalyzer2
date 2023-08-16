import React, { useState, useEffect } from 'react'
import { Tooltip } from 'react-tooltip';
import * as tooltips from '../../data/loadtest-tooltips.json';
import { toSnakeCase } from '../../utils/formatting';

export default function SpecSlider({ spec, context, setInputs, inputs, data, tooltip }) {

    const [value, setValue] = useState(0);

    const arr = data ? data : [];

    arr.forEach(item => {
        const regex = /_id$/;
        const id_key = Object.keys(item).find(key => regex.test(key));
        item.render_id = item[id_key]

    });

    useEffect(() => {
        if (inputs["Load Design"] && Object.keys(inputs["Load Design"]).length === 0)
            setValue(0)
    }, [inputs])

    const handleSliderChange = (e) => {
        if (!context) {
            setValue(e.target.value)
            setInputs((prevState) => ({
                ...prevState,
                [spec]: e.target.value
            }));
        }
        else {
            setValue(e.target.value)
            setInputs((prevState) => ({
                ...prevState,
                [context]: ({ ...prevState[context], [spec]: e.target.value })

            }));
        }

    }

    return (
        <div className="actvity-container">
            <label className="label">
                <span className="label-text">
                    {spec}
                    {tooltip && <span className="ml-1 font-normal text-sm" data-tooltip-id={toSnakeCase(spec)} data-tooltip-place="right" data-tooltip-content={tooltips[toSnakeCase(spec)]}>&#9432;</span>}
                </span>
            </label>
            <Tooltip id={toSnakeCase(spec)} style={{ maxWidth: '256px' }} />
            <input type="range" value={value} onChange={handleSliderChange} name="" id="" className="range range-primary" />
        </div>
    )
}
