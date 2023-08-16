import React from "react";
import { useRef } from "react";
import RqaDefinition from "./RqaDefinition";
import DeleteRqa from "./DeleteRqa";
import { deleteRqa } from "../../queries/rqa";
import RqaInputField from "../rqa_explorer/RqaInputField";
export default function Explorer({ data, loadtestSpecifier }) {
  const detailsRef = useRef();
  return (
    <ul className="menu rounded-box px-0 text-base py-0 my-4">
      <li>
        <details ref={detailsRef} className="my-0">
          <summary className="pl-0">
            <span>{data.name}</span>
            <DeleteRqa
              data={data}
              parentMenuRef={detailsRef}
              action={deleteRqa}
            />
          </summary>
          <RqaDefinition loadtestSpecifier={loadtestSpecifier} data={data} />
        </details>
      </li>
    </ul>
  );
}
