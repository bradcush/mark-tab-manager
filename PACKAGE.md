# `package.json` information

Listing the specific additional information or technical debt that should be
tracked and considered when making changes to the `package.json` file such as
with build scripts or package updates. This document is organized by section
mapping to the `package.json` properties directly.

## Development dependencies

- `typescript`: Currently locked at version `5.0.4` due to a restriction
  specified by `@typescript-eslint/typescript-estree` that the version of
  TypeScript must be below `5.1.0`.
