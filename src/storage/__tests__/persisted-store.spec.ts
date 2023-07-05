import { describe, expect, mock, test } from 'bun:test';
import { PersistedStore } from '../persisted-store';

const defaultItems = {
    clusterGroupedTabs: true,
    enableAutomaticGrouping: true,
    enableAlphabeticSorting: true,
    enableSubdomainFiltering: false,
    forceWindowConsolidation: false,
    showGroupTabCount: true,
    suspendCollapsedGroups: false,
};

/**
 * Create a mocked sync storage get function that
 * resolves with items passed during construction
 */
function makeSyncGet(items: Record<string, unknown> = defaultItems) {
    return () => {
        const settings = JSON.stringify(items);
        return Promise.resolve({ settings });
    };
}

describe('PersistedStore', () => {
    describe('when the service is initialized', () => {
        test('should cache storage in memory', async () => {
            const syncGetMock = makeSyncGet({
                clusterGroupedTabs: false,
                enableAutomaticGrouping: false,
                enableAlphabeticSorting: false,
                enableSubdomainFiltering: true,
                forceWindowConsolidation: true,
                showGroupTabCount: false,
                suspendCollapsedGroups: true,
                invalidSetting: true,
            });
            const storageSyncGetMock = mock(syncGetMock);
            const storageSyncSetMock = mock(async () => {});
            const persistedStore = new PersistedStore(
                storageSyncGetMock,
                storageSyncSetMock
            );
            await persistedStore.load();
            const state = await persistedStore.getState();
            const expectedState = {
                clusterGroupedTabs: false,
                enableAutomaticGrouping: false,
                enableAlphabeticSorting: false,
                enableSubdomainFiltering: true,
                forceWindowConsolidation: true,
                showGroupTabCount: false,
                suspendCollapsedGroups: true,
            };
            expect(state).toStrictEqual(expectedState);
        });

        test('should not cache non-persisted settings in memory', async () => {
            const nonPersistedSettings = { settings: undefined };
            const syncGetMock = () => Promise.resolve(nonPersistedSettings);
            const storageSyncGetMock = mock(syncGetMock);
            const storageSyncSetMock = mock(async () => {});
            const persistedStore = new PersistedStore(
                storageSyncGetMock,
                storageSyncSetMock
            );
            await persistedStore.load();
            const state = await persistedStore.getState();
            const expectedState = {
                clusterGroupedTabs: true,
                enableAutomaticGrouping: true,
                enableAlphabeticSorting: true,
                enableSubdomainFiltering: false,
                forceWindowConsolidation: false,
                showGroupTabCount: true,
                suspendCollapsedGroups: false,
            };
            expect(state).toStrictEqual(expectedState);
        });

        test('should not cache invalid typed settings in memory', async () => {
            const invalidTypedSettings = { settings: true };
            const syncGetMock = () => Promise.resolve(invalidTypedSettings);
            const storageSyncGetMock = mock(syncGetMock);
            const storageSyncSetMock = mock(async () => {});
            const persistedStore = new PersistedStore(
                storageSyncGetMock,
                storageSyncSetMock
            );
            await persistedStore.load();
            const state = await persistedStore.getState();
            const expectedState = {
                clusterGroupedTabs: true,
                enableAutomaticGrouping: true,
                enableAlphabeticSorting: true,
                enableSubdomainFiltering: false,
                forceWindowConsolidation: false,
                showGroupTabCount: true,
                suspendCollapsedGroups: false,
            };
            expect(state).toStrictEqual(expectedState);
        });

        test('should not cache invalid storage keys in memory', async () => {
            const syncGetMock = makeSyncGet({
                clusterGroupedTabs: false,
                enableAutomaticGrouping: false,
                enableAlphabeticSorting: false,
                enableSubdomainFiltering: true,
                forceWindowConsolidation: true,
                showGroupTabCount: false,
                suspendCollapsedGroups: true,
                invalidSetting: true,
            });
            const storageSyncGetMock = mock(syncGetMock);
            const storageSyncSetMock = mock(async () => {});
            storageSyncGetMock.mockImplementation(syncGetMock);
            const persistedStore = new PersistedStore(
                storageSyncGetMock,
                storageSyncSetMock
            );
            await persistedStore.load();
            const state = await persistedStore.getState();
            const expectedState = {
                clusterGroupedTabs: false,
                enableAutomaticGrouping: false,
                enableAlphabeticSorting: false,
                enableSubdomainFiltering: true,
                forceWindowConsolidation: true,
                showGroupTabCount: false,
                suspendCollapsedGroups: true,
            };
            expect(state).toStrictEqual(expectedState);
        });

        test('should cache default state in memory without storage', async () => {
            const syncGetMock = makeSyncGet({});
            const storageSyncGetMock = mock(syncGetMock);
            const storageSyncSetMock = mock(async () => {});
            const persistedStore = new PersistedStore(
                storageSyncGetMock,
                storageSyncSetMock
            );
            await persistedStore.load();
            const state = await persistedStore.getState();
            const expectedState = {
                clusterGroupedTabs: true,
                enableAutomaticGrouping: true,
                enableAlphabeticSorting: true,
                enableSubdomainFiltering: false,
                forceWindowConsolidation: false,
                showGroupTabCount: true,
                suspendCollapsedGroups: false,
            };
            expect(state).toStrictEqual(expectedState);
        });

        test('should migrate legacy keys to their new name', async () => {
            const syncGetMock = makeSyncGet({
                clusterGroupedTabs: true,
                enableAutomaticGrouping: true,
                enableAutomaticSorting: false,
                enableSubdomainFiltering: false,
                forceWindowConsolidation: false,
                showGroupTabCount: true,
                suspendCollapsedGroups: false,
            });
            const storageSyncGetMock = mock(syncGetMock);
            const storageSyncSetMock = mock(async () => {});
            const persistedStore = new PersistedStore(
                storageSyncGetMock,
                storageSyncSetMock
            );
            await persistedStore.load();
            const state = await persistedStore.getState();
            const expectedState = {
                clusterGroupedTabs: true,
                enableAutomaticGrouping: true,
                enableAlphabeticSorting: false,
                enableSubdomainFiltering: false,
                forceWindowConsolidation: false,
                showGroupTabCount: true,
                suspendCollapsedGroups: false,
            };
            expect(state).toStrictEqual(expectedState);
        });
    });

    describe('when state is persisted to storage', () => {
        test('should add new keys in storage and state', async () => {
            const syncGetMock = makeSyncGet();
            const storageSyncGetMock = mock(syncGetMock);
            const storageSyncSetMock = mock(async () => {});
            const persistedStore = new PersistedStore(
                storageSyncGetMock,
                storageSyncSetMock
            );
            await persistedStore.load();
            const state = {
                clusterGroupedTabs: false,
                enableAutomaticGrouping: false,
                enableAlphabeticSorting: false,
                enableSubdomainFiltering: true,
                forceWindowConsolidation: true,
                showGroupTabCount: false,
                suspendCollapsedGroups: true,
            };
            await persistedStore.setState(state);
            const newState = await persistedStore.getState();
            expect(newState).toStrictEqual(state);
            const storage = { settings: JSON.stringify(newState) };
            const [result] = storageSyncSetMock.mock.calls;
            expect(result).toEqual([storage]);
        });

        test('should update existing keys in storage and state', async () => {
            const syncGetMock = makeSyncGet();
            const storageSyncGetMock = mock(syncGetMock);
            const storageSyncSetMock = mock(async () => {});
            const persistedStore = new PersistedStore(
                storageSyncGetMock,
                storageSyncSetMock
            );
            await persistedStore.load();

            const firstState = {
                clusterGroupedTabs: false,
                enableAutomaticGrouping: false,
                enableAlphabeticSorting: false,
                enableSubdomainFiltering: true,
                forceWindowConsolidation: true,
                showGroupTabCount: false,
                suspendCollapsedGroups: true,
            };
            await persistedStore.setState(firstState);
            const firstNewState = await persistedStore.getState();
            expect(firstNewState).toStrictEqual(firstState);
            const firstItems = { settings: JSON.stringify(firstState) };
            const [firstResult] = storageSyncSetMock.mock.calls;
            expect(firstResult).toEqual([firstItems]);

            const secondState = {
                clusterGroupedTabs: true,
                enableAutomaticGrouping: true,
                enableAlphabeticSorting: true,
                enableSubdomainFiltering: false,
                forceWindowConsolidation: false,
                showGroupTabCount: true,
                suspendCollapsedGroups: false,
            };
            await persistedStore.setState(secondState);
            const secondNewState = await persistedStore.getState();
            expect(secondNewState).toStrictEqual(secondState);
            const secondItems = { settings: JSON.stringify(secondState) };
            const [, secondResult] = storageSyncSetMock.mock.calls;
            expect(secondResult).toEqual([secondItems]);
        });
    });

    describe('when current state is asked for', () => {
        test('should return current state in memory', async () => {
            const syncGetMock = makeSyncGet();
            const storageSyncGetMock = mock(syncGetMock);
            const storageSyncSetMock = mock(async () => {});
            const persistedStore = new PersistedStore(
                storageSyncGetMock,
                storageSyncSetMock
            );
            await persistedStore.load();
            const state = await persistedStore.getState();
            const expectedState = {
                clusterGroupedTabs: true,
                enableAutomaticGrouping: true,
                enableAlphabeticSorting: true,
                enableSubdomainFiltering: false,
                forceWindowConsolidation: false,
                showGroupTabCount: true,
                suspendCollapsedGroups: false,
            };
            expect(state).toStrictEqual(expectedState);
        });
    });
});
