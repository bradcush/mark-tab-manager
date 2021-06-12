import { MkOrganizer as MkTabsOrganizer } from 'src/tabs/MkOrganizer';
import { MkGrouper as MkTabsGrouper } from 'src/tabs/MkGrouper';

export interface MkToggleParams {
    identifier: unknown;
    isChecked?: boolean;
    tabsGrouper: MkTabsGrouper;
    tabsOrganizer: MkTabsOrganizer;
}
