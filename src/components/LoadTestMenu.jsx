import React, { useEffect, useState } from 'react'
import { useEdges, useOnSelectionChange } from 'reactflow';


export default function LoadTestMenu(props) {

    const [selectedEdge, setSelectedEdge] = useState(null);
    const [actvities, setActivities] = useState(null);
    const edges = useEdges();

    const actorEdges = edges.filter(element => /^work_object_actor_/.test(element.id));



    useOnSelectionChange({
        onChange: ({ edges }) => setSelectedEdge(edges[0])
    })

    useEffect(() => {
        props.edges.forEach((edge) => {
            if (edge.selected) {
                selectedEdge = edge;
            }
        })

    }, [])


    return (
        <>
            <div className="menu-container">
                < div className="actvity-container" >
                    <p>Activity</p>
                    <select id="">
                        {edges.map((actorEdge) => {
                            return <option selected={actorEdge.selected} value="">{actorEdge.name}</option>
                        })}
                    </select>
                </div >
            </div >

        </>
    )
}
