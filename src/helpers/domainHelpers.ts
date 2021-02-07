import { parseDomain, ParseResultType } from 'parse-domain';
/**
 * Currently a quick attempt at parsing the most
 * general and shared part of a given domain
 * TODO: Make sure to revisit with the docs
 */
export function parseSharedDomain(host: string): string {
    const parseResult = parseDomain(host);
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
