import { MkGrouper as MkTabsGrouper } from 'src/tabs/MkGrouper';
import { MkOrganizer as MkTabsOrganizer } from 'src/tabs/MkOrganizer';
import { MkToggleParams } from './MkSettings';

/**
 * Combined port for both driven menu
 * creation and user interaction
 * TODO: Think more if connections should be
 * separated by who is on the outside interacting
 * like in this case the system and the user
 * (eg. systemInstallConnect and userMenuConnect)
 */
export interface MkConnectParams {
    create: (tabsGrouper: MkTabsGrouper) => void;
    // TODO: Grouper and organizer should either be passed in a factory to
    // built create and toggle functions or can be direct dependencies
    grouper: MkTabsGrouper;
    organizer: MkTabsOrganizer;
    toggle: (params: MkToggleParams) => void;
}
