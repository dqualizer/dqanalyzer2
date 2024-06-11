import { deleteLoadtest } from "@/queries/rqa";
import type { LoadTestDefinition } from "@/types/rqa/definition/loadtest/LoadTestDefinition";
import DeleteIcon from "@mui/icons-material/Delete";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MouseEvent } from "react";

interface DeleteLoadTestButtonProps {
	loadTestDefinition: LoadTestDefinition;
	rqaId?: string;
	parentMenuRef: any;
}

export function DeleteLoadTestButton({
	loadTestDefinition,
	rqaId,
	parentMenuRef,
}: DeleteLoadTestButtonProps) {
	const queryClient = useQueryClient();

	const deleteLoadtestMutation = useMutation({
		mutationFn: deleteLoadtest,
		onSuccess: (data) => {
			//queryClient.setQueryData(["rqas", data.id], data);
			queryClient.invalidateQueries({ queryKey: ["rqas"] });
			parentMenuRef.current.open = false;
		},
	});

	const handleDelete = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		if (rqaId && loadTestDefinition.id) {
			deleteLoadtestMutation.mutate({
				rqaId: rqaId,
				loadtestId: loadTestDefinition.id,
			});
		}
	};

	return (
		<button className="btn btn-xs w-fit btn-ghost" onClick={handleDelete}>
			<DeleteIcon color="error" />
		</button>
	);
}
