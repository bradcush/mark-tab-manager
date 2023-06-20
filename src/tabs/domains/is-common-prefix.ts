/**
 * Does the domain have a generic prefix
 * which isn't useful for grouping
 */
export function isCommonPrefix(prefix: string): boolean {
    const prefixes = ['www', 'ww2'];
    return prefixes.some((p) => p === prefix);
}
