import { useDqContext } from "@/app/providers/DqContext";
import { useState } from "react";
import ResizeBar from "../ResizeBar";
import { RqaInput } from "./RqaInput";
import { RqaListHeader } from "./RqaListHeader";
import { RqaListItem } from "./RqaListItem";

export function RqaList() {
  const { rqas, dam } = useDqContext();

  // Resize States
  const [isResizing, setIsResizing] = useState(false);
  const [, setSidebarWidth] = useState(300); // Initial width of the sidebar

  // Pressing the + opens an input field.
  const [inputOpen, setInputOpen] = useState(false);

  return (
    <>
      <div className="py-4 px-4 bg-slate-200">
        <RqaListHeader
          handleAddClick={() => {
            setInputOpen(true);
          }}
        />
        {rqas.map((rqa) => (
          <ul
            key={rqa.id}
            className="menu rounded-box px-0 text-base py-0 my-4"
          >
            <RqaListItem rqa={rqa} />
          </ul>
        ))}
        {inputOpen && <RqaInput dam={dam} />}
      </div>
      <ResizeBar
        setSidebarWidth={setSidebarWidth}
        setIsResizing={setIsResizing}
        isResizing={isResizing}
      />
    </>
  );
}
