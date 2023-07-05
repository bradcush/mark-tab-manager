export type StorageSyncGet = (
    keys: string | Record<string, unknown>
) => Promise<Record<string, unknown>>;
