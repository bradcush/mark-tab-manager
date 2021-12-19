import { create as contextMenusCreate } from 'src/api/browser/contextMenus/create';
import { MkCreateDropdownParams } from './MkCreateDropdown';

/**
 * Create of a single context action menu collection
 * with a parent and any number of relevant children
 */
export async function createDropdown({
    heading,
    children,
    label,
    location,
}: MkCreateDropdownParams): Promise<void> {
    // Finish creating the menu heading
    // before linking it's children
    await contextMenusCreate({
        contexts: [location],
        id: label,
        title: heading,
        visible: true,
    });
    children.forEach((child) => {
        const { identifier, title } = child;
        const createProperties: chrome.contextMenus.CreateProperties = {
            contexts: [location],
            id: identifier,
            parentId: label,
            title: title,
            type: child.format,
            visible: true,
        };
        // Only checkbox types have a checked property
        if (child.format === 'checkbox') {
            createProperties['checked'] = child.isChecked;
        }
        void contextMenusCreate(createProperties);
    });
}
