import { getColor } from '../Color';

describe('tabGroups/Color', () => {
    const originalChrome = global.chrome;

    beforeEach(() => {
        // Mocking requires any assertion for setting tabGroups
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (global.chrome as any) = {
            tabGroups: {},
        };
    });
    afterEach(() => {
        global.chrome = originalChrome;
    });

    it('should use default colors if lacking support', () => {
        // Setting tabGroups requires any
        // eslint-disable-next-line
        (global.chrome as any).tabGroups = undefined;
        expect(getColor()).toMatchObject({
            BLUE: 'blue',
            CYAN: 'cyan',
            GREEN: 'green',
            GREY: 'grey',
            PINK: 'pink',
            PURPLE: 'purple',
            RED: 'red',
            YELLOW: 'yellow',
        });
    });

    it('should use system specified colors when supported', () => {
        const SystemColor = {
            ORIGINAL: 'original',
        };
        // Setting tabGroups requires any
        // eslint-disable-next-line
        (global.chrome as any).tabGroups.Color = SystemColor;
        expect(getColor()).toMatchObject(SystemColor);
    });
});
