import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ReactNode } from 'react';
import { SimulationProvider, useSimulation } from './SimulationContext';

/**
 * Unit tests for SimulationContext
 * Validates: Requirements 6.2, 6.4
 *
 * Requirement 6.2: Context provides default simulation parameters
 * Requirement 6.4: Context throws error when used outside provider
 */

// Helper wrapper for renderHook
const wrapper = ({ children }: { children: ReactNode }) => (
  <SimulationProvider>{children}</SimulationProvider>
);

describe('SimulationContext', () => {
  describe('Requirement 6.2: Default params are provided', () => {
    it('provides default params with diameter of 100', () => {
      const { result } = renderHook(() => useSimulation(), { wrapper });

      expect(result.current.params.diameter).toBe(100);
    });

    it('provides default params with velocity of 30', () => {
      const { result } = renderHook(() => useSimulation(), { wrapper });

      expect(result.current.params.velocity).toBe(30);
    });

    it('provides default params with angle of 45', () => {
      const { result } = renderHook(() => useSimulation(), { wrapper });

      expect(result.current.params.angle).toBe(45);
    });

    it('provides default params with density of rocky', () => {
      const { result } = renderHook(() => useSimulation(), { wrapper });

      expect(result.current.params.density).toBe('rocky');
    });

    it('provides default params with locationType of land', () => {
      const { result } = renderHook(() => useSimulation(), { wrapper });

      expect(result.current.params.locationType).toBe('land');
    });

    it('provides default simulation phase as idle', () => {
      const { result } = renderHook(() => useSimulation(), { wrapper });

      expect(result.current.simulationPhase).toBe('idle');
    });

    it('provides default impact location', () => {
      const { result } = renderHook(() => useSimulation(), { wrapper });

      expect(result.current.impactLocation).toEqual({ lat: 40.7128, lng: -74.006 });
    });
  });

  describe('Requirement 6.2: Params update via setParams', () => {
    it('updates diameter via setParams', () => {
      const { result } = renderHook(() => useSimulation(), { wrapper });

      act(() => {
        result.current.setParams({ ...result.current.params, diameter: 200 });
      });

      expect(result.current.params.diameter).toBe(200);
    });

    it('updates velocity via setParams', () => {
      const { result } = renderHook(() => useSimulation(), { wrapper });

      act(() => {
        result.current.setParams({ ...result.current.params, velocity: 50 });
      });

      expect(result.current.params.velocity).toBe(50);
    });

    it('updates angle via setParams', () => {
      const { result } = renderHook(() => useSimulation(), { wrapper });

      act(() => {
        result.current.setParams({ ...result.current.params, angle: 60 });
      });

      expect(result.current.params.angle).toBe(60);
    });

    it('updates density via setParams', () => {
      const { result } = renderHook(() => useSimulation(), { wrapper });

      act(() => {
        result.current.setParams({ ...result.current.params, density: 'metallic' });
      });

      expect(result.current.params.density).toBe('metallic');
    });

    it('updates locationType via setParams', () => {
      const { result } = renderHook(() => useSimulation(), { wrapper });

      act(() => {
        result.current.setParams({ ...result.current.params, locationType: 'ocean' });
      });

      expect(result.current.params.locationType).toBe('ocean');
    });

    it('supports functional updates with setParams', () => {
      const { result } = renderHook(() => useSimulation(), { wrapper });

      act(() => {
        result.current.setParams((prev) => ({
          ...prev,
          diameter: prev.diameter * 2,
        }));
      });

      expect(result.current.params.diameter).toBe(200);
    });
  });

  describe('Requirement 6.4: Context throws when used outside provider', () => {
    it('throws error when useSimulation is called without provider', () => {
      // Suppress the expected error from being logged in test output
      const originalError = console.error;
      console.error = () => {};

      expect(() => {
        renderHook(() => useSimulation());
      }).toThrow('useSimulation must be used within a SimulationProvider');

      console.error = originalError;
    });
  });

  describe('Additional context functionality', () => {
    it('updates simulation phase via setSimulationPhase', () => {
      const { result } = renderHook(() => useSimulation(), { wrapper });

      act(() => {
        result.current.setSimulationPhase('approaching');
      });

      expect(result.current.simulationPhase).toBe('approaching');
    });

    it('updates impact location via handleLocationSelect', () => {
      const { result } = renderHook(() => useSimulation(), { wrapper });

      act(() => {
        result.current.handleLocationSelect(51.5074, -0.1278);
      });

      expect(result.current.impactLocation).toEqual({ lat: 51.5074, lng: -0.1278 });
    });

    it('provides results after initial render', () => {
      const { result } = renderHook(() => useSimulation(), { wrapper });

      // Results should be calculated automatically
      expect(result.current.results).not.toBeNull();
    });
  });
});