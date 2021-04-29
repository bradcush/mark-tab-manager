import { MkColor } from './MkColor';

const ColorMap = {
    BLUE: 'blue',
    CYAN: 'cyan',
    GREEN: 'green',
    GREY: 'grey',
    PINK: 'pink',
    PURPLE: 'purple',
    RED: 'red',
    YELLOW: 'yellow',
};

export function makeColor(): MkColor {
    // tabGroups not yet in official typings
    /* eslint-disable-next-line */ /* @ts-expect-error */
    return chrome.tabGroups?.Color ?? ColorMap;
}
