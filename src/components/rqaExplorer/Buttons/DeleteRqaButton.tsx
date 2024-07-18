import type { RuntimeQualityAnalysisDefinition } from "@/types/rqa/definition/RuntimeQualityAnalysisDefinition";
import DeleteIcon from "@mui/icons-material/Delete";
import type { MouseEvent } from "react";

interface DeleteRqaButtonProps {
	rqa: RuntimeQualityAnalysisDefinition;
	parentMenuRef: any;
	action: any; // TODO type
}

export function DeleteRqaButton({
	rqa,
	parentMenuRef,
	action,
}: DeleteRqaButtonProps) {
	// const deleteLoadtestMutation = useMutation({
	// 	mutationFn: deleteRqa,
	// 	onSuccess: (data) => {
	// 		//queryClient.setQueryData(["rqas", data.id], data);
	// 		queryClient.invalidateQueries({ queryKey: ["rqas"] });
	// 		parentMenuRef.current.open = false;
	// 	},
	// });

	const handleDelete = (ev: MouseEvent<HTMLButtonElement>) => {
		ev.preventDefault();
		// deleteLoadtestMutation.mutate({
		// 	rqaId: rqa.id,
		// });
	};

	return (
		<button
			type="button"
			className="btn btn-xs w-fit btn-ghost"
			onClick={handleDelete}
		>
			<DeleteIcon color="error" />
		</button>
	);
}
