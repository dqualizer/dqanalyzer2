import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteLoadtest, deleteRqa } from "../../../queries/rqa";
import DeleteIcon from "@mui/icons-material/Delete";
export default function DeleteRqa({ data, parentMenuRef, action }) {
  const queryClient = useQueryClient();

  const deleteLoadtestMutation = useMutation({
    mutationFn: deleteRqa,
    onSuccess: (data) => {
      //queryClient.setQueryData(["rqas", data.id], data);
      queryClient.invalidateQueries(["rqas"]);
      parentMenuRef.current.open = false;
    },
  });

  const handleDelete = (e) => {
    e.preventDefault();
    deleteLoadtestMutation.mutate({
      rqaId: data.id,
    });
  };

  return (
    <button className="btn btn-xs w-fit btn-ghost" onClick={handleDelete}>
      <DeleteIcon color="error" />
    </button>
  );
}
