import EditIcon from "@mui/icons-material/Edit";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MouseEvent } from "react";
import { deleteLoadtest } from "../../../queries/rqa";

interface EditLoadTestButtonProps {
	loadTestSpecifier: any;
	parentMenuRef: any;
}

export function EditLoadTestButton({
	loadTestSpecifier,
	parentMenuRef,
}: EditLoadTestButtonProps) {
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
		console.log(loadTestSpecifier);
		loadTestSpecifier(true);
	};

	return (
		<button className="btn btn-xs w-fit btn-ghost" onClick={handleDelete}>
			<EditIcon />
		</button>
	);
}
