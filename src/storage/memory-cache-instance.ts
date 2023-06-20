import { Cache } from './cache-types';
import { CacheKey, CacheValue } from './memory-cache-types';

// Prepared to hold the cache instance
let cache: Cache<CacheKey, CacheValue> | null = null;

/**
 * Retrieve the cache instance
 */
export function getMemoryCache(): Cache<CacheKey, CacheValue> {
    if (!cache) {
        throw new Error('No memory cache instance');
    }
    return cache;
}

/**
 * Set the single cache instance
 */
export function setMemoryCache(instance: Cache<CacheKey, CacheValue>): void {
    cache = instance;
}
