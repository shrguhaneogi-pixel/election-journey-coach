'use client';

/**
 * Basic performance logging for the application.
 */
export function logLoadTime() {
  if (typeof window !== "undefined") {
    // Standard web-vitals could be captured here. 
    // For now, we'll log basic performance marks.
    const loadTime = performance.now();
    console.debug(`[Performance] Component Load Time: ${loadTime.toFixed(2)}ms`);
  }
}
