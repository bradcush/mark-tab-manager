import { MkTestUpdateBadgeParams } from './MkTestUpdateBadge';
import { counterBrowserMock } from 'src/bookmarks/__mocks__/counterBrowserMock';

export function testUpdateBadge({
    color,
    text,
    timesCalled,
}: MkTestUpdateBadgeParams) {
    const { setBadgeBackgroundColor, setBadgeText } = counterBrowserMock.action;
    expect(setBadgeBackgroundColor).toHaveBeenCalledTimes(timesCalled);
    const backgroundDetails = { color };
    expect(setBadgeBackgroundColor).toHaveBeenCalledWith(
        backgroundDetails,
        expect.any(Function)
    );
    expect(setBadgeText).toHaveBeenCalledTimes(timesCalled);
    const textDetails = { text };
    expect(setBadgeText).toHaveBeenCalledWith(
        textDetails,
        expect.any(Function)
    );
}
