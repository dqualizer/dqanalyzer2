import React, { useState } from 'react'
import Icon from '../nodes/nodeComponents/Icon';
import LoadTestMenu from './LoadTestMenu';


export default function Sidebar(props) {

    return (
        <div className="sidebar">
            <div className='taskbar-container'>
                <button><div className="icon-domain-story-loadtest"></div></button>
                <button><div className="icon-domain-story-monitoring"></div></button>
                <button><div className="icon-domain-story-chaosexperiment"></div></button>
            </div>
            <LoadTestMenu edges={props.edges} nodes={props.nodes} />
        </div>


    )
}
