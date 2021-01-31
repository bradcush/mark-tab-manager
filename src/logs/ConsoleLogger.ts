import { MkLogger } from './MkLogger';

/**
 * Adapter using "console" provided by the browser environment
 * for logging all supported types of information locally
 */
export class ConsoleLogger implements MkLogger {
    public constructor(namespace?: string) {
        if (namespace) {
            this.namespace = namespace;
        }

        // We depend on the globally defined
        // console for this adapter
        if (!console) {
            throw new Error('No console');
        }
        this.log('ConsoleLogger.constructor');
    }

    private readonly namespace: string | null = null;

    /**
     * Create namespaced identifier
     */
    private treatPotentialIdentifier(identifier: unknown) {
        return !!this.namespace && typeof identifier === 'string'
            ? `${this.namespace}.${identifier}`
            : identifier;
    }

    /**
     * Log notable information
     */
    public info(param: unknown, ...rest: unknown[]): void {
        const treatedIdentifier = this.treatPotentialIdentifier(param);
        const params = [treatedIdentifier, ...rest];
        console.info(...params);
    }

    /**
     * Log errors that are considered harmful
     */
    public error(param: unknown, ...rest: unknown[]): void {
        const treatedIdentifier = this.treatPotentialIdentifier(param);
        const params = [treatedIdentifier, ...rest];
        console.error(...params);
    }

    /**
     * Log generic information
     */
    public log(param: unknown, ...rest: unknown[]): void {
        const treatedIdentifier = this.treatPotentialIdentifier(param);
        const params = [treatedIdentifier, ...rest];
        console.log(...params);
    }

    /**
     * Log warnings that could be harmful
     */
    public warn(param: unknown, ...rest: unknown[]): void {
        const treatedIdentifier = this.treatPotentialIdentifier(param);
        const params = [treatedIdentifier, ...rest];
        console.warn(...params);
    }
}
