import { SYSTEM_GROUP_NAME } from './domain-constants';
import { GroupType } from './domain-types';
import { extractHostname } from './extract-hostname';
import { isCommonPrefix } from './is-common-prefix';
import { isNewTab } from './is-new-tab';
import { parseValidDomain } from './parse-valid-domain';

/**
 * Create a string for sorting based on domain, subdomain,
 * and title in that order that aligns with group names
 */
function makeGranularSortName(
    groupType: GroupType,
    domain: string,
    subDomains: string[]
) {
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
    // nothing in if nothing is left
    const sharedSubDomain = subDomains.pop() ?? '';
    // Granular settings give subdomain precedence and
    // shared group type gives domain precedence
    return groupType === 'granular'
        ? `${sharedSubDomain}${domain}`
        : `${domain}${sharedSubDomain}`;
}

/**
 * Sort name to be used for sorting tabs
 * which affects group positions also
 */
export function makeSortName(type: GroupType, url?: string): string {
    if (typeof url === 'undefined') {
        return SYSTEM_GROUP_NAME;
    }
    const host = extractHostname(url);
    // New tabs should be sorted last which using zzz is meant to represent
    // since domains can only include numbers, letters, and hyphens
    if (isNewTab(host)) {
        return 'zzz';
    }
    const parseResult = parseValidDomain(host);
    if (!parseResult) {
        return SYSTEM_GROUP_NAME;
    }
    const { domain, subDomains } = parseResult;
    return makeGranularSortName(type, domain, subDomains);
}
