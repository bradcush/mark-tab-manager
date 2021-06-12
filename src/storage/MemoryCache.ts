import { MkCache, MkCacheItem, MkCacheKey, MkCacheValue } from './MkCache';
import { logVerbose } from 'src/logs/console';

/**
 * Adapter for caching items in memory
 */
export class MemoryCache implements MkCache {
    public constructor() {
        logVerbose('constructor');
    }

    // Used for the actual caching in memory
    private keyValueStore = new Map<MkCacheKey, MkCacheValue>();

    /**
     * Check if there are items cached already
     */
    public exists(): boolean {
        const isCacheFilled = this.keyValueStore.size > 0;
        logVerbose('exists', isCacheFilled);
        return isCacheFilled;
    }

    /**
     * Clear the entire cache
     */
    public flush(): void {
        logVerbose('flush');
        this.keyValueStore.clear();
    }

    /**
     * Retrieve a specific item
     */
    public get(key: MkCacheKey): MkCacheValue {
        logVerbose('get', key);
        return this.keyValueStore.get(key);
    }

    /**
     * Remove a particular item
     */
    public remove(key: MkCacheKey): void {
        logVerbose('remove', key);
        this.keyValueStore.delete(key);
        logVerbose('remove', this.keyValueStore);
    }

    /**
     * Cache a set of items for an item
     * addition or fresh cache creation
     */
    public set(items: MkCacheItem[]): void {
        logVerbose('set', items);
        // We don't need to update if nothing has changed
        // TODO: There is an issue when the cache only
        // contains one item and we want to add one item
        if (items.length === this.keyValueStore.size) {
            logVerbose('set', false);
            return;
        }
        items.forEach((item) => {
            const { key, value } = item;
            if (!key) {
                throw new Error('No key for tab cache');
            }
            if (!value) {
                throw new Error('No value for tab cache');
            }
            this.keyValueStore.set(key, value);
        });
        logVerbose('set', this.keyValueStore);
    }
}
