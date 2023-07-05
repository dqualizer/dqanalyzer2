import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteLoadtest } from "../../../queries/rqa";

import EditIcon from "@mui/icons-material/Edit";
export default function EditLoadtest({
  data,
  parentMenuRef,
  rqaId,
  loadtestSpecifier,
}) {
  const queryClient = useQueryClient();

  console.log(data);

  const deleteLoadtestMutation = useMutation({
    mutationFn: deleteLoadtest,
    onSuccess: (data) => {
      //queryClient.setQueryData(["rqas", data.id], data);
      queryClient.invalidateQueries(["rqas"]);
      parentMenuRef.current.open = false;
    },
  });

  const handleDelete = (e) => {
    console.log(loadtestSpecifier);
    loadtestSpecifier(true);
  };

  return (
    <button className="btn btn-xs w-fit btn-ghost" onClick={handleDelete}>
      <EditIcon color="default" />
    </button>
  );
}
