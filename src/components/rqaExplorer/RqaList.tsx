import { DqContext } from "@/app/providers/DqContext";
import { useContext, useState } from "react";
import ResizeBar from "../ResizeBar";
import { RqaInput } from "./RqaInput";
import { RqaListHeader } from "./RqaListHeader";
import { RqaListItem } from "./RqaListItem";

interface RqaListProps {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  loadTestSpecifier: any;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  resilienceTestSpecifier: any;
}

export function RqaList({
  loadTestSpecifier,
  resilienceTestSpecifier,
}: RqaListProps) {
  const { rqas, dam, domainstory } = useContext(DqContext);

  // Resize States
  const [isResizing, setIsResizing] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(300); // Initial width of the sidebar

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
          <ul className="menu rounded-box px-0 text-base py-0 my-4">
            <RqaListItem
              key={rqa.id}
              rqa={rqa}
              loadTestSpecifier={loadTestSpecifier}
              resilienceTestSpecifier={resilienceTestSpecifier}
            />
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
