import { contextMenusRemove } from 'src/infra/browser/context-menus/remove';
import { contextMenusCreate } from 'src/infra/browser/context-menus/create';
import { MenuItem } from './menu-types';

/**
 * Create of a single context action menu collection
 * with a parent and any number of relevant children
 */
export async function contextMenusCreateLeveled(
    heading: string,
    children: MenuItem[],
    label: string,
    location: chrome.contextMenus.ContextType
): Promise<void> {
    // Menus might not exist so if there's an issue with
    // removal we still want to proceed with creation
    try {
        // Sometimes menus aren't destroyed properly and
        // we have id conflicts when creating new ones
        await contextMenusRemove(label);
        for (const child of children) {
            await contextMenusRemove(child.identifier);
        }
    } catch (error) {
        console.error(error);
    }
    // Finish creating the menu heading
    // before linking it's children
    await contextMenusCreate({
        contexts: [location],
        id: label,
        title: heading,
        visible: true,
    });
    for (const child of children) {
        const { format, identifier, title } = child;
        const createProperties: chrome.contextMenus.CreateProperties = {
            contexts: [location],
            id: identifier,
            parentId: label,
            title: title,
            type: child.format,
            visible: true,
        };
        // Only checkbox types have a checked property
        if (format === 'checkbox') {
            createProperties['checked'] = child.isChecked;
        }
        await contextMenusCreate(createProperties);
    }
}
