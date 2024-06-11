import type { DomainArchitectureMapping } from "@/types/dam/dam";
import type { DomainStory } from "@/types/dam/domainstory/DomainStory";
import type { RuntimeQualityAnalysisDefinition } from "@/types/rqa/definition/RuntimeQualityAnalysisDefinition";
import { useState } from "react";
import ResizeBar from "../ResizeBar";
import { RqaInput } from "./RqaInput";
import { RqaListHeader } from "./RqaListHeader";
import { RqaListItem } from "./RqaListItem";

interface RqaListProps {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	loadTestSpecifier: any;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	resilienceTestSpecifier: any;
	rqas: RuntimeQualityAnalysisDefinition[];
	domainStory: DomainStory;
	dam: DomainArchitectureMapping;
}

export function RqaList({
	loadTestSpecifier,
	resilienceTestSpecifier,
	rqas,
	domainStory,
	dam,
}: RqaListProps) {
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
				{rqas.map((rqa) => (
					<RqaListItem
						key={rqa.id}
						rqa={rqa}
						domainStory={domainStory}
						loadTestSpecifier={loadTestSpecifier}
						resilienceTestSpecifier={resilienceTestSpecifier}
					/>
				))}
				{inputOpen && <RqaInput setInputOpen={setInputOpen} dam={dam} />}
			</div>
			<ResizeBar
				setSidebarWidth={setSidebarWidth}
				setIsResizing={setIsResizing}
				isResizing={isResizing}
			/>
		</>
	);
}
