import { MkBrowser } from 'src/api/MkBrowser';

export function search(
    query: string
): Promise<MkBrowser.bookmarks.BookmarkTreeNode[]> {
    return new Promise((resolve, reject) => {
        chrome.bookmarks.search(query, (results) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            }
            resolve(results);
        });
    });
}
