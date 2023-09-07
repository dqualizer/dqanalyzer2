import React, { useState, useEffect } from "react";

import RqaTree from "./Tree";
import RqaExplorerHeader from "./Header";
import ResizeBar from "../ResizeBar";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createRqa, getAllRqas } from "../../queries/rqa";
import Explorer from "../testing/Explorer";
import RqaInputField from "./RqaInputField";

export default function RqaExplorer({ loadtestSpecifier }) {
  const rqaQuery = useQuery({
    queryKey: ["rqas"],
    queryFn: getAllRqas,
  });

  // Resize States
  const [isResizing, setIsResizing] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(300); // Initial width of the sidebar

  // Pressing the + pens an input field.
  const [inputOpen, setInputOpen] = useState(false);

  const handleAddClick = () => {
    console.log("click");
    setInputOpen(true);
  };

  return (
    <>
      <div className="py-4 px-4 bg-slate-200">
        <RqaExplorerHeader handleAddClick={handleAddClick} />
        {rqaQuery.status == "success" &&
          rqaQuery.data.map((rqa) => (
            <Explorer data={rqa} loadtestSpecifier={loadtestSpecifier} />
          ))}
        {inputOpen && <RqaInputField setInputOpen={setInputOpen} />}
      </div>
      <ResizeBar
        setSidebarWidth={setSidebarWidth}
        setIsResizing={setIsResizing}
        isResizing={isResizing}
      />
    </>
  );
}
