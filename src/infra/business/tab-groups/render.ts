import { tabGroupsUpdate } from 'src/infra/browser/tab-groups/update';
import { tabsGroup } from 'src/infra/browser/tabs/group';
import { tabsUngroup } from 'src/infra/browser/tabs/ungroup';

type GroupTabCollectionItem = {
    action: 'group';
    color: chrome.tabGroups.ColorEnum;
    opened: boolean;
    tabIds: number[];
    title: string;
    windowId: number;
};

/**
 * Group tabs in the tab bar interface
 */
async function groupTabs(result: GroupTabCollectionItem) {
    const { color, opened, tabIds, title, windowId } = result;
    const createProperties = { windowId };
    const options = { createProperties, tabIds };
    const groupId = await tabsGroup(options);
    const updateProperties = { collapsed: !opened, color, title };
    void tabGroupsUpdate(groupId, updateProperties);
}

/**
 * Add and update tab groups or remove them
 * based on a given set of display options
 */
export function tabGroupsRender(
    tabCollectionItems: (
        | GroupTabCollectionItem
        | {
              action: 'ungroup';
              tabIds: number[];
          }
    )[]
): void {
    tabCollectionItems.forEach((item) => {
        const { action } = item;
        if (action === 'group') {
            void groupTabs(item);
        } else if (action === 'ungroup') {
            const { tabIds } = item;
            void tabsUngroup(tabIds);
        }
    });
}
