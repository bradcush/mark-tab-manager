import * as childProcess from 'child_process';
import { MkManifest } from '../MkGenerate';
import { generate } from '../generate';

const processStdoutWriteMock = jest.fn();

// Helper function used to assert stringified stdout using
// the same params as specified during generation
const stringifyToMatchStdout = (manifest: MkManifest) =>
    JSON.stringify(manifest, null, 2);

describe('generate', () => {
    // Referencing unbound method for original reassignment
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const originalProcessStdoutWrite = process.stdout.write;

    beforeEach(() => {
        process.stdout.write = processStdoutWriteMock;
    });
    afterEach(() => {
        process.stdout.write = originalProcessStdoutWrite;
        jest.resetAllMocks();
    });

    describe('when manifest generation is run from function call', () => {
        it('should write manifest for chromium', () => {
            generate({ browser: 'chromium' });
            expect(processStdoutWriteMock).toHaveBeenCalledTimes(1);
            expect(processStdoutWriteMock).toHaveBeenCalledWith(
                stringifyToMatchStdout({
                    action: {
                        default_title: 'Mark',
                    },
                    background: {
                        service_worker: 'background.js',
                    },
                    description: 'The missing browser tab manager',
                    icons: {
                        '128': 'icons/icon-mark-128.png',
                        '16': 'icons/icon-mark-16.png',
                        '48': 'icons/icon-mark-48.png',
                    },
                    manifest_version: 3,
                    name: 'Mark tab manager',
                    offline_enabled: true,
                    permissions: [
                        'contextMenus',
                        'management',
                        'storage',
                        'tabGroups',
                        'tabs',
                    ],
                    version: '0.1.34',
                })
            );
        });

        it('should throw when browser input is invalid', () => {
            expect(() => {
                generate({ browser: true });
            }).toThrow('Browser vendor not a string');
        });

        it('should throw when browser vendor is unsupported', () => {
            expect(() => {
                generate({ browser: 'unsupported' });
            }).toThrow('Browser vendor not supported');
        });
    });

    describe('when manifest generation is run as shell script', () => {
        it('should write any manifest to standard output', () => {
            const manifestBuffer = childProcess.execSync(
                'ts-node meta/manifest/generate.ts --browser chromium'
            );
            // JSON.parse type declarations specify any return value
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const manifest = JSON.parse(manifestBuffer.toString());
            expect(manifest).toEqual({
                action: {
                    default_title: 'Mark',
                },
                background: {
                    service_worker: 'background.js',
                },
                description: 'The missing browser tab manager',
                icons: {
                    '128': 'icons/icon-mark-128.png',
                    '16': 'icons/icon-mark-16.png',
                    '48': 'icons/icon-mark-48.png',
                },
                manifest_version: 3,
                name: 'Mark tab manager',
                offline_enabled: true,
                permissions: [
                    'contextMenus',
                    'management',
                    'storage',
                    'tabGroups',
                    'tabs',
                ],
                version: '0.1.34',
            });
        });
    });
});
