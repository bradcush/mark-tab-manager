import { MkStorageService, MkSsState } from 'src/storage/MkStorageService';

const defaultState = {
    enableAutomaticSorting: true,
};

export function makeContextMenusStorageMock(
    state: Partial<MkSsState> = defaultState
) {
    return ({
        getState: () => state,
        setState: jest.fn(),
    } as any) as MkStorageService;
}
