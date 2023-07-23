import { StateKey } from 'src/storage/persisted-store-types';

export interface ToggleParams {
    identifier: StateKey;
    isChecked?: boolean;
}

export interface Checkbox {
    identifier: string;
    isChecked: boolean;
    format: 'checkbox';
    title: string;
}
