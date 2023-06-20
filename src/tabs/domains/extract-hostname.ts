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
