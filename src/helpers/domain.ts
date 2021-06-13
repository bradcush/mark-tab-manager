import { parseDomain, ParseResultType } from 'parse-domain';
import { MkParseValidDomainInfoResult } from './MkDomain';

/**
 * Extract the hostname from a URL
 */
export function extractHostname(url: string): string {
    // Page source URLs have a special prefix
    const sourcePrefix = 'view-source:';
    const protocolIdx = url.includes(sourcePrefix)
        ? url.indexOf(sourcePrefix) + sourcePrefix.length
        : 0;
    const extractedUrl = url.substring(protocolIdx);
    return new URL(extractedUrl).hostname;
}

/**
 * Does the domain have a generic prefix
 * which isn't useful for grouping
 */
export function isCommonPrefix(prefix: string): boolean {
    const prefixes = ['www', 'ww2'];
    return prefixes.some((p) => p === prefix);
}

/**
 * Flag new tabs so they can be treated uniquely
 */
export function isNewTab(hostname: string): boolean {
    return hostname === 'newtab';
}

/**
 * Parse the domain info from a valid URL
 */
export function parseValidDomainInfo(
    hostname: string
): MkParseValidDomainInfoResult | null {
    // Unlisted domains are considered invalid
    const parseResult = parseDomain(hostname);
    if (parseResult.type !== ParseResultType.Listed) {
        return null;
    }
    // URLs with no domain are considered
    // invalid like a tld without a domain
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
