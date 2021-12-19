import { isSupported as isTabGroupsUpdateSupported } from 'src/api/browser/tabGroups/update';
import { isSupported as isTabsGroupSupported } from 'src/api/browser/tabs/group';
import { isSupported as isTabsUngroupSupported } from 'src/api/browser/tabs/ungroup';
import { isSupported as isTabGroupsOnUpdatedSupported } from 'src/api/browser/tabGroups/onUpdated';
import { isSupported as isTabGroupsQuerySupported } from 'src/api/browser/tabGroups/query';

/**
 * Check if all used tab grouping APIs are supported
 */
export function isSupported(): boolean {
    return (
        isTabGroupsUpdateSupported() &&
        isTabGroupsQuerySupported() &&
        isTabsGroupSupported() &&
        isTabsUngroupSupported() &&
        isTabGroupsOnUpdatedSupported()
    );
}
