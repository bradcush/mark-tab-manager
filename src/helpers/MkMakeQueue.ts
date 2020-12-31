export type MkQueuedFuncCallback = () => void;
export type MkQueuedFunc = (cb: MkQueuedFuncCallback) => void;
export type MkAddToQueue = (func: MkQueuedFunc) => void;
export type MkQueue = MkQueuedFunc[];
