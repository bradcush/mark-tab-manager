import { NEW_GROUP_NAME, SYSTEM_GROUP_NAME } from './groupName';
import {
    extractHostname,
    isCommonPrefix,
    isNewTab,
    parseValidDomainInfo,
} from './domainHelpers';
import {
    MkMakeGranularSortNameParams,
    MkMakeSortNameParams,
} from './MkSortName';

/**
 * Create a string for sorting based on domain, subdomain,
 * and title in that order that aligns with group names
 */
function makeGranularSortName(params: MkMakeGranularSortNameParams) {
    const { groupType, domain, subDomains } = params;
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
 * TODO: Couple sorting and grouping
 */
export function makeSortName({ type, url }: MkMakeSortNameParams): string {
    if (typeof url === 'undefined') {
        return SYSTEM_GROUP_NAME;
    }
    const host = extractHostname(url);
    // New tabs should be sorted last which using zzz is meant to represent
    // since domains can only include numbers, letters, and hyphens
    if (isNewTab(host)) {
        return NEW_GROUP_NAME;
    }
    const parseResult = parseValidDomainInfo(host);
    if (!parseResult) {
        return SYSTEM_GROUP_NAME;
    }
    return makeGranularSortName({
        ...parseResult,
        groupType: type,
    });
}
