import React, { useState, useEffect } from 'react'
import * as tooltips from '../../data/loadtest-tooltips.json';
import { Tooltip } from 'react-tooltip';
import { toSnakeCase } from '../../utils/formatting';
import { useEdges, useOnSelectionChange, useReactFlow, useStore, MarkerType } from 'reactflow';


export default function SpecSelect({ spec, setInputs, inputs, data, tooltip, context }) {

    const [value, setValue] = useState();
    const reactFlowInstance = useReactFlow();



    const edges = useEdges();


    const arr = data ? data : [];


    arr.forEach(item => {
        const regex = /_id$/;
        const id_key = Object.keys(item).find(key => regex.test(key));
        item.render_id = item[id_key]

    });

    useEffect(() => {
        setValue(inputs[spec])
    }, [inputs])

    const handleSelectionChange = (e) => {

        if (spec == "Activity") {
            let relatedEdgesArray = edges.filter((edge) => edge.activity == e.target.value);
            let unrelatedEdgesArray = edges.filter((edge) => edge.activity != e.target.value);



            let newEdgeArray = []

            unrelatedEdgesArray.forEach((edge) => {
                edge.selected = false;
                edge.animated = false;
                edge.style = {}
                edge.markerStart = {
                    type: MarkerType.ArrowClosed,
                    width: 20,
                    height: 20,
                }
            })

            relatedEdgesArray.forEach((edge) => {
                edge.selected = true;
                edge.animated = true;
                edge.style = {
                    stroke: '#570FF2'
                }
                edge.markerStart = {
                    type: MarkerType.ArrowClosed,
                    width: 20,
                    height: 20,
                    color: '#570FF2'
                }
            })

            newEdgeArray = newEdgeArray.concat(unrelatedEdgesArray, relatedEdgesArray);
            reactFlowInstance.setEdges(newEdgeArray);

        }

        setValue(e.target.value);
        console.log(e.target.value);

        if (spec == "Stimulus") {
            setInputs((prevState) => ({
                ...prevState,
                ["Load Design"]: {}
            }));
        }
        if (!context) {
            setInputs((prevState) => ({
                ...prevState,
                [spec]: e.target.value
            }));
        }
        else {
            setInputs((prevState) => ({
                ...prevState,
                [context]: ({ ...prevState[context], [e.target.name]: e.target.value })
            }))
        }


    }


    return (
        <div className="actvity-container">
            <label className="label">
                <span className="label-text">
                    {spec}
                    {tooltip && <span className="ml-1 font-normal text-sm" data-tooltip-id={toSnakeCase(spec)} data-tooltip-place="right" data-tooltip-content={tooltips[toSnakeCase(spec)]}>&#9432;</span>}
                </span>
                <Tooltip id={toSnakeCase(spec)} style={{ maxWidth: '256px' }} />

            </label>
            <select value={value} name={spec} onChange={handleSelectionChange} className="select select-bordered w-full max-w-xs">
                <option key="empty" value="">Select...</option>
                {arr.map((item, key) => {
                    return <option value={item.render_id ? item.render_id : item.path} key={key}>{item.name}</option>
                })}
            </select>
        </div>
    )
}
