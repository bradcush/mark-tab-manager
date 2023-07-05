import { describe, expect, test } from 'bun:test';
import { MemoryCache } from '../memory-cache';

describe('MemoryCache', () => {
    describe('when checking if anything exists in the cache', () => {
        test('should indicate when no items exist', () => {
            const memoryCache = new MemoryCache();
            const isCacheFilled = memoryCache.exists();
            expect(isCacheFilled).toBe(false);
        });

        test('should indicate when any number of items exist', () => {
            const memoryCache = new MemoryCache();
            const keyName = 123;
            const groupName = 'group';
            const item = { key: keyName, value: groupName };
            memoryCache.set([item]);
            const isCacheFilled = memoryCache.exists();
            expect(isCacheFilled).toBe(true);
        });
    });

    describe('when an item is retrieved from the cache', () => {
        test('should retrieve the item if present', () => {
            const memoryCache = new MemoryCache();
            const keyName = 123;
            const groupName = 'group';
            const item = { key: keyName, value: groupName };
            memoryCache.set([item]);
            const value = memoryCache.get(keyName);
            expect(value).toBe(groupName);
        });

        test('should retrieve nothing if the item is not present', () => {
            const memoryCache = new MemoryCache();
            const value = memoryCache.get(123);
            expect(value).toBeUndefined();
        });
    });

    describe('when an item is removed from the cache', () => {
        test('should remove the item if present', () => {
            const memoryCache = new MemoryCache();
            const keyName = 123;
            const groupName = 'group';
            const item = { key: keyName, value: groupName };
            memoryCache.set([item]);
            const value = memoryCache.get(keyName);
            expect(value).toBe(groupName);
            memoryCache.remove(keyName);
            const newValue = memoryCache.get(keyName);
            expect(newValue).toBeUndefined();
        });
    });

    describe('when an item is added to the cache', () => {
        test('should add the item if not already present', () => {
            const memoryCache = new MemoryCache();
            const keyName = 123;
            const groupName = 'group';
            const item = { key: keyName, value: groupName };
            memoryCache.set([item]);
            const value = memoryCache.get(keyName);
            expect(value).toBe(groupName);
        });

        test('should replace the item if already present', () => {
            const memoryCache = new MemoryCache();
            const keyName = 123;
            const firstGroupName = 'group';
            const firstItem = {
                key: keyName,
                value: firstGroupName,
            };
            const secondKeyName = 456;
            const secondGroupName = 'group';
            const secondItem = {
                key: secondKeyName,
                value: secondGroupName,
            };
            memoryCache.set([firstItem, secondItem]);
            const firstValue = memoryCache.get(keyName);
            expect(firstValue).toBe(firstGroupName);
            const secondValue = memoryCache.get(secondKeyName);
            expect(secondValue).toBe(secondGroupName);
            const newGroupName = 'newGroup';
            const newItem = { key: keyName, value: newGroupName };
            memoryCache.set([newItem]);
            const newValue = memoryCache.get(keyName);
            expect(newValue).toBe(newGroupName);
            const secondValueAgain = memoryCache.get(secondKeyName);
            expect(secondValueAgain).toBe(secondGroupName);
        });

        test('should not add the item if cache contains the same number', () => {
            const memoryCache = new MemoryCache();
            const firstKeyName = 123;
            const groupName = 'group';
            const firstItem = {
                key: firstKeyName,
                value: groupName,
            };
            memoryCache.set([firstItem]);
            const firstValue = memoryCache.get(firstKeyName);
            expect(firstValue).toBe(groupName);
            const secondKeyName = 456;
            const secondItem = {
                key: secondKeyName,
                value: groupName,
            };
            memoryCache.set([secondItem]);
            const secondValue = memoryCache.get(secondKeyName);
            expect(secondValue).toBeUndefined();
        });

        test('should throw if the item key or value is not set', () => {
            const memoryCache = new MemoryCache();
            const firstKeyName = undefined;
            const firstGroupName = 'group';
            const firstItem = {
                key: firstKeyName,
                value: firstGroupName,
            };
            expect(() => {
                memoryCache.set([firstItem]);
            }).toThrow('No key for tab cache');
            const secondKeyName = 123;
            const secondGroupName = undefined;
            const secondItem = {
                key: secondKeyName,
                value: secondGroupName,
            };
            expect(() => {
                memoryCache.set([secondItem]);
            }).toThrow('No value for tab cache');
        });
    });
});
