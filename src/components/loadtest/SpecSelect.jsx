import React, { useState, useEffect } from 'react'
import * as tooltips from '../../data/loadtest-tooltips.json';
import { Tooltip } from 'react-tooltip';
import { toSnakeCase } from '../../utils/formatting';

export default function SpecSelect({ spec, setInputs, inputs, data, tooltip }) {

    const [value, setValue] = useState();

    const arr = data ? data : [];

    arr.forEach(item => {
        const regex = /_id$/;
        const id_key = Object.keys(item).find(key => regex.test(key));
        console.log(id_key);
        item.render_id = item[id_key]

    });

    useEffect(() => {
        setValue(inputs[spec])
    }, [inputs])

    const handleSelectionChange = (e) => {

        setValue(e.target.value);

        setInputs((prevState) => ({
            ...prevState,
            [spec]: e.target.value
        }));

    }

    console.log(arr)

    return (
        <div className="actvity-container">
            <label className="label">
                <span className="label-text">
                    {spec}
                    {tooltip && <span className="ml-1 font-normal text-sm" data-tooltip-id={toSnakeCase(spec)} data-tooltip-place="right" data-tooltip-content={tooltips[toSnakeCase(spec)]}>&#9432;</span>}
                </span>
                <Tooltip id={toSnakeCase(spec)} style={{ maxWidth: '256px' }} />

            </label>
            <select value={value} onChange={handleSelectionChange} className="select select-bordered w-full max-w-xs">
                <option value="">Select...</option>
                {arr.map((item) => {
                    return <option value={item.render_id} key={item.render_id}>{item.name}</option>
                })}
            </select>
        </div>
    )
}
