import { tabsCreate } from 'src/infra/browser/tabs/create';
import { LINKS_BY_RESOURCE } from './resource-constants';
import { Resource } from './resources-types';

/**
 * Open resource link in a new tab
 */
export function openResourcesLink(resource: Resource): void {
    const url = LINKS_BY_RESOURCE[resource];
    const createProperties = { url };
    void tabsCreate(createProperties);
}
