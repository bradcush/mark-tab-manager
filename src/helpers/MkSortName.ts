import { MkGroupType } from './MkGroupName';

export interface MkMakeGranularSortNameParams {
    groupType: MkGroupType;
    domain: string;
    subDomains: string[];
}

export interface MkMakeSortNameParams {
    type: MkGroupType;
    url: string | undefined;
}
