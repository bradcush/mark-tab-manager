/**
 * Generic port for any cache
 */
export interface MkCache {
    exists(): boolean;
    get(key: MkCacheKey): MkCacheValue;
    remove(key: MkCacheKey): void;
    set(items: MkCacheItem[]): void;
}

export interface MkCacheItem {
    key: number | undefined;
    value: string | undefined;
}

export type MkCacheKey = number;

export type MkCacheValue = string | undefined;
