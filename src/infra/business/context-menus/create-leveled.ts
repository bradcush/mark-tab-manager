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
