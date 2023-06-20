import { parseDomain, ParseResultType } from 'parse-domain';
import { ParsedValidDomainResult } from './domain-types';

/**
 * Parse the domain info from a valid URL
 */
export function parseValidDomain(
    hostname: string
): ParsedValidDomainResult | null {
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
