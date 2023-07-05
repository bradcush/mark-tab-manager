import { beforeAll } from 'bun:test';

type CompileTimeGlobal = typeof globalThis & { ENABLE_LOGGING: boolean };

beforeAll(() => {
    (global as CompileTimeGlobal).ENABLE_LOGGING = false;
});
