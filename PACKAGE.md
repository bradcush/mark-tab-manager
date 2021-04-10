# `package.json` information

Listing the specific additional information or technical debt that should be
tracked and considered when making changes to the `package.json` file such as
with build scripts or package updates. This document is organized by section
mapping to the `package.json` properties directly.

## `devDependecies`

- `@types/copy-webpack-plugin`: Currently locked at `6.4.0` due to breaking
  changes with return types specified in `6.4.1`. `webpack` is expecting
  `WebpackPluginInstance` but receives `webpack.WebpackPluginInstance`.
