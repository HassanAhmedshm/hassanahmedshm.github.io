import { useEffect, useRef, useCallback } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Hook to manage ScrollTrigger instance lifecycle
 * 
 * Tracks ScrollTrigger instances created by a component and ensures
 * only those instances are killed on unmount, preventing interference
 * with instances from other components.
 * 
 * @returns registerInstance - Function to register a ScrollTrigger instance for cleanup
 * 
 * @example
 * ```tsx
 * const { registerInstance } = useScrollTriggerCleanup();
 * 
 * useEffect(() => {
 *   const st = ScrollTrigger.create({
 *     trigger: element,
 *     start: 'top bottom',
 *     onEnter: () => { ... }
 *   });
 *   registerInstance(st);
 * }, []);
 * ```
 */
export function useScrollTriggerCleanup() {
  const instancesRef = useRef<ScrollTrigger[]>([]);
  
  /**
   * Register a ScrollTrigger instance for cleanup on unmount
   */
  const registerInstance = useCallback((instance: ScrollTrigger) => {
    // Prevent duplicate registrations
    if (!instancesRef.current.includes(instance)) {
      instancesRef.current.push(instance);
    }
  }, []);
  
  // Cleanup on unmount - only kill registered instances
  useEffect(() => {
    return () => {
      instancesRef.current.forEach(st => st.kill());
      instancesRef.current = [];
    };
  }, []);
  
  return { registerInstance };
}

export default useScrollTriggerCleanup;