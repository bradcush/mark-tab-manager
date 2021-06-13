import { MkMakeMenu } from './MkAction';
import { browser } from 'src/api/browser';
import { logError, logVerbose } from 'src/logs/console';
import { MkBrowser } from 'src/api/MkBrowser';

/**
 * Drive creation of a single context action menu
 * collection with a parent and relevant children
 */
export async function makeMenu({
    heading,
    items,
    label,
}: MkMakeMenu): Promise<void> {
    try {
        logVerbose('makeMenu');
        // Specific to the action context
        const location = 'action';
        await makeItem({
            contexts: [location],
            id: label,
            title: heading,
            visible: true,
        });
        items.forEach(({ format, identifier, isChecked, title }) => {
            void makeItem({
                checked: isChecked,
                contexts: [location],
                id: identifier,
                parentId: label,
                title: title,
                type: format,
                visible: true,
            });
        });
    } catch (error) {
        logError('makeItem', error);
        throw error;
    }
}

/**
 * Create any general
 * menu item type
 */
async function makeItem(
    createProperties: MkBrowser.contextMenus.CreateProperties
) {
    try {
        logVerbose('makeItem');
        await browser.contextMenus.create(createProperties);
    } catch (error) {
        logError('makeItem', error);
        throw error;
    }
}
