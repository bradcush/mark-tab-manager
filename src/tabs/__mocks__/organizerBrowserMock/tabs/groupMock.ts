import { MkGroupMockCallback } from './MkGroupMock';

export function groupMock(
    _options: object,
    callback: MkGroupMockCallback = () => {}
) {
    callback(123);
}
