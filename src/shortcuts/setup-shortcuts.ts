import { logVerbose } from 'src/logs/console';
import { commandsOnCommand } from 'src/infra/browser/commands/on-command';
import { organizeTabs } from 'src/tabs/organize-tabs';
import { actionOnClicked } from 'src/infra/browser/action/on-clicked';

/**
 * Connect keyboard shortcuts and
 * manual triggers for organiztion
 */
export function setupShortcuts(): void {
    logVerbose('setupShortcuts');

    // Handle keyboard shortcuts defined in the manifest
    commandsOnCommand.addListener((command) => {
        logVerbose('commandsOnCommand', command);
        if (command === 'collapse') {
            void organizeTabs({
                format: 'collapse',
            });
        }
    });

    // Handle when the extension icon is clicked
    actionOnClicked.addListener(() => {
        logVerbose('actionOnClicked');
        void organizeTabs({
            format: 'collapse',
        });
    });
}
