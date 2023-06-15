export interface Store<TState> {
    load(): void;
    getState(): Promise<TState>;
    setState(state: Partial<TState>): Promise<void>;
}
