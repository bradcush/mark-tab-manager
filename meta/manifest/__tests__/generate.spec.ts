import { afterEach, beforeEach, describe, expect, mock, test } from 'bun:test';
import childProcess from 'child_process';
import { Manifest } from '../generate-types';
import { generate } from '../generate';

describe('generate', () => {
    // Returned value shouldn't matter here
    const processStdoutWriteMock = mock(() => true);

    // Helper function used to assert stringified stdout using
    // the same params as specified during generation
    const stringifyToMatchStdout = (manifest: Manifest) =>
        JSON.stringify(manifest, null, 2);

    // Referencing unbound method for original reassignment
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const originalProcessStdoutWrite = process.stdout.write;

    beforeEach(() => {
        process.stdout.write = processStdoutWriteMock;
    });

    afterEach(() => {
        process.stdout.write = originalProcessStdoutWrite;
        processStdoutWriteMock.mockReset();
    });

    describe('when manifest generation is run from function call', () => {
        test('should write manifest for chromium', () => {
            generate({ browser: 'chromium' });
            const [result] = processStdoutWriteMock.mock.calls;
            expect(result).toEqual([
                stringifyToMatchStdout({
                    action: {
                        default_title: 'Mark',
                    },
                    background: {
                        service_worker: 'background.js',
                    },
                    commands: {
                        collapse: {
                            suggested_key: 'Ctrl+Shift+O',
                            description: 'Collapse inactive tab groups',
                        },
                    },
                    description: 'Automatically group tabs by domain',
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
                    version: '0.1.46',
                }),
            ]);
        });

        test('should throw when browser input is invalid', () => {
            expect(() => {
                generate({ browser: true });
            }).toThrow('Browser vendor not a string');
        });

        test('should throw when browser vendor is unsupported', () => {
            expect(() => {
                generate({ browser: 'unsupported' });
            }).toThrow('Browser vendor not supported');
        });
    });

    describe('when manifest generation is run as shell script', () => {
        test('should write any manifest to standard output', () => {
            const manifestBuffer = childProcess.execSync(
                'bun meta/manifest/run.ts --browser chromium'
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
                commands: {
                    collapse: {
                        suggested_key: 'Ctrl+Shift+O',
                        description: 'Collapse inactive tab groups',
                    },
                },
                description: 'Automatically group tabs by domain',
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
                version: '0.1.46',
            });
        });
    });
});
