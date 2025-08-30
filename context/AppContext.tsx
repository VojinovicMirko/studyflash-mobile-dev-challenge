import React, { createContext, ReactNode, useContext, useState } from "react";

type AppContextType = {
  regenerateMessages: () => void;
  isRegenerating: boolean;
  setIsRegenerating: (isRegenerating: boolean) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}

type AppProviderProps = {
  children: ReactNode;
};

export function AppProvider({ children }: AppProviderProps) {
  const [isRegenerating, setIsRegenerating] = useState(false);

  const regenerateMessages = () => {
    console.log("Regenerating messages...");
    setIsRegenerating(true);
  };

  const value = {
    regenerateMessages,
    isRegenerating,
    setIsRegenerating,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
