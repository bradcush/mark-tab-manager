# `package.json` information

Listing the specific additional information or technical debt that should be
tracked and considered when making changes to the `package.json` file such as
with build scripts or package updates. This document is organized by section
mapping to the `package.json` properties directly.

## `devDependecies`

- `@types/copy-webpack-plugin`: Currently locked at `6.4.0` due to breaking
  changes with return types specified in `6.4.1`. Webpack is expecting
  `WebpackPluginInstance` but receives `webpack.WebpackPluginInstance`.
- `terser-webpack-plugin`: Should be included as part of Webpack v5 out of the
  box but Webpack fails with `Cannot find module` error when building unless
  the dependency is installed separately. It's expected that there would be a
  top-level node module exposed but it seems there is only an internal
  `terser-webpack-plugin` dependency for Webpack itself.
