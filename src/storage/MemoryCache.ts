import { MkLogger, MkLoggerConstructor } from 'src/logs/MkLogger';
import { MkCache, MkCacheItem, MkCacheKey, MkCacheValue } from './MkCache';

/**
 * Adapter for caching items in memory
 */
export class MemoryCache implements MkCache {
    public constructor(Logger: MkLoggerConstructor) {
        if (!Logger) {
            throw new Error('No Logger');
        }
        this.logger = new Logger('Cache');
        this.logger.log('constructor');
    }

    private readonly logger: MkLogger;

    // Used for the actual caching in memory
    private keyValueStore = new Map<MkCacheKey, MkCacheValue>();

    /**
     * Check if there are items cached already
     */
    public exists(): boolean {
        const isCacheFilled = this.keyValueStore.size > 0;
        this.logger.log('exists', isCacheFilled);
        return isCacheFilled;
    }

    /**
     * Clear the entire cache
     */
    public flush(): void {
        this.logger.log('flush');
        this.keyValueStore.clear();
    }

    /**
     * Retrieve a specific item
     */
    public get(key: MkCacheKey): MkCacheValue {
        this.logger.log('get', key);
        return this.keyValueStore.get(key);
    }

    /**
     * Remove a particular item
     */
    public remove(key: MkCacheKey): void {
        this.logger.log('remove', key);
        this.keyValueStore.delete(key);
        this.logger.log('remove', this.keyValueStore);
    }

    /**
     * Cache a set of items for an item
     * addition or fresh cache creation
     */
    public set(items: MkCacheItem[]): void {
        this.logger.log('set', items);
        // We don't need to update if nothing has changed
        // TODO: There is an issue when the cache only
        // contains one item and we want to add one item
        if (items.length === this.keyValueStore.size) {
            this.logger.log('set', false);
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
        this.logger.log('set', this.keyValueStore);
    }
}
