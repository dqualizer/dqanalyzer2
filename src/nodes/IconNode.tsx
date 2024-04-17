import {
  Handle,
  HandleProps,
  Node,
  NodeProps,
  NodeToolbar,
  Position,
  HandleType,
  useReactFlow,
} from "reactflow";
import { Icon, IconProps } from "./nodeComponents/Icon";
import Trash from "../assets/trash.svg";
import ColorPicker from "../assets/color-picker.svg";
import { WorkObjectType } from "../types/dam/domainstory/WorkObjectType";

export type NodeData = {
  id: string;
  left_handle?: HandleProps;
  right_handle?: HandleProps;
  icon: WorkObjectType;
  label: string;
};

type IconNode = Node<NodeData>;

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
          <button>
            <img src={Trash} alt="" onClick={handleDeleteNode} />
          </button>
          <button>
            <img src={ColorPicker} alt="" />
          </button>
        </div>
      </NodeToolbar>
      <Icon name={data.icon as any} className="iconNode" />
      <p>{data.label}</p>
      {/* {
				openInput ? <TextInput className="nodeNameInput" onInputChange={handleInputChange} onEnterPress={handleEnterPress} /> :
					null
			} */}
    </>
  );
}
