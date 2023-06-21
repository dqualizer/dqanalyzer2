import React, { useState, useEffect } from 'react'
import * as tooltips from '../../data/loadtest-tooltips.json';
import { Tooltip } from 'react-tooltip';
import { toSnakeCase } from '../../utils/formatting';
export default function SpecButtons({ spec, setInputs, inputs, data, tooltip }) {
    const [value, setValue] = useState();

    let arr;



    arr = data ? data : [];

    // if () {
    //     console.log("This time we got an Object and can´t map!", arr)
    // }

    console.log("arr", arr)


    //else arr = [];

    if (typeof arr == Array) {
        arr.forEach(item => {
            const regex = /_id$/;
            const id_key = Object.keys(item).find(key => regex.test(key));
            item.render_id = item[id_key]

        });
    }


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

    console.log(data)

    return (
        <div className="actvity-container">
            <h4>
                {spec}
                <span className="ml-1 font-normal text-sm" data-tooltip-id={toSnakeCase(spec)} data-tooltip-place="right" data-tooltip-content={tooltips[toSnakeCase(spec)]}>&#9432;</span>
            </h4>
            <Tooltip id={toSnakeCase(spec)} style={{ maxWidth: '256px' }} />
            {Array.isArray(arr) ? arr.map((item) => {
                return (
                    <div>
                        <label className="label">
                            <span className="label-text">{item.name}</span>
                        </label>
                        <div className="btn-group">
                            {item.values && item.values.map((value) => {
                                return (
                                    <React.Fragment>
                                        <input type="radio" value={value.name} name={item.name} data-title={value.name} className="btn" data-tooltip-id={value.name + '-' + value.value} data-tooltip-content={'Value: ' + value.value} />
                                        <Tooltip id={value.name + '-' + value.value} />
                                    </React.Fragment>
                                )
                            })}
                        </div>
                    </div>
                )
            }) : Array.isArray(arr.values) &&

            <div>
                <div className="btn-group">
                    {arr.values.map((item) => (
                        <React.Fragment>
                            <input type="radio" value={item.name} name={item.name} data-title={item.name} className="btn" data-tooltip-id={item.name + '-' + item.value} data-tooltip-content={'Value: ' + item.value} />
                            <Tooltip id={item.name + '-' + item.value} />
                        </React.Fragment>
                    ))}
                </div>
            </div>
            }
        </div>
    )
}
