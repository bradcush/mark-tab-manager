export const ColorMap = {
    BLUE: 'blue',
    CYAN: 'cyan',
    GREEN: 'green',
    GREY: 'grey',
    PINK: 'pink',
    PURPLE: 'purple',
    RED: 'red',
    YELLOW: 'yellow',
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error tabGroups not yet in official typings
export const { tabGroups: { Color = ColorMap } = {} } = chrome;
