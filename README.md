# mark

Better bookmark and tab management

## Prerequisites

This repository requires [Yarn](https://yarnpkg.com/) to be installed

### Compatibility

`mark` is built as a [Manifest Version 3](https://developer.chrome.com/docs/extensions/mv3/intro/)
extension meaning that for Chrome, it's only supported in Chrome 88 and above.
Firefox, Edge Chromium, and other vendors currently plan to support this
version but there is no stable release with support at this time.

## Building

- Not minified with source maps: `yarn build:dev`
- Minified without source maps: `yarn build:prod`

## Testing

Unit tests without coverage are automatically run as part of the GitHub CI for
both a commit push and pull request. They are required for any pull request to
be merged into the `main` branch. Integration testing has been setup but there
is currently no need for any at the moment.

- Unit testing: `yarn test:unit`
- Unit testing w/ coverage: `yarn test:unit:coverage`

## Running

After having built the extension locally, using Chrome greater than version 88,
navigate to the `chrome://extensions` page and make sure "Developer mode" is
enabled in the top right of the window. Then clicking the button in the top
left of the window labeled `Load unpacked`, select the folder in the root of
this project named `dist`. If your extension is not automatically activated you
can click the toggle for the extension labeled `mark`.

### Onboarding

For additional functionality and control you can pin the extension to your
toolbar by clicking on the puzzle icon in the top right of your Chrome toolbar.
Then click the pin icon next to the extension labeled `mark` to pin it.
