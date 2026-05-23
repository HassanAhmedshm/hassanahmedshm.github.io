import { createContext, useContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from 'react';
import { AsteroidParams, calculateImpact, ImpactResults } from '../utils/impactCalculator';

export type SimulationPhase = 'idle' | 'approaching' | 'impact' | 'analyzing' | 'finished';

export interface SimulationContextValue {
  // State
  params: AsteroidParams;
  results: ImpactResults | null;
  simulationPhase: SimulationPhase;
  impactLocation: { lat: number; lng: number };
  
  // Setters
  setParams: Dispatch<SetStateAction<AsteroidParams>>;
  setResults: Dispatch<SetStateAction<ImpactResults | null>>;
  setSimulationPhase: Dispatch<SetStateAction<SimulationPhase>>;
  setImpactLocation: Dispatch<SetStateAction<{ lat: number; lng: number }>>;
  
  // Actions
  handleSimulate: () => void;
  handleLocationSelect: (lat: number, lng: number) => void;
  getCityPopulation: (lat: number, lng: number) => { population: number; city: string };
}

const SimulationContext = createContext<SimulationContextValue | null>(null);

const DEFAULT_PARAMS: AsteroidParams = {
  diameter: 100,
  velocity: 30,
  angle: 45,
  density: 'rocky',
  locationType: 'land',
};

const DEFAULT_IMPACT_LOCATION = { lat: 40.7128, lng: -74.006 };

interface SimulationProviderProps {
  children: ReactNode;
}

export function SimulationProvider({ children }: SimulationProviderProps) {
  const [params, setParams] = useState<AsteroidParams>(DEFAULT_PARAMS);
  const [results, setResults] = useState<ImpactResults | null>(null);
  const [simulationPhase, setSimulationPhase] = useState<SimulationPhase>('idle');
  const [impactLocation, setImpactLocation] = useState(DEFAULT_IMPACT_LOCATION);

  // Calculate results when params or location changes
  useEffect(() => {
    const locationData = getCityPopulation(impactLocation.lat, impactLocation.lng);
    const calculatedResults = calculateImpact(params, locationData.population);
    setResults(calculatedResults);
  }, [params, impactLocation]);

  const handleSimulate = () => {
    setSimulationPhase('approaching');
    // Sequence: Approaching (3s) -> Impact (Shock 1s) -> Results
    setTimeout(() => {
      setSimulationPhase('impact');
      setTimeout(() => {
        setSimulationPhase('analyzing');
        setTimeout(() => setSimulationPhase('finished'), 1000);
      }, 1000);
    }, 3000);
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setImpactLocation({ lat, lng });
  };

  function getCityPopulation(lat: number, lng: number): { population: number; city: string } {
    const cities = [
      { name: 'New York', lat: 40.7128, lng: -74.006, population: 8000000 },
      { name: 'London', lat: 51.5074, lng: -0.1278, population: 9000000 },
      { name: 'Tokyo', lat: 35.6762, lng: 139.6503, population: 14000000 },
      { name: 'Los Angeles', lat: 34.0522, lng: -118.2437, population: 4000000 },
      { name: 'Paris', lat: 48.8566, lng: 2.3522, population: 2200000 },
      { name: 'Mumbai', lat: 19.076, lng: 72.8777, population: 20000000 },
    ];

    for (const city of cities) {
      const distance = Math.sqrt(
        Math.pow(lat - city.lat, 2) + Math.pow(lng - city.lng, 2)
      );
      if (distance < 1) {
        return { population: city.population, city: city.name };
      }
    }

    return { population: 0, city: 'Ocean/Rural Area' };
  }

  const value: SimulationContextValue = {
    params,
    results,
    simulationPhase,
    impactLocation,
    setParams,
    setResults,
    setSimulationPhase,
    setImpactLocation,
    handleSimulate,
    handleLocationSelect,
    getCityPopulation,
  };

  return (
    <SimulationContext.Provider value={value}>
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation(): SimulationContextValue {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
}

export default SimulationContext;