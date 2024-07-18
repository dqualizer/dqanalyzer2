"use client";

import type { DomainArchitectureMapping } from "@/types/dam/dam";
import type { DomainStory } from "@/types/dam/domainstory/DomainStory";
import type { RuntimeQualityAnalysisDefinition } from "@/types/rqa/definition/RuntimeQualityAnalysisDefinition";
import { createContext } from "react";

export const DqContext = createContext({
	dam: {} as DomainArchitectureMapping,
	domainstory: {} as DomainStory,
	rqas: [] as RuntimeQualityAnalysisDefinition[],
});

export function DqContextProvider({
	children,
	value,
}: {
	children: React.ReactNode;
	value: {
		dam: DomainArchitectureMapping;
		domainstory: DomainStory;
		rqas: RuntimeQualityAnalysisDefinition[];
	};
}) {
	return (
		<DqContext.Provider
			value={{
				dam: value.dam,
				domainstory: value.domainstory,
				rqas: value.rqas,
			}}
		>
			{children}
		</DqContext.Provider>
	);
}
