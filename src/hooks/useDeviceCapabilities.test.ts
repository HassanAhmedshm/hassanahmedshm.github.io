import { renderHook } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useDeviceCapabilities } from './useDeviceCapabilities';

/**
 * Unit tests for useDeviceCapabilities hook
 * Validates: Requirements 1.1, 1.2, 1.3
 * 
 * Requirement 1.1: Reduced particle count (200) for hardware concurrency < 4
 * Requirement 1.2: Minimal particle count (100) for mobile devices
 * Requirement 1.3: No render (0 particles) when WebGL unavailable
 */

describe('useDeviceCapabilities', () => {
  // Store original values for cleanup
  const originalNavigator = global.navigator;
  const originalMatchMedia = window.matchMedia;
  const originalCreateElement = document.createElement.bind(document);

  beforeEach(() => {
    // Reset all mocks before each test
    vi.restoreAllMocks();
  });

  afterEach(() => {
    // Restore original implementations
    Object.defineProperty(global, 'navigator', {
      value: originalNavigator,
      writable: true,
    });
    window.matchMedia = originalMatchMedia;
    document.createElement = originalCreateElement;
  });

  describe('Requirement 1.1: Reduced particle count for low hardware concurrency', () => {
    it('returns 200 particles when hardware concurrency is less than 4', () => {
      // Mock hardware concurrency to 2 (low-end device)
      Object.defineProperty(global, 'navigator', {
        value: {
          hardwareConcurrency: 2,
        },
        writable: true,
      });

      // Mock matchMedia for desktop (not mobile)
      window.matchMedia = vi.fn().mockImplementation((query: string) => ({
        matches: query === '(max-width: 768px)' ? false : false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));

      // Mock WebGL support (available)
      const mockGetContext = vi.fn().mockReturnValue({});
      vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
        if (tagName === 'canvas') {
          return {
            getContext: mockGetContext,
          } as unknown as HTMLCanvasElement;
        }
        return originalCreateElement(tagName);
      });

      const { result } = renderHook(() => useDeviceCapabilities());

      expect(result.current.hardwareConcurrency).toBe(2);
      expect(result.current.recommendedParticleCount).toBe(200);
    });

    it('returns 500 particles when hardware concurrency is 4 or higher', () => {
      // Mock hardware concurrency to 8 (high-end device)
      Object.defineProperty(global, 'navigator', {
        value: {
          hardwareConcurrency: 8,
        },
        writable: true,
      });

      // Mock matchMedia for desktop (not mobile)
      window.matchMedia = vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));

      // Mock WebGL support (available)
      const mockGetContext = vi.fn().mockReturnValue({});
      vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
        if (tagName === 'canvas') {
          return {
            getContext: mockGetContext,
          } as unknown as HTMLCanvasElement;
        }
        return originalCreateElement(tagName);
      });

      const { result } = renderHook(() => useDeviceCapabilities());

      expect(result.current.hardwareConcurrency).toBe(8);
      expect(result.current.recommendedParticleCount).toBe(500);
    });
  });

  describe('Requirement 1.2: Minimal particle count for mobile', () => {
    it('returns 100 particles when viewport width is 768px or less', () => {
      // Mock hardware concurrency to 8 (high-end device)
      Object.defineProperty(global, 'navigator', {
        value: {
          hardwareConcurrency: 8,
        },
        writable: true,
      });

      // Mock matchMedia for mobile
      window.matchMedia = vi.fn().mockImplementation((query: string) => ({
        matches: query === '(max-width: 768px)' ? true : false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));

      // Mock WebGL support (available)
      const mockGetContext = vi.fn().mockReturnValue({});
      vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
        if (tagName === 'canvas') {
          return {
            getContext: mockGetContext,
          } as unknown as HTMLCanvasElement;
        }
        return originalCreateElement(tagName);
      });

      const { result } = renderHook(() => useDeviceCapabilities());

      expect(result.current.isMobile).toBe(true);
      expect(result.current.recommendedParticleCount).toBe(100);
    });

    it('mobile takes precedence over low hardware concurrency', () => {
      // Mock hardware concurrency to 2 (low-end device)
      Object.defineProperty(global, 'navigator', {
        value: {
          hardwareConcurrency: 2,
        },
        writable: true,
      });

      // Mock matchMedia for mobile
      window.matchMedia = vi.fn().mockImplementation((query: string) => ({
        matches: query === '(max-width: 768px)' ? true : false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));

      // Mock WebGL support (available)
      const mockGetContext = vi.fn().mockReturnValue({});
      vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
        if (tagName === 'canvas') {
          return {
            getContext: mockGetContext,
          } as unknown as HTMLCanvasElement;
        }
        return originalCreateElement(tagName);
      });

      const { result } = renderHook(() => useDeviceCapabilities());

      // Mobile should take precedence (100 particles, not 200)
      expect(result.current.isMobile).toBe(true);
      expect(result.current.recommendedParticleCount).toBe(100);
    });
  });

  describe('Requirement 1.3: hasWebGL returns false when WebGL unavailable', () => {
    it('returns false for hasWebGL when WebGL context cannot be created', () => {
      // Mock hardware concurrency to 8 (high-end device)
      Object.defineProperty(global, 'navigator', {
        value: {
          hardwareConcurrency: 8,
        },
        writable: true,
      });

      // Mock matchMedia for desktop (not mobile)
      window.matchMedia = vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));

      // Mock WebGL context creation to fail
      const mockGetContext = vi.fn().mockReturnValue(null);
      vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
        if (tagName === 'canvas') {
          return {
            getContext: mockGetContext,
          } as unknown as HTMLCanvasElement;
        }
        return originalCreateElement(tagName);
      });

      const { result } = renderHook(() => useDeviceCapabilities());

      expect(result.current.hasWebGL).toBe(false);
      expect(result.current.recommendedParticleCount).toBe(0);
    });

    it('returns 0 particles when WebGL is unavailable regardless of other capabilities', () => {
      // Mock hardware concurrency to 8 (high-end device)
      Object.defineProperty(global, 'navigator', {
        value: {
          hardwareConcurrency: 8,
        },
        writable: true,
      });

      // Mock matchMedia for mobile
      window.matchMedia = vi.fn().mockImplementation((query: string) => ({
        matches: query === '(max-width: 768px)' ? true : false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));

      // Mock WebGL context creation to fail
      const mockGetContext = vi.fn().mockReturnValue(null);
      vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
        if (tagName === 'canvas') {
          return {
            getContext: mockGetContext,
          } as unknown as HTMLCanvasElement;
        }
        return originalCreateElement(tagName);
      });

      const { result } = renderHook(() => useDeviceCapabilities());

      // Should be 0 particles when WebGL unavailable, even on mobile
      expect(result.current.hasWebGL).toBe(false);
      expect(result.current.recommendedParticleCount).toBe(0);
    });
  });

  describe('Additional capability detection', () => {
    it('returns true for prefersReducedMotion when user prefers reduced motion', () => {
      Object.defineProperty(global, 'navigator', {
        value: {
          hardwareConcurrency: 8,
        },
        writable: true,
      });

      window.matchMedia = vi.fn().mockImplementation((query: string) => ({
        matches: query === '(prefers-reduced-motion: reduce)' ? true : false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));

      const mockGetContext = vi.fn().mockReturnValue({});
      vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
        if (tagName === 'canvas') {
          return {
            getContext: mockGetContext,
          } as unknown as HTMLCanvasElement;
        }
        return originalCreateElement(tagName);
      });

      const { result } = renderHook(() => useDeviceCapabilities());

      expect(result.current.prefersReducedMotion).toBe(true);
      expect(result.current.recommendedParticleCount).toBe(0);
    });

    it('detects touch device when ontouchstart is available', () => {
      Object.defineProperty(global, 'navigator', {
        value: {
          hardwareConcurrency: 8,
        },
        writable: true,
      });

      window.matchMedia = vi.fn().mockImplementation(() => ({
        matches: false,
        media: '',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));

      // Mock touch support
      (window as unknown as Record<string, unknown>).ontouchstart = {};

      const mockGetContext = vi.fn().mockReturnValue({});
      vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
        if (tagName === 'canvas') {
          return {
            getContext: mockGetContext,
          } as unknown as HTMLCanvasElement;
        }
        return originalCreateElement(tagName);
      });

      const { result } = renderHook(() => useDeviceCapabilities());

      expect(result.current.isTouchDevice).toBe(true);

      // Cleanup
      delete (window as unknown as Record<string, unknown>).ontouchstart;
    });
  });
});