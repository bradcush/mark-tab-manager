# Mark tab manager

![version](https://img.shields.io/github/package-json/v/bradcush/mark-tab-manager)
![test](https://img.shields.io/github/actions/workflow/status/bradcush/mark-tab-manager/test.yml?branch=main&label=test)
![lint](https://img.shields.io/github/actions/workflow/status/bradcush/mark-tab-manager/lint.yml?branch=main&label=lint)
![users](https://img.shields.io/chrome-web-store/users/filgplhfalgafolkffphilkgckdgnona)
![license](https://img.shields.io/github/license/bradcush/mark-tab-manager)

The missing tab manager

## Store listings

Compatible with any browser powered by Chromium

- [Chrome Web Store](https://chrome.google.com/webstore/detail/mark-tab-manager/filgplhfalgafolkffphilkgckdgnona)
- [Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/honey/kipehcooiafbjodbhddcmhpcgfoafpjm)

## Prerequisites

This repository requires [Bun](https://bun.sh/) to be installed which is a
drop-in replacement for any JavaScript bundler, transpiler, and runtime.
Dependencies can be installed using `bun install` before building from source.

### Compatibility

Mark is built as a [Manifest Version 3](https://developer.chrome.com/docs/extensions/mv3/intro/)
browser extension meaning that for Chrome, it's only supported in Chrome 89 and
above. Edge Chromium is also supported in versions using the same Chromium
version shipped in Chrome 89. This includes most versions of any Chromium based
browser that also support a native grouping user interface. Firefox and Safari
both support Manifest Version 3 but do not support native tab groups.

## Manifest files

See the [MANIFEST.md](meta/manifest/MANIFEST.md) for information on
manifest files in general, the overall manifest generation process, and
associated generate script with examples.

## Building

- Not minified with source maps: `bun build:dev`
- Minified without source maps: `bun build:prod`

## Testing

Unit tests without coverage are automatically run as part of the GitHub CI for
both a commit push and pull request. They are required for any pull request to
be merged into the `main` branch. Integration testing has been setup but there
is currently no need for any at the moment.

- Unit testing: `bun test:unit`
- Unit testing w/ coverage: `bun test:unit:coverage`

## Linting

Linting using `eslint` is also automatically run as part of the GitHub CI for
both a commit push and pull request. They are also run locally before
committing using a pre-commit hook. There must be no errors for any pull
request to be merged into the main branch.

- Linting: `bun lint`
- Lint auto-fix: `bun lint:fix`

## Running

After having built the extension locally, using Chrome greater than version 88,
navigate to the `chrome://extensions` page and make sure "Developer mode" is
enabled in the top right of the window. Then clicking the button in the top
left of the window labeled "Load unpacked", select the folder in the root of
this project named `dist`. If your extension is not automatically activated you
can click the toggle for the extension labeled "Mark tab manager".

### Onboarding

For additional functionality and control you can pin the extension to your
toolbar by clicking on the puzzle icon in the top right of your Chrome toolbar.
Then click the pin icon next to the extension labeled "Mark tab manager".

## Dependency information

See the [PACKAGE.md](PACKAGE.md) for `package.json` information

## Releasing

Creating a [release version](https://github.com/bradcush/mark-tab-manager/releases)
is done by pushing a tag on the `main` branch representing that specific
version following the accepted format. (eg. `v0.1.43`) Only explicit
collaborators have been given the necessary permission to push these tags.

*Note: Versions in the `package.json` and extension manifest file should be
incremented manually and merged in a pull request prior to releasing in order
to match the subsequent release tag.*

## License

[Mark Apache License 2.0](LICENSE)
