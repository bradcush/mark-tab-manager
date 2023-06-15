import { isTabGroupsUpdateSupported } from 'src/infra/browser/tab-groups/update';
import { isTabsGroupSupported } from 'src/infra/browser/tabs/group';
import { isTabsUngroupSupported } from 'src/infra/browser/tabs/ungroup';
import { isTabGroupsOnUpdatedSupported } from 'src/infra/browser/tab-groups/on-updated';
import { isTabGroupsQuerySupported } from 'src/infra/browser/tab-groups/query';

/**
 * Check if all used tab grouping APIs are supported
 */
export function isTabGroupingSupported(): boolean {
    return (
        isTabGroupsUpdateSupported() &&
        isTabGroupsQuerySupported() &&
        isTabsGroupSupported() &&
        isTabsUngroupSupported() &&
        isTabGroupsOnUpdatedSupported()
    );
}
