/**
 * Flag new tabs so they can be treated uniquely
 */
export function isNewTab(hostname: string): boolean {
    return hostname === 'newtab';
}
