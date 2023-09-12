import React, { useState } from "react";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRqa } from "../../queries/rqa";
import { useMatch } from "react-router-dom";

export default function RqaInput({ setInputOpen }) {
  const match = useMatch("/analyzer/:domainId");
  const [value, setValue] = useState();
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

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  function handleSave(e) {
    if (e.key == "Enter" || e.type == "blur") {
      createRqaMutation.mutate({
        name: value,
        domain_id: match.params.domainId,
        environment: "TEST",
        context: "Werkstatt",
      });
    }
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
