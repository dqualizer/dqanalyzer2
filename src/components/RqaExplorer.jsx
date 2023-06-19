import React, { useState, useEffect } from 'react'
import AddIcon from '@mui/icons-material/Add';
import RqaNode from './RqaNode';

import ExpandableRqaNode from './ExpandableRqaNode';

const emptyRQA = {
    name: "",
    context: "",
    environment: "",
    runtime_quality_analysis: {
        loadtests: [],
        parametrization: [],
        response_measure: [],
        result_metrics: []
    }
}

export default function RqaExplorer() {
    let initRqas = [{
        name: "Loadtest Analysis",
        context: "Werkstattauftrag",
        environment: "TEST",
        runtime_quality_analysis: {
            loadtests: [{
                name: "Single Activity Loadtest",
                artifact: {
                    object: 'id1',
                    activity: "id3"
                },
                description: "Auftrag lesen",
                stimulus: {
                    load_profile: "LOAD_PEAK",
                    accuracy: "57",
                    highest_load: "HIGH",
                    time_to_highest_load: "FAST"

                },
                parametrization: {
                    path_variables: { auftragsnummer: "auftrag/auftragsnummern/angelegt.json" }
                },
                response_measure: {
                    response_time: "TOLERATED"
                },
                result_metrics: [
                    "Response Time",
                    "90th Percentile"
                ]
            }],
            resilience: [],
            monitoring: [],
        }
    }]

    // Resize States
    const [isResizing, setIsResizing] = useState(false);
    const [sidebarWidth, setSidebarWidth] = useState(300); // Initial width of the sidebar
    const [rqas, setRquas] = useState(initRqas)

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

    const handleAddClick = () => {
        setRquas([...rqas, emptyRQA])
    }


    useEffect(() => {

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing]);



    return (
        <>
            <div className="py-4 px-4 prose overflow-scroll" style={{ width: `${sidebarWidth}px`, cursor: isResizing ? 'col-resize' : 'default', }}>
                <div className="flex items-center justify-between mb-2">
                    <span >RQA Explorer</span>
                    <button onClick={handleAddClick}><AddIcon /></button>
                </div>

                <RqaNode data={rqas} />


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
