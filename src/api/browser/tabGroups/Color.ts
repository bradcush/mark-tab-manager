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

// @ts-expect-error Currently in Beta channel
export const { tabGroups: { Color = ColorMap } = {} } = chrome;
