import { logVerbose } from 'src/logs/console';
import { createResourcesMenu } from './create-resources-menu';
import { handleResourceSelection } from './handle-resource-selection';

/**
 * Handle driven context menu
 * updates from the browser
 */
export function setupResourcesMenu(): void {
    logVerbose('setupResourcesMenu');
    createResourcesMenu();
    handleResourceSelection();
}
