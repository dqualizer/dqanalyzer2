import type { DomainArchitectureMapping } from "@/types/dam/dam";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useRef, useState } from "react";
import { createRqa } from "./fetch";

export function RqaInput({ dam }: { dam: DomainArchitectureMapping }) {
  const [name, setName] = useState("");
  const ref = useRef<HTMLFormElement>(null);

  return (
    <div className="flex items-center hover:bg-slate-500 hover:cursor-pointer w-50 px-2 py-2">
      <KeyboardArrowRightIcon fontSize="small" />
      <form
        ref={ref}
        action={async () => {
          await createRqa({
            domain_id: dam.id,
            environment: dam.software_system.environment,
            context: dam.id,
            name: name,
            rqa: {
              loadTestDefinition: [],
              resilienceDefinition: [],
              monitoringDefinition: [],
            },
          });
          ref.current?.reset();
        }}
      >
        <input
          type="text"
          placeholder="Name of the Rqa..."
          className="input input-bordered input-sm w-full max-w-xs"
          onChange={({ target }) => setName(target.value)}
        />
      </form>
    </div>
  );
}
