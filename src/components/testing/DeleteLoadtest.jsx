import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteLoadtest } from "../../queries/rqa";
import DeleteIcon from "@mui/icons-material/Delete";
export default function DeleteLoadtest({ data, parentMenuRef, rqaId }) {
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
    e.preventDefault();
    deleteLoadtestMutation.mutate({
      rqaId: rqaId,
      loadtestName: data.name,
    });
  };

  return (
    <button className="btn btn-xs w-fit btn-ghost" onClick={handleDelete}>
      <DeleteIcon color="error" />
    </button>
  );
}
