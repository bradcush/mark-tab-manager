export type GroupType = 'granular' | 'shared';

export interface ParsedValidDomainResult {
    domain: string;
    subDomains: string[];
}
