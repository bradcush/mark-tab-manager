# Package JSON information

Listing the specific additional information or technical debt that should be
tracked and considered when making changes to the `package.json` file such as
with build script or package updates for example. This document is organized by
section mapping to the `package.json` files directly.

# scripts

- The jest `--coverage` option used by itself wasn't reporting code coverage
  for files that were actually being tested. A temporary fix was to use this in
  conjunction with the `--no-cache` option which included that info. See the
  [related issue in github](https://github.com/facebook/jest/issues/10800#issue-739132209)
  for more information.

# devDependencies

- Jest hangs and doesn't exit after tests are finished running when using the
  latest version. We've decided to target `^24.0.13` which was used in other
  projects and works fine at this time of writing. See the
  [related issue in github](https://github.com/facebook/jest/issues/9473#issuecomment-721366521)
  for more information.
