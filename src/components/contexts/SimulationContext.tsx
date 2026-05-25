import { createContext, useContext, useState, ReactNode } from 'react';

interface SimulationState {
  selectedAsteroid: any;
  impactScenario: any;
  mitigationStrategy: any;
}

interface SimulationContextType {
  state: SimulationState;
  selectAsteroid: (a: any) => void;
  setImpactScenario: (s: any) => void;
  setMitigationStrategy: (s: any) => void;
  reset: () => void;
}

const SimulationContext = createContext<SimulationContextType | null>(null);

export const SimulationProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<SimulationState>({
    selectedAsteroid: null,
    impactScenario: null,
    mitigationStrategy: null,
  });

  const selectAsteroid = (asteroid: any) => {
    setState(prev => ({ ...prev, selectedAsteroid: asteroid }));
  };

  const setImpactScenario = (scenario: any) => {
    setState(prev => ({ ...prev, impactScenario: scenario }));
  };

  const setMitigationStrategy = (strategy: any) => {
    setState(prev => ({ ...prev, mitigationStrategy: strategy }));
  };

  const reset = () => {
    setState({ selectedAsteroid: null, impactScenario: null, mitigationStrategy: null });
  };

  return (
    <SimulationContext.Provider value={{ state, selectAsteroid, setImpactScenario, setMitigationStrategy, reset }}>
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = (): SimulationContextType => {
  const ctx = useContext(SimulationContext);
  if (!ctx) throw new Error('useSimulation must be used within SimulationProvider');
  return ctx;
};
