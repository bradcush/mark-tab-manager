// TODO: Remove debounce in favor of in memory compare
import debounce from 'lodash/debounce';
import {
    MkAddNewGroupParams,
    MkContstructorParams,
    MkSiteOrganizer,
    MkSiteOrganizerBrowser,
    MkUpdateGroupTitleParams,
} from './MkSiteOrganizer';
import { MkBrowser } from 'src/api/MkBrowser';
import { parseSharedDomain } from 'src/helpers/domainHelpers';
import { MkStore } from 'src/storage/MkStore';
import { MkColor as MkTabGroupsColor } from 'src/api/browser/tabGroups/MkColor';
import { isSupported as isTabGroupsUpdateSupported } from 'src/api/browser/tabGroups/update';
import { isSupported as isTabsGroupSupported } from 'src/api/browser/tabs/group';
import { isSupported as isTabsUngroupSupported } from 'src/api/browser/tabs/ungroup';
import { MkLogger } from 'src/logs/MkLogger';

/**
 * Organize open tabs
 */
export class SiteOrganizer implements MkSiteOrganizer {
    public constructor({ browser, store, Logger }: MkContstructorParams) {
        if (!browser) {
            throw new Error('No browser');
        }
        this.browser = browser;

        if (!store) {
            throw new Error('No store');
        }
        this.store = store;

        if (!Logger) {
            throw new Error('No Logger');
        }
        this.logger = new Logger('SiteOrganizer');
        this.logger.log('constructor');
    }

    private readonly browser: MkSiteOrganizerBrowser;
    private readonly store: MkStore;
    private readonly DEBOUNCE_TIMEOUT = 50;
    private readonly logger: MkLogger;

    /**
     * Connect site organizer to triggering browser events
     */
    public connect(): void {
        this.logger.log('connect');

        // Handle when the extension icon is clicked
        this.browser.action.onClicked.addListener(() => {
            this.logger.log('browser.action.onClicked');
            const lastError = this.browser.runtime.lastError;
            if (lastError) {
                throw lastError;
            }
            void this.organize();
        });

        // Prevent too many repetitive calls to organize
        const organize = debounce(this.organize, this.DEBOUNCE_TIMEOUT);

        /**
         * Handle tabs where a URL is updated
         * TODO: Handle funky case where the browser is relaunched and
         * multiple tabs are updating at once causing multiple re-renders
         */
        /* eslint-disable-next-line @typescript-eslint/no-misused-promises */
        this.browser.tabs.onUpdated.addListener(async (_tabId, changeInfo) => {
            this.logger.log('browser.tabs.onUpdated', changeInfo);
            const lastError = this.browser.runtime.lastError;
            if (lastError) {
                throw lastError;
            }
            // We only want automatic sort if enabled
            const state = await this.store.getState();
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
            void organize();
        });

        // Handle removed tabs
        /* eslint-disable-next-line @typescript-eslint/no-misused-promises */
        this.browser.tabs.onRemoved.addListener(async () => {
            // We only want automatic sort if enabled
            const state = await this.store.getState();
            const isAutomaticSortingEnabled = state.enableAutomaticSorting;
            if (!isAutomaticSortingEnabled) {
                return;
            }
            void organize();
        });
    }

    /**
     * Add new tab groups for a given name and set of tab ids
     * TODO: Find a way to prevent the edit field from showing after a
     * group has been created. Ordering of colors should also be predictable
     * so it doesn't change on every resort.
     */
    private async addNewGroup({ idx, name, tabIds }: MkAddNewGroupParams) {
        this.logger.log('addNewGroup', name);
        const options = { tabIds };
        const groupId = await this.browser.tabs.group(options);
        const title = `${name} (${tabIds.length})`;
        const color = this.getColorForGroup(idx);
        this.updateGroupTitle({ color, groupId, title });
    }

    /**
     * Remove tabs that are pinned from the list
     */
    private filterNonPinnedTabs(tabs: MkBrowser.tabs.Tab[]) {
        this.logger.log('filterNonPinnedTabs');
        const isTabPinned = (tab: MkBrowser.tabs.Tab) => !!tab.pinned;
        const nonPinnedTabs = tabs.filter((tab) => !isTabPinned(tab));
        return nonPinnedTabs;
    }

    /**
     * Get the color based on each index so that each index will
     * retain the same color regardless of a group re-render
     */
    private getColorForGroup(index: number) {
        this.logger.log('getColorForGroup', index);
        const colorsByEnum = this.browser.tabGroups.Color;
        this.logger.log('getColorForGroup', colorsByEnum);
        const colorKeys = Object.keys(colorsByEnum);
        // TODO: Remove type assertion in favor of real types
        const colors = colorKeys.map(
            (colorKey) => colorsByEnum[colorKey] as MkTabGroupsColor
        );
        const colorIdx = index % colorKeys.length;
        const color = colors[colorIdx];
        this.logger.log('getColorForGroup', color);
        return color;
    }

    /**
     * Group tabs in the browser with the same domain
     */
    private groupBrowserTabs(tabs: MkBrowser.tabs.Tab[]) {
        this.logger.log('groupBrowserTabs');
        const nonPinnedTabs = this.filterNonPinnedTabs(tabs);
        const tabIdsByDomain = this.sortTabIdsByDomain(nonPinnedTabs);
        this.renderBrowserTabGroups(tabIdsByDomain);
    }

    /**
     * Check if all used tab grouping APIs are supported
     */
    private isTabGroupingSupported() {
        return (
            isTabGroupsUpdateSupported() &&
            isTabsGroupSupported() &&
            isTabsUngroupSupported()
        );
    }

    /**
     * Order and group all tabs
     */
    public organize = async (): Promise<void> => {
        this.logger.log('organize');
        const tabs = await this.browser.tabs.query({});
        const lastError = this.browser.runtime.lastError;
        if (lastError) {
            throw lastError;
        }
        const sortedTabs = this.sortTabsAlphabetically(tabs);
        this.reorderBrowserTabs(sortedTabs);
        const isTabGroupingSupported = this.isTabGroupingSupported();
        if (!isTabGroupingSupported) {
            this.logger.log('Tab grouping is not supported');
            return;
        }
        this.groupBrowserTabs(sortedTabs);
    };

    /**
     * Remove a list of tab ids from any group
     */
    private removeExistingGroup(ids: number[]) {
        this.logger.log('removeExistingGroup', ids);
        void this.browser.tabs.ungroup(ids);
    }

    /**
     * Set groups and non-groups using their tab id where
     * groups must contain at least two or more tabs
     */
    private renderBrowserTabGroups(tabIdsByGroup: Record<string, number[]>) {
        this.logger.log('renderBrowserTabGroups', tabIdsByGroup);
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
            void this.addNewGroup({ idx, name: group, tabIds });
        });
    }

    /**
     * Reorder browser tabs in the current
     * window according to tabs list
     */
    private reorderBrowserTabs(tabs: MkBrowser.tabs.Tab[]) {
        this.logger.log('reorderBrowserTabs', tabs);
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
        this.logger.log('sortTabIdsByDomain');
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
        this.logger.log('sortTabIdsByDomain', tabIdsByDomain);
        return tabIdsByDomain;
    }

    /**
     * Sort tabs alphabetically using their hostname with
     * exceptions for system tabs and most specifically "newtab"
     */
    private sortTabsAlphabetically(tabs: MkBrowser.tabs.Tab[]) {
        this.logger.log('sortTabsAlphabetically', tabs);
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
    }: MkUpdateGroupTitleParams) {
        this.logger.log('updateGroupTitle');
        const updateProperties = { color, title };
        void this.browser.tabGroups.update(groupId, updateProperties);
    }
}
