# mark

Better bookmarks

## Prerequisites

This repository requires [Yarn](https://yarnpkg.com/) to be installed

## Building

`yarn build`

## Testing

Unit tests without coverage are automatically run as part of the GitHub CI for
both a commit push and pull request. They are required for any pull request to
be merged into the `main` branch. Integration testing has been setup but there
is currently no need for any at the moment.

- Unit testing: `yarn test:unit`
- Unit testing w/ coverage: `yarn test:unit:coverage`
