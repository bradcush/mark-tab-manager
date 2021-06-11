import { Store } from '../Store';
import { makeSyncGet } from '../mocks/storeBrowser';
import { ConsoleLogger } from 'src/logs/ConsoleLogger';
import { MkSyncItems } from 'src/api/browser/storage/sync/MkSync';
import { browser } from 'src/api/browser';

// Mock wrapped browser API implementation
jest.mock('src/api/browser', () => ({
    browser: {
        storage: {
            sync: {
                get: jest.fn(),
                set: jest.fn(),
            },
        },
    },
}));

describe('Store', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('when the service is initialized', () => {
        it('should cache storage in memory', async () => {
            const syncGetMock = makeSyncGet({
                clusterGroupedTabs: false,
                enableAutomaticGrouping: false,
                enableAlphabeticSorting: false,
                enableSubdomainFiltering: true,
                forceWindowConsolidation: true,
                showGroupTabCount: false,
                invalidSetting: true,
            });
            const { get } = browser.storage.sync;
            (get as jest.Mock).mockImplementation(syncGetMock);
            const storageService = new Store(ConsoleLogger);
            await storageService.load();
            const state = await storageService.getState();
            const expectedState = {
                clusterGroupedTabs: false,
                enableAutomaticGrouping: false,
                enableAlphabeticSorting: false,
                enableSubdomainFiltering: true,
                forceWindowConsolidation: true,
                showGroupTabCount: false,
            };
            expect(state).toStrictEqual(expectedState);
        });

        it('should not cache non-persisted settings in memory', async () => {
            const nonPersistedSettings = { settings: undefined };
            const syncGetMock = () => Promise.resolve(nonPersistedSettings);
            const { get } = browser.storage.sync;
            (get as jest.Mock).mockImplementation(syncGetMock);
            const storageService = new Store(ConsoleLogger);
            await storageService.load();
            const state = await storageService.getState();
            const expectedState = {
                clusterGroupedTabs: true,
                enableAutomaticGrouping: true,
                enableAlphabeticSorting: true,
                enableSubdomainFiltering: false,
                forceWindowConsolidation: false,
                showGroupTabCount: true,
            };
            expect(state).toStrictEqual(expectedState);
        });

        it('should not cache invalid typed settings in memory', async () => {
            const invalidTypedSettings = { settings: true };
            const syncGetMock = () => Promise.resolve(invalidTypedSettings);
            const { get } = browser.storage.sync;
            (get as jest.Mock).mockImplementation(syncGetMock);
            const storageService = new Store(ConsoleLogger);
            await storageService.load();
            const state = await storageService.getState();
            const expectedState = {
                clusterGroupedTabs: true,
                enableAutomaticGrouping: true,
                enableAlphabeticSorting: true,
                enableSubdomainFiltering: false,
                forceWindowConsolidation: false,
                showGroupTabCount: true,
            };
            expect(state).toStrictEqual(expectedState);
        });

        it('should not cache invalid content in memory', async () => {
            const invalidContent = ('invalidContent' as unknown) as MkSyncItems;
            const syncGetMock = makeSyncGet(invalidContent);
            const { get } = browser.storage.sync;
            (get as jest.Mock).mockImplementation(syncGetMock);
            const storageService = new Store(ConsoleLogger);
            await storageService.load();
            const state = await storageService.getState();
            const expectedState = {
                clusterGroupedTabs: true,
                enableAutomaticGrouping: true,
                enableAlphabeticSorting: true,
                enableSubdomainFiltering: false,
                forceWindowConsolidation: false,
                showGroupTabCount: true,
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
                showGroupTabCount: false,
                invalidSetting: true,
            });
            const { get } = browser.storage.sync;
            (get as jest.Mock).mockImplementation(syncGetMock);
            const storageService = new Store(ConsoleLogger);
            await storageService.load();
            const state = await storageService.getState();
            const expectedState = {
                clusterGroupedTabs: false,
                enableAutomaticGrouping: false,
                enableAlphabeticSorting: false,
                enableSubdomainFiltering: true,
                forceWindowConsolidation: true,
                showGroupTabCount: false,
            };
            expect(state).toStrictEqual(expectedState);
        });

        it('should cache default state in memory without storage', async () => {
            const syncGetMock = makeSyncGet({});
            const { get } = browser.storage.sync;
            (get as jest.Mock).mockImplementation(syncGetMock);
            const storageService = new Store(ConsoleLogger);
            await storageService.load();
            const state = await storageService.getState();
            const expectedState = {
                clusterGroupedTabs: true,
                enableAutomaticGrouping: true,
                enableAlphabeticSorting: true,
                enableSubdomainFiltering: false,
                forceWindowConsolidation: false,
                showGroupTabCount: true,
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
                showGroupTabCount: true,
            });
            const { get } = browser.storage.sync;
            (get as jest.Mock).mockImplementation(syncGetMock);
            const storageService = new Store(ConsoleLogger);
            await storageService.load();
            const state = await storageService.getState();
            const expectedState = {
                clusterGroupedTabs: true,
                enableAutomaticGrouping: true,
                enableAlphabeticSorting: false,
                enableSubdomainFiltering: false,
                forceWindowConsolidation: false,
                showGroupTabCount: true,
            };
            expect(state).toStrictEqual(expectedState);
        });
    });

    describe('when state is persisted to storage', () => {
        beforeEach(() => {
            const syncGetMock = makeSyncGet();
            const { get } = browser.storage.sync;
            (get as jest.Mock).mockImplementation(syncGetMock);
        });

        it('should add new keys in storage and state', async () => {
            const storageService = new Store(ConsoleLogger);
            await storageService.load();
            const state = {
                clusterGroupedTabs: false,
                enableAutomaticGrouping: false,
                enableAlphabeticSorting: false,
                enableSubdomainFiltering: true,
                forceWindowConsolidation: true,
                showGroupTabCount: false,
            };
            await storageService.setState(state);
            const newState = await storageService.getState();
            expect(newState).toStrictEqual(state);
            const storage = { settings: JSON.stringify(state) };
            expect(browser.storage.sync.set).toBeCalledWith(storage);
        });

        it('should update existing keys in storage and state', async () => {
            const storageService = new Store(ConsoleLogger);
            await storageService.load();

            const firstState = {
                clusterGroupedTabs: false,
                enableAutomaticGrouping: false,
                enableAlphabeticSorting: false,
                enableSubdomainFiltering: true,
                forceWindowConsolidation: true,
                showGroupTabCount: false,
            };
            await storageService.setState(firstState);
            const firstNewState = await storageService.getState();
            expect(firstNewState).toStrictEqual(firstState);
            const firstItems = { settings: JSON.stringify(firstState) };
            const { set } = browser.storage.sync;
            expect(set).toBeCalledWith(firstItems);

            const secondState = {
                clusterGroupedTabs: true,
                enableAutomaticGrouping: true,
                enableAlphabeticSorting: true,
                enableSubdomainFiltering: false,
                forceWindowConsolidation: false,
                showGroupTabCount: true,
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
            const { get } = browser.storage.sync;
            (get as jest.Mock).mockImplementation(syncGetMock);
            const storageService = new Store(ConsoleLogger);
            await storageService.load();
            const state = await storageService.getState();
            const expectedState = {
                clusterGroupedTabs: true,
                enableAutomaticGrouping: true,
                enableAlphabeticSorting: true,
                enableSubdomainFiltering: false,
                forceWindowConsolidation: false,
                showGroupTabCount: true,
            };
            expect(state).toStrictEqual(expectedState);
        });
    });
});
