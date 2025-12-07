import { createContext, useContext, ReactNode } from "react";

interface VisualizationContextType {
  width: number;
  height: number;
}

const VisualizationContext = createContext<VisualizationContextType | undefined>(undefined);

export const VisualizationProvider = ({
  children,
  width,
  height,
}: {
  children: ReactNode;
  width: number;
  height: number;
}) => {
  return <VisualizationContext.Provider value={{ width, height }}>{children}</VisualizationContext.Provider>;
};

export const useVisualizationContext = () => {
  const context = useContext(VisualizationContext);
  if (context === undefined) {
    throw new Error("useVisualizationContext must be used within a VisualizationProvider");
  }
  return context;
};
