import { Handle, Node, NodeToolbar, Position, useReactFlow } from 'reactflow'
import { Icon } from './nodeComponents/Icon';
import Trash from '../assets/trash.svg';
import ColorPicker from '../assets/color-picker.svg'


export default function IconNode(props: Node) {

	const reactFlowInstance = useReactFlow();

	const handleDeleteNode = () => {
		const node = reactFlowInstance.getNode(props.id);
		if (node) {
			reactFlowInstance.deleteElements({ nodes: [node] })
		}
	}

	// The Node which is created, when creating Nodes with the node-type: "iconNode"
	return (
		<>
			<Handle type={props.data.handleType} position={props.data.handlePosition} />
			{props.data.secondHandleType ?
				<Handle id={`${props.id}_${props.data.secondHandlePosition}`} type={props.data.secondHandleType} position={props.data.secondHandlePosition} />
				: null
			}
			<NodeToolbar position={Position.Right}>
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
