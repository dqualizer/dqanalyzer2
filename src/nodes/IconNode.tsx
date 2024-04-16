import {
  Handle,
  HandleProps,
  Node,
  NodeProps,
  NodeToolbar,
  Position,
  useReactFlow,
} from "reactflow";
import { Icon, IconProps } from "./nodeComponents/Icon";
import Trash from "../assets/trash.svg";
import ColorPicker from "../assets/color-picker.svg";

type NodeData = {
  left_handle: HandleProps;
  right_handle: HandleProps;
  icon: IconProps;
  label: String;
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
      <Handle
        type={data.left_handle.type}
        position={data.left_handle.position}
      />
      {data.right_handle ? (
        <Handle
          id={`${data.right_handle.id}`}
          type={data.right_handle.type}
          position={data.right_handle.position}
        />
      ) : null}
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
      <Icon name={data.icon.name} className="iconNode" />
      <p>{data.label}</p>
      {/* {
				openInput ? <TextInput className="nodeNameInput" onInputChange={handleInputChange} onEnterPress={handleEnterPress} /> :
					null
			} */}
    </>
  );
}
