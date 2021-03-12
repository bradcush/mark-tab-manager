import { parseDomain, ParseResultType } from 'parse-domain';

/**
 * Extract the URL starting with the protocol
 */
function parseUrl(url: string) {
    // Page source URLs have a special prefix
    const sourcePrefix = 'view-source:';
    const protocolIdx = url.includes(sourcePrefix)
        ? url.indexOf(sourcePrefix) + sourcePrefix.length
        : 0;
    const extractedUrl = url.substring(protocolIdx);
    return new URL(extractedUrl);
}

/**
 * Currently a quick attempt at parsing the most
 * general and shared part of a given domain
 * TODO: Make sure to revisit with the docs
 */
export function parseSharedDomain(url: string | undefined): string {
    if (typeof url === 'undefined') {
        return '#';
    }
    const parsedUrl = parseUrl(url);
    const parseResult = parseDomain(parsedUrl.hostname);
    const { hostname } = parseResult;
    // Flag new tabs so they can be treated uniquely
    if (hostname === 'newtab') {
        return 'new';
    }
    // Treat URLs with unlisted domain as system URLs
    // Only treating listed domains temporarily
    if (parseResult.type !== ParseResultType.Listed) {
        return '#';
    }
    // Treat URLs with no domain as system URLs
    const domain = parseResult.icann.domain;
    if (!domain) {
        return '#';
    }
    return domain;
}
