---
name: API server data file paths
description: How to correctly reference data files in the API server after esbuild bundling
---

The API server is bundled with esbuild into dist/index.mjs. After bundling, __dirname points to the dist/ directory, NOT the source directory. Any data files (JSON, etc.) referenced by path must use process.cwd() instead.

**Why:** esbuild bundles src/ into dist/index.mjs. The banner in build.mjs sets globalThis.__dirname = dirname of the bundle output, which is artifacts/api-server/dist/. Data files placed in artifacts/api-server/data/ are not inside dist/, so __dirname-relative paths break.

**How to apply:** Always use `path.resolve(process.cwd(), "data/filename.json")` for data files. Place data files in `artifacts/api-server/data/` (not src/data/). The server's working directory is artifacts/api-server/ when run via pnpm dev.
