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
    create: () => void;
    toggle: (params: MkToggleParams) => void;
}
