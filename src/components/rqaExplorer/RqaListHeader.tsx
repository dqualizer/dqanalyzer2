import { MouseEvent } from "react";
import AddIcon from "@mui/icons-material/Add";

interface RqaListHeaderProps {
	handleAddClick: (ev: MouseEvent<HTMLButtonElement>) => void;
}

export function RqaListHeader({ handleAddClick }: RqaListHeaderProps) {
	return (
		<div className="flex items-center justify-between">
			<span className="mr-16">RQA Explorer</span>
			<button onClick={handleAddClick}>
				<AddIcon />
			</button>
		</div>
	);
}
