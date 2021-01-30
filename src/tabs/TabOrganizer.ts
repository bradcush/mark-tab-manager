import debounce from 'lodash/debounce';
import {
    MkTabOrganizer,
    MkToAddNewGroupParams,
    MkToBrowser,
    MkToContstructorParams,
    MkToUpdateGroupTitleParams,
} from './MkTabOrganizer';
import { MkBrowser } from 'src/api/MkBrowser';
import { parseSharedDomain } from 'src/helpers/domainHelpers';
import { MkStorageService } from 'src/storage/MkStorageService';

/**
 * Organize open tabs
 */
export class TabOrganizer implements MkTabOrganizer {
    public constructor({ browser, storage }: MkToContstructorParams) {
        console.log('TabOrganizer.constructor');

        if (!browser) {
            throw new Error('No browser');
        }
        this.browser = browser;

        if (!storage) {
            throw new Error('No storage');
        }
        this.storage = storage;
    }

    private readonly browser: MkToBrowser;
    private readonly storage: MkStorageService;
    private readonly DEBOUNCE_TIMEOUT = 50;

    /**
     * Initialize tab organizer to trigger on extension
     * icon click or automatic tab URL update
     * TODO: Handle funky case where the browser is relaunched and
     * multiple tabs are updating at once causing multiple re-renders
     */
    public init() {
        console.log('TabOrganizer.init');

        // Handle when the extension is installed and tabs exist
        const state = this.storage.getState();
        const isAutomaticSortingEnabled = state.enableAutomaticSorting;
        if (isAutomaticSortingEnabled) {
            this.organizeAllTabs();
        }

        // Handle when the extension icon is clicked
        this.browser.action.onClicked.addListener(() => {
            console.log('TabOrganizer.browser.action.onClicked');
            const lastError = this.browser.runtime.lastError;
            if (lastError) {
                throw lastError;
            }
            this.organizeAllTabs();
        });

        // Prevent too many repetetive calls to organize
        const organizeAllTabs = debounce(
            this.organizeAllTabs,
            this.DEBOUNCE_TIMEOUT
        );

        // Handle tabs where a URL is updated
        this.browser.tabs.onUpdated.addListener((_tabId, changeInfo) => {
            console.log('TabOrganizer.browser.tabs.onUpdated', changeInfo);
            const lastError = this.browser.runtime.lastError;
            if (lastError) {
                throw lastError;
            }
            // We only want automatic sort if enabled
            const state = this.storage.getState();
            const isAutomaticSortingEnabled = state.enableAutomaticSorting;
            if (!isAutomaticSortingEnabled) {
                return;
            }
            // TODO: We could only update the order if the domain has changed
            // but this would require keeping track of a tabs previous state
            // which might not be worth the added complexity.
            const hasUrlChanged = !!changeInfo.url;
            const hasPinnedChanged = typeof changeInfo.pinned === 'boolean';
            if (!hasUrlChanged && !hasPinnedChanged) {
                return;
            }
            organizeAllTabs();
        });

        // Handle removed tabs
        this.browser.tabs.onRemoved.addListener(() => {
            // We only want automatic sort if enabled
            const state = this.storage.getState();
            const isAutomaticSortingEnabled = state.enableAutomaticSorting;
            if (!isAutomaticSortingEnabled) {
                return;
            }
            organizeAllTabs();
        });
    }

    /**
     * Add new tab groups for a given name and set of tab ids
     * TODO: Find a way to prevent the edit field from showing after a
     * group has been created. Ordering of colors should also be predictable
     * so it doesn't change on every resort.
     */
    private addNewGroup({ idx, name, tabIds }: MkToAddNewGroupParams) {
        console.log('TabOrganizer.addNewGroup', name);
        const options = { tabIds };
        this.browser.tabs.group(options, (groupId) => {
            console.log('TabOrganizer.browser.tabs.group', groupId);
            const lastError = this.browser.runtime.lastError;
            if (lastError) {
                throw lastError;
            }
            const title = `${name} (${tabIds.length})`;
            const color = this.getColorForGroup(idx);
            this.updateGroupTitle({ color, groupId, title });
        });
    }

    /**
     * Remove tabs that are pinned from the list
     */
    private filterNonPinnedTabs(tabs: MkBrowser.tabs.Tab[]) {
        console.log('TabOrganizer.filterNonPinnedTabs');
        const isTabPinned = (tab: MkBrowser.tabs.Tab) => !!tab.pinned;
        const nonPinnedTabs = tabs.filter((tab) => !isTabPinned(tab));
        return nonPinnedTabs;
    }

    /**
     * Get the color based on each index so that each index will
     * retain the same color regardless of a group re-render
     */
    private getColorForGroup(index: number) {
        console.log('TabOrganizer.getColorForGroup', index);
        const colorsByEnum = this.browser.tabGroups.Color;
        console.log('TabOrganizer.getColorForGroup', colorsByEnum);
        const colorKeys = Object.keys(colorsByEnum);
        const colors = colorKeys.map((colorKey) => colorsByEnum[colorKey]);
        const colorIdx = index % colorKeys.length;
        const color = colors[colorIdx];
        console.log('TabOrganizer.getColorForGroup', color);
        return color;
    }

    /**
     * Group tabs in the browser with the same domain
     */
    private groupBrowserTabs(tabs: MkBrowser.tabs.Tab[]) {
        console.log('TabOrganizer.groupBrowserTabs');
        const nonPinnedTabs = this.filterNonPinnedTabs(tabs);
        const tabIdsByDomain = this.sortTabIdsByDomain(nonPinnedTabs);
        this.renderBrowserTabGroups(tabIdsByDomain);
    }

    /**
     * Order all tabs alphabetically
     */
    private organizeAllTabs = () => {
        console.log('TabOrganizer.orderAllTabs');
        this.browser.tabs.query({}, (tabs) => {
            console.log('TabOrganizer.browser.tabs.query', tabs);
            const lastError = this.browser.runtime.lastError;
            if (lastError) {
                throw lastError;
            }
            const sortedTabs = this.sortTabsAlphabetically(tabs);
            this.reorderBrowserTabs(sortedTabs);
            this.groupBrowserTabs(sortedTabs);
        });
    };

    /**
     * Remove a list of tab ids from any group
     */
    private removeExistingGroup(ids: number[]) {
        console.log('TabOrganizer.removeExistingGroup', ids);
        this.browser.tabs.ungroup(ids, () => {
            console.log('TabOrganizer.browser.tabs.ungroup');
            const lastError = this.browser.runtime.lastError;
            if (lastError) {
                throw lastError;
            }
        });
    }

    /**
     * Set groups and non-groups using their tab id where
     * groups must contain at least two or more tabs
     */
    private renderBrowserTabGroups(tabIdsByGroup: Record<string, number[]>) {
        console.log('TabOrganizer.renderBrowserTabGroups', tabIdsByGroup);
        const groups = Object.keys(tabIdsByGroup);
        const isRealGroup = (group: string) => tabIdsByGroup[group].length > 1;
        const realGroups = groups.filter(isRealGroup);
        const orphanGroups = groups.filter((group) => !isRealGroup(group));
        // We treat real groups first so our index used to
        // determine the color isn't affected by orphan groups
        [...realGroups, ...orphanGroups].forEach((group, idx) => {
            const tabIds = tabIdsByGroup[group];
            // Ungroup existing collections of one tab
            if (tabIds.length < 2) {
                this.removeExistingGroup(tabIds);
                return;
            }
            this.addNewGroup({ idx, name: group, tabIds });
        });
    }

    /**
     * Reorder browser tabs in the current
     * window according to tabs list
     */
    private reorderBrowserTabs(tabs: MkBrowser.tabs.Tab[]) {
        console.log('TabOrganizer.reorderBrowserTabs', tabs);
        tabs.forEach((tab) => {
            const { id } = tab;
            if (!id) {
                throw new Error('No id for sorted tab');
            }
            const moveProperties = { index: -1 };
            this.browser.tabs.move(id, moveProperties, () => {
                const lastError = this.browser.runtime.lastError;
                if (lastError) {
                    throw lastError;
                }
            });
        });
    }

    /**
     * Sort tabs by their domain while grouping those that don't
     * have a valid domain under the system nomenclature
     */
    private sortTabIdsByDomain(tabs: MkBrowser.tabs.Tab[]) {
        console.log('TabOrganizer.sortTabIdsByDomain');
        const tabIdsByDomain: Record<string, number[]> = {};
        tabs.forEach((tab) => {
            const { id, url } = tab;
            if (!id) {
                throw new Error('No id for tab');
            }
            // Don't group tabs without a URL
            // TODO: Depending on what these are we should reconsider
            if (!url) {
                throw new Error('No tab url');
            }
            const parsedUrl = new URL(url);
            const { hostname } = parsedUrl;
            const domain = parseSharedDomain(hostname);
            if (!tabIdsByDomain[domain]) {
                tabIdsByDomain[domain] = [id];
            } else {
                tabIdsByDomain[domain].push(id);
            }
        });
        console.log('TabOrganizer.sortTabIdsByDomain', tabIdsByDomain);
        return tabIdsByDomain;
    }

    /**
     * Sort tabs alphabetically using their hostname with
     * exceptions for system tabs and most specifically "newtab"
     */
    private sortTabsAlphabetically(tabs: MkBrowser.tabs.Tab[]) {
        console.log('TabOrganizer.sortTabsAlphabetically', tabs);
        const sortedTabs = tabs.sort((a, b) => {
            if (!a.url || !b.url) {
                throw new Error('No url for sorted tab');
            }
            const firstTabUrl = new URL(a.url);
            const firstTabHostname = firstTabUrl.hostname;
            const firstTabDomain = parseSharedDomain(firstTabHostname);
            const secondTabUrl = new URL(b.url);
            const secondTabHostname = secondTabUrl.hostname;
            const secondTabDomain = parseSharedDomain(secondTabHostname);
            return this.domainCompare(firstTabDomain, secondTabDomain);
        });
        return sortedTabs;
    }

    /**
     * Compare to be used with sorting where "newtab" is
     * last and specifically references the domain group
     */
    private domainCompare(a: string, b: string) {
        if (a === b) {
            return 0;
        }
        if (a === 'new') {
            return 1;
        }
        if (b === 'new') {
            return -1;
        }
        return a.localeCompare(b);
    }

    /**
     * Update an existing groups title
     */
    private updateGroupTitle({
        color,
        groupId,
        title,
    }: MkToUpdateGroupTitleParams) {
        console.log('TabOrganizer.updateGroupTitle');
        const updateProperties = { color, title };
        this.browser.tabGroups.update(groupId, updateProperties, () => {
            console.log('TabOrganizer.browser.tabGroups.update');
            const lastError = this.browser.runtime.lastError;
            if (lastError) {
                throw lastError;
            }
        });
    }
}
