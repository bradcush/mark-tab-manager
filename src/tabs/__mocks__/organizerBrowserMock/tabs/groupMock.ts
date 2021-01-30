import { MkGroupMockCallback } from './MkGroupMock';

export function groupMock(
    _options: Record<string, any>,
    callback: MkGroupMockCallback = () => {}
) {
    callback(123);
}
