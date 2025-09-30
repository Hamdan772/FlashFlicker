'use client';

import { useState, useEffect, useRef } from 'react';

type PerformanceMetrics = {
  loadTime: number;
  renderCount: number;
  memoryUsage?: number;
  storageSize: number;
  lastUpdate: number;
};

export function usePerformanceMonitor(componentName: string) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    renderCount: 0,
    storageSize: 0,
    lastUpdate: Date.now(),
  });
  
  const startTime = useRef<number>(performance.now());
  const renderCount = useRef<number>(0);

  useEffect(() => {
    renderCount.current += 1;
    
    const updateMetrics = () => {
      const loadTime = performance.now() - startTime.current;
      
      // Calculate storage size
      let storageSize = 0;
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key) {
            const value = localStorage.getItem(key) || '';
            storageSize += new Blob([key + value]).size;
          }
        }
      } catch (error) {
        console.warn('Could not calculate storage size:', error);
      }

      // Get memory usage if available
      let memoryUsage;
      if ('memory' in performance) {
        const memory = (performance as { memory?: { usedJSHeapSize: number } }).memory;
        memoryUsage = memory?.usedJSHeapSize;
      }

      setMetrics({
        loadTime,
        renderCount: renderCount.current,
        memoryUsage,
        storageSize,
        lastUpdate: Date.now(),
      });
    };

    updateMetrics();
    
    // Update metrics periodically
    const interval = setInterval(updateMetrics, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Log performance data for debugging
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${componentName}:`, {
        loadTime: `${metrics.loadTime.toFixed(2)}ms`,
        renderCount: metrics.renderCount,
        storageSize: `${(metrics.storageSize / 1024).toFixed(2)}KB`,
        memoryUsage: metrics.memoryUsage ? `${(metrics.memoryUsage / 1024 / 1024).toFixed(2)}MB` : 'N/A',
      });
    }
  }, [componentName, metrics]);

  return metrics;
}

// Performance optimization utilities
export const performanceUtils = {
  /**
   * Debounce function to limit how often a function can be called
   */
  debounce: <T extends (...args: unknown[]) => unknown>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: ReturnType<typeof setTimeout>;
    
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  },

  /**
   * Throttle function to limit how often a function can be called
   */
  throttle: <T extends (...args: unknown[]) => unknown>(
    func: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean;
    
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  /**
   * Measure the execution time of a function
   */
  measureTime: async function<T>(
    name: string,
    func: () => Promise<T> | T
  ): Promise<T> {
    const start = performance.now();
    const result = await func();
    const end = performance.now();
    
    console.log(`[Performance] ${name}: ${(end - start).toFixed(2)}ms`);
    return result;
  },

  /**
   * Check if the browser supports certain performance APIs
   */
  getCapabilities: () => {
    if (typeof window === 'undefined') return {};
    
    return {
      performanceObserver: 'PerformanceObserver' in window,
      intersectionObserver: 'IntersectionObserver' in window,
      memoryAPI: 'memory' in performance,
      navigationTiming: 'navigation' in performance,
    };
  },

  /**
   * Get current page performance metrics
   */
  getPageMetrics: () => {
    if (typeof window === 'undefined') return null;
    
    try {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0,
      };
    } catch (error) {
      console.warn('Could not get page metrics:', error);
      return null;
    }
  },
};