import {
    MkMakeGranularGroupNameParams,
    MkMakeGroupNameParams,
} from './MkGroupName';
import {
    extractHostname,
    isCommonPrefix,
    isNewTab,
    parseValidDomainInfo,
} from './domainHelpers';

export const SYSTEM_GROUP_NAME = '#';

/**
 * Determine the highest level domain
 * with precedence given to subdomains
 */
function makeGranularGroupName(result: MkMakeGranularGroupNameParams) {
    const { domain, subDomains } = result;
    // Subdomain grouping not possible
    if (!subDomains.length) {
        return domain;
    }
    const prefix = subDomains[0];
    if (isCommonPrefix(prefix)) {
        // Remove the common prefix
        subDomains.shift();
    }
    // Use the highest level subdomain or
    // the domain if nothing is left
    const sharedSubDomain = subDomains.pop();
    if (!sharedSubDomain) {
        return domain;
    }
    return sharedSubDomain;
}

/**
 * Parses either the most general and shared domain part for
 * basic domain sorting or a more specific group name used
 * for more granular subdomain and domain sorting
 */
export function makeGroupName({ type, url }: MkMakeGroupNameParams): string {
    if (typeof url === 'undefined') {
        return SYSTEM_GROUP_NAME;
    }
    const host = extractHostname(url);
    // New tabs get their own group name
    if (isNewTab(host)) {
        return 'new';
    }
    const parseResult = parseValidDomainInfo(host);
    if (!parseResult) {
        return SYSTEM_GROUP_NAME;
    }
    return type === 'granular'
        ? makeGranularGroupName(parseResult)
        : parseResult.domain;
}
