import { Icon } from "@/components/nodes/nodeComponents/Icon";
import Image from "next/image";
import {
  Handle,
  type HandleProps,
  type NodeProps,
  NodeToolbar,
  Position,
  useReactFlow,
} from "reactflow";

export type NodeData = {
	id: string;
	left_handle?: HandleProps;
	right_handle?: HandleProps;
	icon: string;
	label: string;
};

export default function IconNode({ data, id }: NodeProps<NodeData>) {
	const reactFlowInstance = useReactFlow();

	const handleDeleteNode = () => {
		const node = reactFlowInstance.getNode(id);
		if (node) {
			reactFlowInstance.deleteElements({ nodes: [node] });
		}
	};

	// The Node which is created, when creating Nodes with the node-type: "iconNode"
	return (
		<>
			{data.left_handle && (
				<Handle
					id={id}
					type={data.left_handle.type}
					position={data.left_handle.position}
				/>
			)}

			{data.right_handle && (
				<Handle
					id={id}
					type={data.right_handle.type}
					position={data.right_handle.position}
				/>
			)}
			<NodeToolbar position={Position.Right}>
				<div className="node-toolbar-box">
					<button type="button">
						<Image
							width={0}
							height={0}
							src={"/trash.svg"}
							alt=""
							onClick={handleDeleteNode}
						/>
					</button>
					<button type="button">
						<Image width={0} height={0} src={"/color-picker.svg"} alt="" />
					</button>
				</div>
			</NodeToolbar>
			<Icon
				name={data.icon as any}
				className="iconNode dark:bg-white dark:rounded-sm"
			/>
			<p>{data.label}</p>
			{/* {
				openInput ? <TextInput className="nodeNameInput" onInputChange={handleInputChange} onEnterPress={handleEnterPress} /> :
					null
			} */}
		</>
	);
}
