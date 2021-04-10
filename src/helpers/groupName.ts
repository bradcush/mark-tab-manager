import { parseDomain, ParseResultType } from 'parse-domain';
import {
    MkMakeGranularGroupNameParams,
    MkMakeGroupNameParams,
} from './MkGroupName';

export const SYSTEM_GROUP_NAME = '#';

/**
 * Extract the hostname from a URL
 */
function extractHostname(url: string) {
    // Page source URLs have a special prefix
    const sourcePrefix = 'view-source:';
    const protocolIdx = url.includes(sourcePrefix)
        ? url.indexOf(sourcePrefix) + sourcePrefix.length
        : 0;
    const extractedUrl = url.substring(protocolIdx);
    return new URL(extractedUrl).hostname;
}

/**
 * Flag new tabs so they can be treated uniquely
 */
function isNewTab(hostname: string) {
    return hostname === 'newtab';
}

/**
 * Parse the domain info from a valid URL
 */
function parseValidDomainInfo(hostname: string) {
    // Unlisted domains are considered invalid
    const parseResult = parseDomain(hostname);
    if (parseResult.type !== ParseResultType.Listed) {
        return null;
    }
    // URLs with no domain are considered invalid
    const { domain } = parseResult.icann;
    if (!domain) {
        return null;
    }
    const { subDomains } = parseResult.icann;
    return {
        domain,
        subDomains,
    };
}

/**
 * Does the domain have a generic prefix
 * which isn't useful for grouping
 */
function isCommonPrefix(prefix: string) {
    const prefixes = ['www', 'ww2'];
    return prefixes.some((p) => p === prefix);
}

/**
 * Calculate the user friendly group name
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
    const sharedDomain = subDomains.pop();
    if (!sharedDomain) {
        return domain;
    }
    return sharedDomain;
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
