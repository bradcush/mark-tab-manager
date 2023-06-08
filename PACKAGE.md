# `package.json` information

Listing the specific additional information or technical debt that should be
tracked and considered when making changes to the `package.json` file such as
with build scripts or package updates. This document is organized by section
mapping to the `package.json` properties directly.

## `devDependecies`

- `typescript`: Currently locked at `5.0.4` due to restriction specified by
  `@typescript-eslint/typescript-estree` that version must be below `5.1.0`
