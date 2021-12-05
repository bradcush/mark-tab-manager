import { MkMakeMenu } from './MkAction';
import { logVerbose } from 'src/logs/console';
import { create as contextMenusCreate } from 'src/api/browser/contextMenus/create';

/**
 * Drive creation of a single context action menu
 * collection with a parent and relevant children
 */
export async function makeMenu({
    heading,
    items,
    label,
}: MkMakeMenu): Promise<void> {
    logVerbose('makeMenu');
    // Specific to the action context
    // referring the extension icon
    const location = 'action';
    await contextMenusCreate({
        contexts: [location],
        id: label,
        title: heading,
        visible: true,
    });
    items.forEach(({ format, identifier, isChecked, title }) => {
        void contextMenusCreate({
            checked: isChecked,
            contexts: [location],
            id: identifier,
            parentId: label,
            title: title,
            type: format,
            visible: true,
        });
    });
}
