import React, { useRef, useState, useEffect } from "react";
import RqaExplorer from "./rqaExplorer/RqaExplorer";
import "../language/icon/icons.css";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import PlaylistPlayIcon from "@mui/icons-material/PlaylistPlay";
import {
  useEdges,
  useOnSelectionChange,
  useReactFlow,
  useStore,
} from "reactflow";
import { MarkerType } from "reactflow";
import "../language/icon/icons.css";
import ViewportChangeLogger from "../utils/hideComponentOnViewportClick";
import LoadtestSpecifier from "./loadtest/LoadtestSpecifier";

export default function Sidebar({ domain, loadtestSpecs, rqas }) {
  const [edgeSelected, setEgdeSelected] = useState(false);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [rqaExplorerShow, setRqaExplorerShow] = useState();
  const [loadTestShow, setLoadTestShow] = useState();
  const [rqaPlayShow, setRqaPlayShow] = useState(false);
  const reactFlowInstance = useReactFlow();
  const loadtestRef = useRef(null);

  ViewportChangeLogger(loadtestRef, setLoadTestShow);

  const selectionChange = useOnSelectionChange({
    onChange: ({ edges }) => {
      if (edges[0]) {
        setSelectedEdge(edges[0]);

        let relatedEdgesArray = reactFlowInstance
          .getEdges()
          .filter((edge) => edge.name == edges[0].name);
        let unrelatedEdgesArray = reactFlowInstance
          .getEdges()
          .filter((edge) => edge.name != edges[0].name);

        let newEdgeArray = [];

        unrelatedEdgesArray.forEach((edge) => {
          edge.animated = false;
          edge.style = {};
          edge.markerStart = {
            type: MarkerType.ArrowClosed,
            width: 20,
            height: 20,
          };
        });

        relatedEdgesArray.forEach((edge) => {
          edge.selected = true;
          edge.animated = true;
          edge.style = {
            stroke: "#570FF2",
          };
          edge.markerStart = {
            type: MarkerType.ArrowClosed,
            width: 20,
            height: 20,
            color: "#570FF2",
          };
        });

        newEdgeArray = newEdgeArray.concat(
          unrelatedEdgesArray,
          relatedEdgesArray
        );
        reactFlowInstance.setEdges(newEdgeArray);
      } else {
        setSelectedEdge();
        let updatedEdgesArray = reactFlowInstance.getEdges();
        updatedEdgesArray.forEach((edge) => {
          edge.animated = false;
          edge.style = {};
        });
        reactFlowInstance.setEdges(updatedEdgesArray);
      }
    },
  });

  const onRqaExplorerClick = () => {
    setRqaExplorerShow((prevState) => !prevState);
  };

  const onLoadtestClick = () => {
    setLoadTestShow((prevState) => !prevState);
  };

  return (
    <div className="sidebar">
      <div className="taskbar-container">
        <button onClick={onRqaExplorerClick}>
          <div>
            <EqualizerIcon />
          </div>
        </button>
        <button onClick={onLoadtestClick}>
          <div className="icon-domain-story-loadtest"></div>
        </button>
        <button>
          <div className="icon-domain-story-monitoring"></div>
        </button>
        <button>
          <div className="icon-domain-story-chaosexperiment"></div>
        </button>
      </div>
      {loadTestShow && (
        <div ref={loadtestRef}>
          <LoadtestSpecifier
            domain={domain}
            loadtestSpecs={loadtestSpecs}
            selectedEdge={selectedEdge}
            rqas={rqas}
          />
        </div>
      )}
      {rqaExplorerShow ? (
        <RqaExplorer loadtestSpecifier={setLoadTestShow} />
      ) : null}
    </div>
  );
}
