export type MkGroupType = 'granular' | 'shared';

export interface MkMakeGranularGroupNameParams {
    domain: string;
    subDomains: string[];
}

export interface MkMakeGroupNameParams {
    type: MkGroupType;
    url: string | undefined;
}
