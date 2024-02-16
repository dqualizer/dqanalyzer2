import { MouseEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteLoadtest } from "../../../queries/rqa";
import EditIcon from "@mui/icons-material/Edit";

interface EditLoadTestButtonProps {
	loadtestSpecifier: any,
	parentMenuRef: any,
}

export function EditLoadTestButton({ loadtestSpecifier, parentMenuRef }: EditLoadTestButtonProps) {
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
		console.log(loadtestSpecifier);
		loadtestSpecifier(true);
	};

	return (
		<button className="btn btn-xs w-fit btn-ghost" onClick={handleDelete}>
			<EditIcon />
		</button>
	);
}
