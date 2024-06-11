import { deleteResilienceTest } from "@/queries/rqa";
import type { ResilienceTestDefinition } from "@/types/rqa/definition/resiliencetest/ResilienceTestDefinition";
import DeleteIcon from "@mui/icons-material/Delete";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MouseEvent } from "react";

interface DeleteResilienceTestButtonProps {
	resilienceTestDefinition: ResilienceTestDefinition;
	rqaId?: string;
	parentMenuRef: any;
}

export function DeleteResilienceTestButton({
	resilienceTestDefinition,
	rqaId,
	parentMenuRef,
}: DeleteResilienceTestButtonProps) {
	const queryClient = useQueryClient();

	const deletReslienceTestMutation = useMutation({
		mutationFn: deleteResilienceTest,
		onSuccess: (data) => {
			//queryClient.setQueryData(["rqas", data.id], data);
			queryClient.invalidateQueries({ queryKey: ["rqas"] });
			parentMenuRef.current.open = false;
		},
	});

	const handleDelete = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		// TODO change to ID when available
		if (rqaId && resilienceTestDefinition.name) {
			deletReslienceTestMutation.mutate({
				rqaId: rqaId,
				resilienceTestId: resilienceTestDefinition.name,
			});
		}
	};

	return (
		<button className="btn btn-xs w-fit btn-ghost" onClick={handleDelete}>
			<DeleteIcon color="error" />
		</button>
	);
}
