import { Store } from '../Store';
import { makeStoreBrowser, makeSyncGet } from '../__mocks__/storeBrowser';
import { ConsoleLogger } from 'src/logs/ConsoleLogger';
import { MkSyncGetItems } from 'src/api/browser/storage/sync/MkSync';

describe('Store', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('when the service is initialized', () => {
        it('should cache storage in memory', async () => {
            const syncGetMock = makeSyncGet({
                clusterGroupedTabs: false,
                enableAutomaticGrouping: false,
                enableAlphabeticSorting: false,
                enableSubdomainFiltering: true,
                forceWindowConsolidation: true,
                invalidSetting: true,
            });
            const browserMock = makeStoreBrowser(syncGetMock);
            const storageService = new Store({
                browser: browserMock,
                Logger: ConsoleLogger,
            });
            await storageService.load();
            const state = await storageService.getState();
            const expectedState = {
                clusterGroupedTabs: false,
                enableAutomaticGrouping: false,
                enableAlphabeticSorting: false,
                enableSubdomainFiltering: true,
                forceWindowConsolidation: true,
            };
            expect(state).toStrictEqual(expectedState);
        });

        it('should not cache non-persisted settings in memory', async () => {
            const nonPersistedSettings = { settings: undefined };
            const syncGetMock = () => Promise.resolve(nonPersistedSettings);
            const browserMock = makeStoreBrowser(syncGetMock);
            const storageService = new Store({
                browser: browserMock,
                Logger: ConsoleLogger,
            });
            await storageService.load();
            const state = await storageService.getState();
            const expectedState = {
                clusterGroupedTabs: true,
                enableAutomaticGrouping: true,
                enableAlphabeticSorting: true,
                enableSubdomainFiltering: false,
                forceWindowConsolidation: false,
            };
            expect(state).toStrictEqual(expectedState);
        });

        it('should not cache invalid typed settings in memory', async () => {
            const invalidTypedSettings = { settings: true };
            const syncGetMock = () => Promise.resolve(invalidTypedSettings);
            const browserMock = makeStoreBrowser(syncGetMock);
            const storageService = new Store({
                browser: browserMock,
                Logger: ConsoleLogger,
            });
            await storageService.load();
            const state = await storageService.getState();
            const expectedState = {
                clusterGroupedTabs: true,
                enableAutomaticGrouping: true,
                enableAlphabeticSorting: true,
                enableSubdomainFiltering: false,
                forceWindowConsolidation: false,
            };
            expect(state).toStrictEqual(expectedState);
        });

        it('should not cache invalid content in memory', async () => {
            const invalidContent = ('invalidContent' as unknown) as MkSyncGetItems;
            const syncGetMock = makeSyncGet(invalidContent);
            const browserMock = makeStoreBrowser(syncGetMock);
            const storageService = new Store({
                browser: browserMock,
                Logger: ConsoleLogger,
            });
            await storageService.load();
            const state = await storageService.getState();
            const expectedState = {
                clusterGroupedTabs: true,
                enableAutomaticGrouping: true,
                enableAlphabeticSorting: true,
                enableSubdomainFiltering: false,
                forceWindowConsolidation: false,
            };
            expect(state).toStrictEqual(expectedState);
        });

        it('should not cache invalid storage keys in memory', async () => {
            const syncGetMock = makeSyncGet({
                clusterGroupedTabs: false,
                enableAutomaticGrouping: false,
                enableAlphabeticSorting: false,
                enableSubdomainFiltering: true,
                forceWindowConsolidation: true,
                invalidSetting: true,
            });
            const browserMock = makeStoreBrowser(syncGetMock);
            const storageService = new Store({
                browser: browserMock,
                Logger: ConsoleLogger,
            });
            await storageService.load();
            const state = await storageService.getState();
            const expectedState = {
                clusterGroupedTabs: false,
                enableAutomaticGrouping: false,
                enableAlphabeticSorting: false,
                enableSubdomainFiltering: true,
                forceWindowConsolidation: true,
            };
            expect(state).toStrictEqual(expectedState);
        });

        it('should cache default state in memory without storage', async () => {
            const syncGetMock = makeSyncGet({});
            const browserMock = makeStoreBrowser(syncGetMock);
            const storageService = new Store({
                browser: browserMock,
                Logger: ConsoleLogger,
            });
            await storageService.load();
            const state = await storageService.getState();
            const expectedState = {
                clusterGroupedTabs: true,
                enableAutomaticGrouping: true,
                enableAlphabeticSorting: true,
                enableSubdomainFiltering: false,
                forceWindowConsolidation: false,
            };
            expect(state).toStrictEqual(expectedState);
        });

        it('should migrate legacy keys to their new name', async () => {
            const syncGetMock = makeSyncGet({
                clusterGroupedTabs: true,
                enableAutomaticGrouping: true,
                enableAutomaticSorting: false,
                enableSubdomainFiltering: false,
                forceWindowConsolidation: false,
            });
            const browserMock = makeStoreBrowser(syncGetMock);
            const storageService = new Store({
                browser: browserMock,
                Logger: ConsoleLogger,
            });
            await storageService.load();
            const state = await storageService.getState();
            const expectedState = {
                clusterGroupedTabs: true,
                enableAutomaticGrouping: true,
                enableAlphabeticSorting: false,
                enableSubdomainFiltering: false,
                forceWindowConsolidation: false,
            };
            expect(state).toStrictEqual(expectedState);
        });
    });

    describe('when state is persisted to storage', () => {
        it('should add new keys in storage and state', async () => {
            const browserMock = makeStoreBrowser();
            const storageService = new Store({
                browser: browserMock,
                Logger: ConsoleLogger,
            });
            await storageService.load();
            const state = {
                clusterGroupedTabs: false,
                enableAutomaticGrouping: false,
                enableAlphabeticSorting: false,
                enableSubdomainFiltering: true,
                forceWindowConsolidation: true,
            };
            await storageService.setState(state);
            const newState = await storageService.getState();
            expect(newState).toStrictEqual(state);
            const storage = { settings: JSON.stringify(state) };
            expect(browserMock.storage.sync.set).toBeCalledWith(storage);
        });

        it('should update existing keys in storage and state', async () => {
            const browserMock = makeStoreBrowser();
            const storageService = new Store({
                browser: browserMock,
                Logger: ConsoleLogger,
            });
            await storageService.load();

            const firstState = {
                clusterGroupedTabs: false,
                enableAutomaticGrouping: false,
                enableAlphabeticSorting: false,
                enableSubdomainFiltering: true,
                forceWindowConsolidation: true,
            };
            await storageService.setState(firstState);
            const firstNewState = await storageService.getState();
            expect(firstNewState).toStrictEqual(firstState);
            const firstItems = { settings: JSON.stringify(firstState) };
            const { set } = browserMock.storage.sync;
            expect(set).toBeCalledWith(firstItems);

            const secondState = {
                clusterGroupedTabs: true,
                enableAutomaticGrouping: true,
                enableAlphabeticSorting: true,
                enableSubdomainFiltering: false,
                forceWindowConsolidation: false,
            };
            await storageService.setState(secondState);
            const secondNewState = await storageService.getState();
            expect(secondNewState).toStrictEqual(secondState);
            const secondItems = { settings: JSON.stringify(secondState) };
            expect(set).toBeCalledWith(secondItems);
        });
    });

    describe('when current state is asked for', () => {
        it('should return current state in memory', async () => {
            const syncGetMock = makeSyncGet();
            const browserMock = makeStoreBrowser(syncGetMock);
            const storageService = new Store({
                browser: browserMock,
                Logger: ConsoleLogger,
            });
            await storageService.load();
            const state = await storageService.getState();
            const expectedState = {
                clusterGroupedTabs: true,
                enableAutomaticGrouping: true,
                enableAlphabeticSorting: true,
                enableSubdomainFiltering: false,
                forceWindowConsolidation: false,
            };
            expect(state).toStrictEqual(expectedState);
        });
    });
});
