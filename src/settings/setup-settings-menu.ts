import { logVerbose } from 'src/logs/console';
import { createSettingsMenu } from './create-settings-menu';
import { listenForSettingsChange } from './change-settings';

/**
 * Connect the settings menu
 */
export function setupSettingsMenu() {
    logVerbose('setupSettingsMenu');
    createSettingsMenu();
    listenForSettingsChange();
}
