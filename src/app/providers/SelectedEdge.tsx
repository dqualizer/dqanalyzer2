"use client";

import {
  type Dispatch,
  type SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";
import type { Edge } from "reactflow";

type ContextType = [
  Edge | undefined,
  Dispatch<SetStateAction<Edge | undefined>>,
];

const Context = createContext<ContextType>([undefined, () => {}]);

export const SelectedEdgeProvider = ({
  children,
}: { children: React.ReactNode }) => {
  const [selectedEdge, setSelectedEdge] = useState<Edge | undefined>(undefined);

  return (
    <Context.Provider value={[selectedEdge, setSelectedEdge]}>
      {children}
    </Context.Provider>
  );
};

export const useSelectedEdgeContext = () => {
  return useContext(Context);
};
