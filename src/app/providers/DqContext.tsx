"use client";

import type { DomainArchitectureMapping } from "@/types/dam/dam";
import type { DomainStory } from "@/types/dam/domainstory/DomainStory";
import type { RuntimeQualityAnalysisDefinition } from "@/types/rqa/definition/RuntimeQualityAnalysisDefinition";
import { createContext, useContext } from "react";

type ContextType = {
  dam: DomainArchitectureMapping;
  domainstory: DomainStory;
  rqas: RuntimeQualityAnalysisDefinition[];
};

const DqContext = createContext<ContextType>({
  dam: {} as DomainArchitectureMapping,
  domainstory: {} as DomainStory,
  rqas: [] as RuntimeQualityAnalysisDefinition[],
});

export function DqContextProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: ContextType;
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

export const useDqContext = () => {
  return useContext(DqContext);
};
