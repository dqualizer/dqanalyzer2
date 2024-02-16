import { useState } from "react";
import { RqaListHeader } from "./RqaListHeader";
import { ResizeBar } from "../ResizeBar";
import { useQuery } from "@tanstack/react-query";
import { getAllRqas } from "../../queries/rqa";
import { RqaListItem } from "./RqaListItem";
import { RqaInput } from "./RqaInput";

interface RqaListProps {
	loadtestSpecifier: any;
}

export function RqaList({ loadtestSpecifier }: RqaListProps) {

	const rqaQuery = useQuery({
		queryKey: ["rqas"],
		queryFn: getAllRqas,
	});

	// Resize States
	const [isResizing, setIsResizing] = useState(false);
	const [sidebarWidth, setSidebarWidth] = useState(300); // Initial width of the sidebar

	// Pressing the + opens an input field.
	const [inputOpen, setInputOpen] = useState(false);

	const handleAddClick = () => {
		setInputOpen(true);
	};

	return (
		<>
			<div className="py-4 px-4 bg-slate-200">
				<RqaListHeader handleAddClick={handleAddClick} />
				{rqaQuery.status == "success" && rqaQuery.data.map(rqa => <RqaListItem key={rqa._id} rqa={rqa} loadtestSpecifier={loadtestSpecifier} />)}
				{inputOpen && <RqaInput setInputOpen={setInputOpen} />}
			</div>
			<ResizeBar
				setSidebarWidth={setSidebarWidth}
				setIsResizing={setIsResizing}
				isResizing={isResizing}
			/>
		</>
	);
}
