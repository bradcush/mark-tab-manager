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

// TODO: We don't need a map and enum
export enum Color {
    BLUE = 'blue',
    CYAN = 'cyan',
    GREEN = 'green',
    GREY = 'grey',
    PINK = 'pink',
    PURPLE = 'purple',
    RED = 'red',
    YELLOW = 'yellow',
}

export function getTabGroupsColor(): Color {
    // tabGroups.Color value not yet in official typings
    /* eslint-disable @typescript-eslint/no-unsafe-return */
    /* @ts-expect-error There exists a constant not in typings */
    return chrome.tabGroups?.Color ?? ColorMap;
    /* eslint-enable @typescript-eslint/no-unsafe-return */
}
