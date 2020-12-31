import { MkQueue, MkQueuedFunc } from './MkMakeQueue';

/**
 * Queues async tasks to be processed sequentially
 * based on when they were added
 */
export function makeQueue() {
    console.log('makeQueue');
    const queue: MkQueue = [];
    let isProcessing = false;
    const callback = () => {
        console.log('makeQueue', queue.length);
        const queuedFunc = queue.shift();
        // When there isn't anything in the queue
        if (!queuedFunc) {
            isProcessing = false;
            return;
        }
        queuedFunc(callback);
    };
    // Adds functions to the queue
    return (func: MkQueuedFunc) => {
        console.log('makeQueue', isProcessing);
        if (isProcessing) {
            queue.push(func);
            return;
        }
        isProcessing = true;
        func(callback);
    };
}
