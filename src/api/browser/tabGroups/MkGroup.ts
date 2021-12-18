import { MkColor } from './MkColor';

export interface MkTabGroup {
    collapsed: boolean;
    color: MkColor;
    id: number;
    title: string;
    windowId: number;
}
