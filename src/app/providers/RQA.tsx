"use client";

import type { RuntimeQualityAnalysisDefinition } from "@/types/rqa/definition/RuntimeQualityAnalysisDefinition";
import { createContext } from "react";

export const RQAContext = createContext({
  rqa: {} as RuntimeQualityAnalysisDefinition,
});

export function DqContextProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: {
    rqa: RuntimeQualityAnalysisDefinition;
  };
}) {
  return (
    <RQAContext.Provider
      value={{
        rqa: value.rqa,
      }}
    >
      {children}
    </RQAContext.Provider>
  );
}
