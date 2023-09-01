import { getTabGroupsColor } from 'src/infra/browser/tab-groups/constants/colors';

/**
 * Type guard checking if a color
 * is valid for a tab group
 */
function isTabGroupsColorValid(
    color: string,
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

/**
 * Get the color based on each index so that each index will
 * retain the same color regardless of a group re-render
 */
export function getColorFromIndex(index: number) {
    const colorsByEnum = getTabGroupsColor();
    const colorKeys = Object.keys(colorsByEnum);
    const colors = colorKeys.map((colorKey) => colorKey.toLocaleLowerCase());
    const colorIdx = index % colorKeys.length;
    const color = colors[colorIdx];
    const defaultColor = 'grey';
    return isTabGroupsColorValid(color) ? color : defaultColor;
}
