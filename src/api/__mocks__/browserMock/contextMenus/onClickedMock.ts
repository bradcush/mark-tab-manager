import { browserMockListeners } from 'src/api/__mocks__/browserMockListeners';
import { MkBrowser } from 'src/api/MkBrowser';

export function onClickedMock(info: MkBrowser.contextMenus.OnClickedData) {
    const { onClickedListeners } = browserMockListeners.contextMenus;
    onClickedListeners.forEach((onClickedListener) => {
        const tab = {} as MkBrowser.tabs.Tab;
        onClickedListener(info, tab);
    });
}
