import { tabsMove } from 'src/infra/browser/tabs/move';

/**
 * Update position of tabs in the tab bar
 * retaining their respective windows
 */
export function tabsRender(
    tabs: {
        identifier?: number;
        windowId?: number;
    }[],
): void {
    tabs.forEach(({ identifier, windowId }) => {
        if (!identifier) {
            throw new Error('No id for sorted tab');
        }
        const baseMoveProperties = { index: -1 };
        // Browser defaults to the window of the current tab
        const staticWindowMoveProperties = { windowId };
        const moveProperties =
            typeof windowId !== 'undefined'
                ? { ...baseMoveProperties, ...staticWindowMoveProperties }
                : baseMoveProperties;
        void tabsMove(identifier, moveProperties);
    });
}
