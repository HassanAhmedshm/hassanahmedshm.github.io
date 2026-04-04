/**
 * Schedules a callback to run during browser idle periods.
 * Falls back to setTimeout if requestIdleCallback is unavailable.
 * 
 * @param callback - The function to execute when idle
 * @param timeout - Maximum time to wait before executing (default: 100ms)
 * 
 * @example
 * // Defer non-critical animation
 * scheduleDeferredAnimation(() => {
 *   initializeParticles();
 * });
 * 
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback
 * 
 * Validates: Requirements 11.1, 11.2
 */
export const scheduleDeferredAnimation = (
  callback: () => void,
  timeout: number = 100
): void => {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(callback, { timeout });
  } else {
    setTimeout(callback, timeout);
  }
};