import { MkQueuedFunc } from '../MkMakeQueue';

/**
 * Call the queued function immediately
 */
export function makeQueueMock() {
    return (func: MkQueuedFunc) => {
        const callback = () => {};
        func(callback);
    };
}
