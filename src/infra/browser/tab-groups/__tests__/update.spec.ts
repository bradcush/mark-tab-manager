import { afterEach, beforeEach, describe, expect, mock, test } from 'bun:test';
import { tabGroupsUpdate } from '../update';

describe('tabGroupsUpdate', () => {
    const originalChrome = global.chrome;

    beforeEach(() => {
        // Mocking requires any assertion for setting tabGroups
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (global.chrome as any) = {
            tabGroups: {
                update: mock(
                    (
                        _groupId: number,
                        _updateProperties: chrome.tabGroups.UpdateProperties,
                        callback: () => void
                    ) => {
                        callback();
                    }
                ),
            },
            runtime: {},
        };
    });

    afterEach(() => {
        global.chrome = originalChrome;
    });

    test('should throw when update is lacking support', () => {
        // Setting tabGroups requires any
        // eslint-disable-next-line
        (global.chrome as any).tabGroups = undefined;
        global.chrome.runtime.lastError = undefined;
        const groupId = 1;
        const updateProperties = { title: 'title' };
        expect(() => {
            void tabGroupsUpdate(groupId, updateProperties);
        }).toThrow('No tabGroups.update support');
    });

    test('should resolve after group is updated', async () => {
        global.chrome.runtime.lastError = undefined;
        const groupId = 1;
        const updateProperties = { title: 'title' };
        const resolution = await tabGroupsUpdate(groupId, updateProperties);
        expect(resolution).toBeUndefined();
    });

    test('should reject with error if one exists', () => {
        global.chrome.runtime.lastError = {
            message: 'error',
        };
        const groupId = 1;
        const updateProperties = { title: 'title' };
        expect(tabGroupsUpdate(groupId, updateProperties)).rejects.toBe(
            'error'
        );
    });
});
