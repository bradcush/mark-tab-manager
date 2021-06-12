// Adapter using console provided by the browser environment
// for logging all supported types of information locally

/**
 * Log debug information
 */
export function logDebug(...params: unknown[]): void {
    if (!ENABLE_LOGGING) {
        return;
    }
    console.debug(...params);
}

/**
 * Log errors that are considered harmful
 */
export function logError(...params: unknown[]): void {
    if (!ENABLE_LOGGING) {
        return;
    }
    console.error(...params);
}

/**
 * Log notable information
 */
export function logInfo(...params: unknown[]): void {
    if (!ENABLE_LOGGING) {
        return;
    }
    console.info(...params);
}

/**
 * Log generic information
 */
export function logVerbose(...params: unknown[]): void {
    if (!ENABLE_LOGGING) {
        return;
    }
    console.log(...params);
}

/**
 * Log warnings that could be harmful
 */
export function logWarn(...params: unknown[]): void {
    if (!ENABLE_LOGGING) {
        return;
    }
    console.warn(...params);
}
