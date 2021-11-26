import { MkColor } from './MkColor';

export interface MkQueryInfo {
    collapsed?: boolean;
    color?: MkColor;
    title?: string;
    windowId?: number;
}

export interface MkTabGroup {
    collapsed: boolean;
    color: MkColor;
    title: string;
    windowId: number;
}
