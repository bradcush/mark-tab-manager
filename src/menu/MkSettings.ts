import { MkStateKey } from 'src/storage/MkStore';

export interface MkToggleParams {
    identifier: MkStateKey;
    isChecked?: boolean;
}
