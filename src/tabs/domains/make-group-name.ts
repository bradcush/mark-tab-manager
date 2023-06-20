import { SYSTEM_GROUP_NAME } from './domain-constants';
import { GroupType, ParsedValidDomainResult } from './domain-types';
import { extractHostname } from './extract-hostname';
import { isCommonPrefix } from './is-common-prefix';
import { isNewTab } from './is-new-tab';
import { parseValidDomain } from './parse-valid-domain';

/**
 * Determine the highest level domain
 * with precedence given to subdomains
 */
function makeGranularGroupName(result: ParsedValidDomainResult) {
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
export function makeGroupName(type: GroupType, url?: string): string {
    if (typeof url === 'undefined') {
        return SYSTEM_GROUP_NAME;
    }
    const host = extractHostname(url);
    // New tabs get their own group name
    if (isNewTab(host)) {
        return 'new';
    }
    const parseResult = parseValidDomain(host);
    if (!parseResult) {
        return SYSTEM_GROUP_NAME;
    }
    return type === 'granular'
        ? makeGranularGroupName(parseResult)
        : parseResult.domain;
}
