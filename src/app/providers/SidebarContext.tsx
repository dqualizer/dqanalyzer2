"use client";

import { createContext, useContext, useState } from "react";

type ContextType = {
  scenarioModeState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  rqaExplorerState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  loadTestSpecifierState: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>,
  ];
  resilienceTestSpecifierState: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>,
  ];
  monitoringSpecifierState: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>,
  ];
};

const Context = createContext<ContextType>({
  scenarioModeState: [false, () => {}],
  rqaExplorerState: [false, () => {}],
  loadTestSpecifierState: [false, () => {}],
  resilienceTestSpecifierState: [false, () => {}],
  monitoringSpecifierState: [false, () => {}],
});

export const SideBarProvider = ({
  children,
}: { children: React.ReactNode }) => {
  const scenarioModeState = useState(false);
  const rqaExplorerState = useState(false);
  const loadTestSpecifierState = useState(false);
  const resilienceTestSpecifierState = useState(false);
  const monitoringSpecifierState = useState(false);

  return (
    <Context.Provider
      value={{
        scenarioModeState,
        rqaExplorerState,
        loadTestSpecifierState,
        resilienceTestSpecifierState,
        monitoringSpecifierState,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useSideBarContext = () => {
  return useContext(Context);
};
