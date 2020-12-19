import { parseDomain, ParseResultType } from 'parse-domain';
/**
 * Currently a quick attempt at parsing the most
 * general and shared part of a given domain
 * TODO: Make sure to revisit with the docs
 */
export function parseSharedDomain(host: string) {
    console.log('parseSharedDomain', host);
    const parseResult = parseDomain(host);
    console.log('parseSharedDomain', parseResult);
    // Only treating listed domains temporarily
    if (parseResult.type !== ParseResultType.Listed) {
        return '';
    }
    const domain = parseResult.icann.domain;
    if (!domain) {
        return '';
    }
    console.log('parseSharedDomain', domain);
    return domain;
}
