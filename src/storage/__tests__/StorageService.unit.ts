import { StorageService } from '../StorageService';
import {
    makeStorageBrowserMock,
    makeSyncGetMock,
} from '../__mocks__/storageBrowserMock';

describe('StorageService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('when the service is initialized', () => {
        it('should cache storage in memory', async () => {
            const syncGetMock = makeSyncGetMock({
                enableAutomaticSorting: false,
                invalidSetting: true,
            });
            const browserMock = makeStorageBrowserMock(syncGetMock);
            const storageService = new StorageService(browserMock);
            await storageService.init();
            const state = storageService.getState();
            const expectedState = { enableAutomaticSorting: false };
            expect(state).toStrictEqual(expectedState);
        });

        it('should not cache invalid storage in memory', async () => {
            const syncGetMock = makeSyncGetMock({
                enableAutomaticSorting: false,
                invalidSetting: true,
            });
            const browserMock = makeStorageBrowserMock(syncGetMock);
            const storageService = new StorageService(browserMock);
            await storageService.init();
            const state = storageService.getState();
            const expectedState = { enableAutomaticSorting: false };
            expect(state).toStrictEqual(expectedState);
        });

        it('should cache default state in memory without storage', async () => {
            const syncGetMock = makeSyncGetMock({});
            const browserMock = makeStorageBrowserMock(syncGetMock);
            const storageService = new StorageService(browserMock);
            await storageService.init();
            const state = storageService.getState();
            const expectedState = { enableAutomaticSorting: true };
            expect(state).toStrictEqual(expectedState);
        });
    });

    describe('when state is persisted to storage', () => {
        it('should add new keys in storage and state', async () => {
            const browserMock = makeStorageBrowserMock();
            const storageService = new StorageService(browserMock);
            await storageService.init();
            const state = { enableAutomaticSorting: false };
            await storageService.setState(state);
            const newState = storageService.getState();
            expect(newState).toStrictEqual(state);
            const storage = { settings: JSON.stringify(state) };
            const { set } = browserMock.storage.sync;
            expect(set).toBeCalledWith(storage);
        });

        it('should update existing keys in storage and state', async () => {
            const browserMock = makeStorageBrowserMock();
            const storageService = new StorageService(browserMock);
            await storageService.init();

            const firstState = { enableAutomaticSorting: false };
            await storageService.setState(firstState);
            const firstNewState = storageService.getState();
            expect(firstNewState).toStrictEqual(firstState);
            const firstItems = { settings: JSON.stringify(firstState) };
            const { set } = browserMock.storage.sync;
            expect(set).toBeCalledWith(firstItems);

            const secondState = { enableAutomaticSorting: true };
            await storageService.setState(secondState);
            const secondNewState = storageService.getState();
            expect(secondNewState).toStrictEqual(secondState);
            const secondItems = { settings: JSON.stringify(secondState) };
            expect(set).toBeCalledWith(secondItems);
        });
    });

    describe('when current state is asked for', () => {
        it('should return current state in memory', async () => {
            const syncGetMock = makeSyncGetMock();
            const browserMock = makeStorageBrowserMock(syncGetMock);
            const storageService = new StorageService(browserMock);
            await storageService.init();
            const state = storageService.getState();
            const expectedState = { enableAutomaticSorting: true };
            expect(state).toStrictEqual(expectedState);
        });
    });
});
