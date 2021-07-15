# `manifest.json` files

A manifest file is required to be included with any packaged extension,
declaring metadata about the extension itself, it's resources, and the
permissions required for it to function among other things. Manifests contain
specifics about the manifest version and browser the extension is built for.

## Generate script

Manifest files are intended to be generated and placed in a generated code
folder along with any other pre-built files, prior to the extension being
built using webpack. We expect during the later building of the extension that
any generated files will be copied to their final destination.

The `generate.ts` script is run using `ts-node`:

``` sh
# Generate manifest file Chromium browsers
ts-node meta/manifest/generate.ts --browser chromium
```
