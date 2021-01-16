import { MkStorageService, MkSsState } from 'src/storage/MkStorageService';

const defaultState = {
    enableAutomaticSorting: true,
};

export function makeOrganizerStorageMock(
    state: Partial<MkSsState> = defaultState
) {
    return ({
        getState: () => state,
    } as any) as MkStorageService;
}
