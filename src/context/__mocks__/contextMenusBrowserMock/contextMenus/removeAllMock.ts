import { MkRemoveAllMockCallback } from './MkRemoveAllMock';

export function removeAllMock(callback: MkRemoveAllMockCallback = () => {}) {
    callback();
}
