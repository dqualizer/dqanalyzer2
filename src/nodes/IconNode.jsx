import React, { useCallback, useEffect, memo } from 'react'
import { useState } from 'react';
import { Handle, NodeToolbar, Position, useReactFlow } from 'reactflow'
import Icon from './nodeComponents/Icon';
import TextInput from './nodeComponents/TextInput';
import Trash from '../assets/trash.svg'
import ColorPicker from '../assets/color-picker.svg'

const handleStyle = { left: 10 };

export default function IconNode(props) {

    const [openInput, setOpenInput] = useState(true);
    const [name, setName] = useState("");
    const reactFlowInstance = useReactFlow();

    const handleInputChange = (value) => {
        setName(value)
    }
    const handleEnterPress = (value) => {
        setOpenInput(false)
    }

    const handleDeleteNode = () => {
        reactFlowInstance.deleteElements({ nodes: [reactFlowInstance.getNode(props.id)] })
    }


    return (
        <>
            <Handle type={props.data.handleType} position={props.data.handlePosition} isConnectable={props.isConnectable} />
            {props.data.secondHandleType ?
                <Handle id={`${props.id}_${props.data.secondHandlePosition}`} type={props.data.secondHandleType} position={props.data.secondHandlePosition} isConnectable={props.isConnectable} />
                : null
            }

            <NodeToolbar isVisible={props.toolbarVisible} position="right">
                <div className="node-toolbar-box">
                    <button><img src={Trash} alt="" onClick={handleDeleteNode} /></button>
                    <button><img src={ColorPicker} alt="" /></button>
                </div>

            </NodeToolbar>
            <Icon name={props.data.icon} className="iconNode" />
            <p>{props.data.label}</p>
            {/* {
                openInput ? <TextInput className="nodeNameInput" onInputChange={handleInputChange} onEnterPress={handleEnterPress} /> :
                    null
            } */}
        </>
    )
}
