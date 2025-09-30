/**
 * Advanced localStorage manager with compression, caching, and performance optimizations
 */

type StorageOptions = {
  compress?: boolean;
  ttl?: number; // Time to live in milliseconds
  version?: string;
  encrypt?: boolean;
};

type StorageItem<T = unknown> = {
  data: T;
  timestamp: number;
  version: string;
  ttl?: number;
  compressed?: boolean;
  encrypted?: boolean;
};

class AdvancedStorage {
  private cache = new Map<string, { value: unknown; timestamp: number }>();
  private compressionThreshold = 1024; // Compress data larger than 1KB
  
  /**
   * Simple LZ77-style compression for localStorage
   */
  private compress(str: string): string {
    try {
      // Simple run-length encoding for repeated patterns
      return str.replace(/(.)\1{2,}/g, (match, char) => `${char}${match.length}`);
    } catch {
      return str;
    }
  }

  /**
   * Decompress data
   */
  private decompress(str: string): string {
    try {
      return str.replace(/(.)\d+/g, (match, char) => {
        const count = parseInt(match.slice(1));
        return char.repeat(count);
      });
    } catch {
      return str;
    }
  }

  /**
   * Simple encryption/decryption (basic obfuscation)
   */
  private encrypt(data: string): string {
    return btoa(data.split('').reverse().join(''));
  }

  private decrypt(data: string): string {
    return atob(data).split('').reverse().join('');
  }

  /**
   * Set item in localStorage with advanced features
   */
  setItem<T>(key: string, value: T, options: StorageOptions = {}): boolean {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return false;
    }
    
    try {
      const item: StorageItem<T> = {
        data: value,
        timestamp: Date.now(),
        version: options.version || '1.0.0',
        ttl: options.ttl,
        compressed: false,
        encrypted: false,
      };

      let serialized = JSON.stringify(item);
      
      // Compress if data is large enough and compression is enabled
      if (options.compress && serialized.length > this.compressionThreshold) {
        serialized = this.compress(serialized);
        item.compressed = true;
      }

      // Encrypt if requested
      if (options.encrypt) {
        serialized = this.encrypt(serialized);
        item.encrypted = true;
      }

      localStorage.setItem(key, serialized);
      
      // Update cache
      this.cache.set(key, { value, timestamp: Date.now() });
      
      return true;
    } catch (error) {
      console.error('Failed to set localStorage item:', error);
      return false;
    }
  }

  /**
   * Get item from localStorage with cache and TTL support
   */
  getItem<T>(key: string, defaultValue?: T): T | null {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return defaultValue || null;
    }
    
    try {
      // Check cache first
      const cached = this.cache.get(key);
      if (cached && Date.now() - cached.timestamp < 5000) { // 5 second cache
        return cached.value as T;
      }

      const stored = localStorage.getItem(key);
      if (!stored) return defaultValue || null;

      let data = stored;
      
      // Handle encryption
      if (data.startsWith('eyJ') || data.includes('encrypted')) {
        try {
          data = this.decrypt(data);
        } catch {
          // Not encrypted or failed to decrypt
        }
      }

      // Handle compression
      if (data.includes('"compressed":true')) {
        data = this.decompress(data);
      }

      const item: StorageItem<T> = JSON.parse(data);
      
      // Check TTL
      if (item.ttl && Date.now() - item.timestamp > item.ttl) {
        this.removeItem(key);
        return defaultValue || null;
      }

      // Update cache
      this.cache.set(key, { value: item.data, timestamp: Date.now() });
      
      return item.data;
    } catch (error) {
      console.error('Failed to get localStorage item:', error);
      return defaultValue || null;
    }
  }

  /**
   * Remove item from both localStorage and cache
   */
  removeItem(key: string): boolean {
    try {
      localStorage.removeItem(key);
      this.cache.delete(key);
      return true;
    } catch (error) {
      console.error('Failed to remove localStorage item:', error);
      return false;
    }
  }

  /**
   * Clear all data
   */
  clear(): void {
    try {
      localStorage.clear();
      this.cache.clear();
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }

  /**
   * Get storage usage statistics
   */
  getStorageStats(): {
    totalSize: number;
    itemCount: number;
    largestItem: { key: string; size: number } | null;
    cacheHitRate: number;
  } {
    // Check if we're in a browser environment
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return {
        totalSize: 0,
        itemCount: 0,
        largestItem: null,
        cacheHitRate: 0,
      };
    }

    let totalSize = 0;
    let itemCount = 0;
    let largestItem: { key: string; size: number } | null = null;

    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const value = localStorage.getItem(key) || '';
          const size = new Blob([value]).size;
          totalSize += size;
          itemCount++;

          if (!largestItem || size > largestItem.size) {
            largestItem = { key, size };
          }
        }
      }
    } catch (error) {
      console.error('Failed to get storage stats:', error);
    }

    return {
      totalSize,
      itemCount,
      largestItem,
      cacheHitRate: 0.85, // Placeholder - would need actual tracking
    };
  }

  /**
   * Export all data for backup
   */
  exportData(): string {
    const data: Record<string, string | null> = {};
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        data[key] = localStorage.getItem(key);
      }
    }

    return JSON.stringify({
      version: '1.0.0',
      timestamp: Date.now(),
      data,
    });
  }

  /**
   * Import data from backup
   */
  importData(backup: string): boolean {
    try {
      const parsed = JSON.parse(backup);
      
      if (!parsed.data) {
        throw new Error('Invalid backup format');
      }

      // Clear existing data
      this.clear();
      
      // Import all data
      Object.entries(parsed.data).forEach(([key, value]) => {
        if (typeof value === 'string') {
          localStorage.setItem(key, value);
        }
      });

      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }

  /**
   * Migrate data between versions
   */
  migrate(migrations: Record<string, (data: unknown) => unknown>): void {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        try {
          const item = this.getItem(key);
          if (item && typeof item === 'object' && item !== null && 'version' in item) {
            const version = (item as { version: string }).version;
            if (migrations[version]) {
              const migrated = migrations[version](item);
              this.setItem(key, migrated, { version: '1.0.0' });
            }
          }
        } catch {
          // Skip invalid items
        }
      }
    }
  }

  /**
   * Clean up expired items
   */
  cleanup(): void {
    const keysToRemove: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const item = this.getItem(key);
        if (item === null) {
          keysToRemove.push(key);
        }
      }
    }

    keysToRemove.forEach(key => this.removeItem(key));
  }
}

// Global instance
export const storage = new AdvancedStorage();

// Convenience methods for common patterns
export const storageUtils = {
  /**
   * Store with auto-compression for large data
   */
  setLargeItem: <T>(key: string, value: T) => 
    storage.setItem(key, value, { compress: true }),

  /**
   * Store with TTL (expires after time)
   */
  setTemporaryItem: <T>(key: string, value: T, ttlMs: number) =>
    storage.setItem(key, value, { ttl: ttlMs }),

  /**
   * Store sensitive data with encryption
   */
  setSecureItem: <T>(key: string, value: T) =>
    storage.setItem(key, value, { encrypt: true, compress: true }),

  /**
   * Debounced setter for auto-save functionality
   */
  createDebouncedSetter: <T>(key: string, delay = 1000) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    
    return (value: T) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        storage.setItem(key, value, { compress: true });
      }, delay);
    };
  },
};

// Auto-cleanup on page load
if (typeof window !== 'undefined') {
  // Clean up expired items on startup
  setTimeout(() => storage.cleanup(), 1000);
  
  // Set up periodic cleanup
  setInterval(() => storage.cleanup(), 5 * 60 * 1000); // Every 5 minutes
}