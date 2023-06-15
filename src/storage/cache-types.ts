export interface CacheItem<TKey, TValue> {
    key: TKey;
    value: TValue;
}

export interface Cache<TKey, TValue> {
    exists(): boolean;
    flush(): void;
    get(key: TKey): TValue;
    remove(key: TKey): void;
    set(items: CacheItem<TKey, TValue>[]): void;
}
