/**
 * Generic port for any logger
 */
export interface MkLogger {
    error(...data: unknown[]): void;
    info(...data: unknown[]): void;
    log(...data: unknown[]): void;
    warn(...data: unknown[]): void;
}

export interface MkLoggerConstructor {
    new (namespace: string): MkLogger;
}
