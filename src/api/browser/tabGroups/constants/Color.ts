import { MkColor } from '../MkColor';

const ColorMap = {
    BLUE: 'blue',
    CYAN: 'cyan',
    GREEN: 'green',
    GREY: 'grey',
    ORANGE: 'orange',
    PINK: 'pink',
    PURPLE: 'purple',
    RED: 'red',
    YELLOW: 'yellow',
};

/**
 * Type guard checking if a color
 * is valid for a tab group
 */
export function isColorValid(
    color: string
): color is chrome.tabGroups.ColorEnum {
    const colors = [
        'blue',
        'cyan',
        'green',
        'grey',
        'orange',
        'pink',
        'purple',
        'red',
        'yellow',
    ];
    return colors.includes(color);
}

export function getColor(): MkColor {
    // tabGroups.Color value not yet in official typings
    /* eslint-disable-next-line */ /* @ts-expect-error */
    return chrome.tabGroups?.Color ?? ColorMap;
}
