import {
  ChangeEvent,
  Dispatch,
  FocusEvent,
  KeyboardEvent,
  SetStateAction,
  useState,
} from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRqa } from "../../queries/rqa";
import { useMatch } from "react-router-dom";

import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { RuntimeQualityAnalysisDefinition } from "../../types/rqa/definition/RuntimeQualityAnalysisDefinition";
import { Environment } from "../../types/rqa/definition/enums/Environment";

interface RqaInputProps {
  setInputOpen: Dispatch<SetStateAction<boolean>>;
}

export function RqaInput({ setInputOpen }: RqaInputProps) {
  const match = useMatch("/analyzer/:domainId");
  const [value, setValue] = useState<string>();
  const queryClient = useQueryClient();

  const spacingVariants = {
    0: "px-0",
    1: "px-2",
    2: "px-4",
    3: "px-6",
    4: "px-8",
    5: "px-10",
    6: "px-16",
    8: "px-32",
  };

  const createRqaMutation = useMutation({
    mutationFn: createRqa,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["rqas"]);
      setValue("");
      setInputOpen(false);
    },
  });

  const handleChange = (ev: ChangeEvent<HTMLInputElement>) => {
    setValue(ev.target.value);
  };

  function handleSave(
    ev: KeyboardEvent<HTMLInputElement> | FocusEvent<HTMLInputElement>
  ) {
    // TODO hardcoded environment & context
    if (("key" in ev && ev.key == "Enter") || ev.type == "blur") {
      const rqa: RuntimeQualityAnalysisDefinition = {
        name: value!,
        // TODO hardcoded domain_id
        //domain_id: match.params.domainId,
        domain_id: "65b757d3fe8ea06856910970",
        // TODO hardcoded version
        version: "1",
        environment: Environment.TEST,
        // TODO hardcoded context
        context: "testContext",
        runtime_quality_analysis: {
          loadTestDefinition: [],
          resilienceDefinition: [],
        },
      };
      createRqaMutation.mutate(rqa);
    }

    /* if (('key' in ev && ev.key == "Enter") || ev.type == "blur") {
			createRqaMutation.mutate({
				name: value,
				domain_id: match?.params.domainId,
				environment: "TEST",
				context: "Werkstatt",
			});
		} */
  }

  return (
    <div
      className={`flex items-center hover:bg-slate-500 hover:cursor-pointer w-50 ${spacingVariants[1]} py-2 `}
    >
      <KeyboardArrowRightIcon fontSize="small" />
      <input
        autoFocus
        type="text"
        placeholder="Name of the Rqa..."
        className="input input-bordered input-sm w-full max-w-xs"
        onChange={handleChange}
        onKeyDown={handleSave}
        onBlur={handleSave}
      />
    </div>
  );
}
