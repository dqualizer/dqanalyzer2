import React from "react";
import AddIcon from "@mui/icons-material/Add";
export default function RqaExplorerHeader({ handleAddClick }) {
  return (
    <div className="flex items-center justify-between">
      <span className="mr-16">RQA Explorer</span>
      <button onClick={handleAddClick}>
        <AddIcon />
      </button>
    </div>
  );
}
