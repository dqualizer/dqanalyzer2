import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRqa } from "../../../queries/rqa";
import { RuntimeQualityAnalysisDefinition } from "../../../models/rqa/definition/RuntimeQualityAnalysisDefinition";
import DeleteIcon from "@mui/icons-material/Delete";
import { MouseEvent } from "react";

interface DeleteRqaButtonProps {
	rqa: RuntimeQualityAnalysisDefinition;
	parentMenuRef: any;
	action: any; // TODO type
}

export function DeleteRqaButton({ rqa, parentMenuRef, action }: DeleteRqaButtonProps) {
	const queryClient = useQueryClient();

	const deleteLoadtestMutation = useMutation({
		mutationFn: deleteRqa,
		onSuccess: (data) => {
			//queryClient.setQueryData(["rqas", data.id], data);
			queryClient.invalidateQueries(["rqas"]);
			parentMenuRef.current.open = false;
		},
	});

	const handleDelete = (ev: MouseEvent<HTMLButtonElement>) => {
		ev.preventDefault();
		deleteLoadtestMutation.mutate({
			rqaId: rqa._id,
		});
	};

	return (
		<button className="btn btn-xs w-fit btn-ghost" onClick={handleDelete}>
			<DeleteIcon color="error" />
		</button>
	);
}
