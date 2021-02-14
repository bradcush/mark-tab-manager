import { Store } from '../Store';
import { makeStoreBrowser, makeSyncGet } from '../__mocks__/storeBrowser';
import { ConsoleLogger } from 'src/logs/ConsoleLogger';

describe('Store', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('when the service is initialized', () => {
        it('should cache storage in memory', async () => {
            const syncGetMock = makeSyncGet({
                enableAutomaticGrouping: false,
                enableAutomaticSorting: false,
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
                enableAutomaticGrouping: false,
                enableAutomaticSorting: false,
            };
            expect(state).toStrictEqual(expectedState);
        });

        it('should not cache invalid storage in memory', async () => {
            const syncGetMock = makeSyncGet({
                enableAutomaticGrouping: false,
                enableAutomaticSorting: false,
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
                enableAutomaticGrouping: false,
                enableAutomaticSorting: false,
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
                enableAutomaticGrouping: true,
                enableAutomaticSorting: true,
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
                enableAutomaticGrouping: false,
                enableAutomaticSorting: false,
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
                enableAutomaticGrouping: false,
                enableAutomaticSorting: false,
            };
            await storageService.setState(firstState);
            const firstNewState = await storageService.getState();
            expect(firstNewState).toStrictEqual(firstState);
            const firstItems = { settings: JSON.stringify(firstState) };
            const { set } = browserMock.storage.sync;
            expect(set).toBeCalledWith(firstItems);

            const secondState = {
                enableAutomaticGrouping: true,
                enableAutomaticSorting: true,
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
                enableAutomaticGrouping: true,
                enableAutomaticSorting: true,
            };
            expect(state).toStrictEqual(expectedState);
        });
    });
});
