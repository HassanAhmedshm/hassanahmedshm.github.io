import { useState, useEffect } from 'react';

/**
 * Device capabilities detected at runtime for adaptive performance
 */
interface DeviceCapabilities {
  /** Number of logical CPU cores */
  hardwareConcurrency: number;
  
  /** True if viewport width <= 768px */
  isMobile: boolean;
  
  /** True if WebGL context can be created */
  hasWebGL: boolean;
  
  /** True if user prefers reduced motion */
  prefersReducedMotion: boolean;
  
  /** True if touch input is available */
  isTouchDevice: boolean;
  
  /** Calculated particle count based on capabilities */
  recommendedParticleCount: number;
}

/**
 * Default capabilities for SSR/initial render
 */
const defaultCapabilities: DeviceCapabilities = {
  hardwareConcurrency: 4,
  isMobile: false,
  hasWebGL: true,
  prefersReducedMotion: false,
  isTouchDevice: false,
  recommendedParticleCount: 500,
};

/**
 * Tests if WebGL context can be created
 */
function checkWebGLSupport(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return gl !== null;
  } catch {
    return false;
  }
}

/**
 * Calculates recommended particle count based on device capabilities
 * - hardware concurrency < 4 → 200 particles
 * - mobile device → 100 particles
 * - no WebGL → 0 particles (don't render)
 * - reduced motion → 0 particles (don't render)
 * - high-end device → 500 particles
 */
function calculateParticleCount(
  hardwareConcurrency: number,
  isMobile: boolean,
  hasWebGL: boolean,
  prefersReducedMotion: boolean
): number {
  // Don't render if no WebGL or reduced motion preference
  if (!hasWebGL || prefersReducedMotion) {
    return 0;
  }
  
  // Mobile devices get minimal particles
  if (isMobile) {
    return 100;
  }
  
  // Low-end devices get reduced particles
  if (hardwareConcurrency < 4) {
    return 200;
  }
  
  // High-end devices get full particles
  return 500;
}

/**
 * Hook to detect device capabilities for adaptive performance
 * 
 * Detects:
 * - navigator.hardwareConcurrency
 * - window.matchMedia('(max-width: 768px)')
 * - WebGL context creation test
 * - prefers-reduced-motion media query
 * - 'ontouchstart' in window
 * 
 * @returns DeviceCapabilities object with detected values
 */
export function useDeviceCapabilities(): DeviceCapabilities {
  const [capabilities, setCapabilities] = useState<DeviceCapabilities>(defaultCapabilities);

  useEffect(() => {
    // Detect hardware concurrency
    const hardwareConcurrency = navigator.hardwareConcurrency || 4;
    
    // Detect mobile viewport
    const mobileQuery = window.matchMedia('(max-width: 768px)');
    const isMobile = mobileQuery.matches;
    
    // Detect WebGL support
    const hasWebGL = checkWebGLSupport();
    
    // Detect reduced motion preference
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const prefersReducedMotion = motionQuery.matches;
    
    // Detect touch device
    const isTouchDevice = 'ontouchstart' in window;
    
    // Calculate recommended particle count
    const recommendedParticleCount = calculateParticleCount(
      hardwareConcurrency,
      isMobile,
      hasWebGL,
      prefersReducedMotion
    );

    setCapabilities({
      hardwareConcurrency,
      isMobile,
      hasWebGL,
      prefersReducedMotion,
      isTouchDevice,
      recommendedParticleCount,
    });

    // Listen for viewport changes
    const handleMobileChange = (e: MediaQueryListEvent) => {
      setCapabilities(prev => ({
        ...prev,
        isMobile: e.matches,
        recommendedParticleCount: calculateParticleCount(
          prev.hardwareConcurrency,
          e.matches,
          prev.hasWebGL,
          prev.prefersReducedMotion
        ),
      }));
    };

    // Listen for motion preference changes
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setCapabilities(prev => ({
        ...prev,
        prefersReducedMotion: e.matches,
        recommendedParticleCount: calculateParticleCount(
          prev.hardwareConcurrency,
          prev.isMobile,
          prev.hasWebGL,
          e.matches
        ),
      }));
    };

    mobileQuery.addEventListener('change', handleMobileChange);
    motionQuery.addEventListener('change', handleMotionChange);

    return () => {
      mobileQuery.removeEventListener('change', handleMobileChange);
      motionQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  return capabilities;
}

export default useDeviceCapabilities;