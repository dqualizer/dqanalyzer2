import { MouseEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteLoadtest } from "../../../queries/rqa";
import { LoadTestDefinition } from "../../../models/rqa/definition/loadtest/LoadTestDefinition";
import DeleteIcon from "@mui/icons-material/Delete";

interface DeleteLoadTestButtonProps {
	loadTestDefinition: LoadTestDefinition;
	rqaId?: string;
	parentMenuRef: any;
}

export function DeleteLoadTestButton({ loadTestDefinition, rqaId, parentMenuRef }: DeleteLoadTestButtonProps) {

	const queryClient = useQueryClient();

	const deleteLoadtestMutation = useMutation({
		mutationFn: deleteLoadtest,
		onSuccess: (data) => {
			//queryClient.setQueryData(["rqas", data.id], data);
			queryClient.invalidateQueries(["rqas"]);
			parentMenuRef.current.open = false;
		},
	});

	const handleDelete = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		deleteLoadtestMutation.mutate({
			rqaId: rqaId,
			loadtestName: loadTestDefinition.name,
		});
	};

	return (
		<button className="btn btn-xs w-fit btn-ghost" onClick={handleDelete}>
			<DeleteIcon color="error" />
		</button>
	);
}
