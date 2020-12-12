// When the service worker starts
console.log('Service worker started');

// Example code to open a local web page in a
// service worker from an extension icon click
function handleWindowCreated() {
    console.log('handleWindowCreated');
}

function handleBrowserActionClicked() {
    console.log('handleBrowserActionClicked');
    const opts = {
        url: chrome.runtime.getURL('index.html'),
    };
    chrome.windows.create(opts, handleWindowCreated);
}

// https://developers.chrome.com/extensions/migrating_to_manifest_v3#actions
// @ts-expect-error Due to recent MV3 API change
chrome.action.onClicked.addListener(handleBrowserActionClicked);
