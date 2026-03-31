import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  target: "node20",
  platform: "node",
  outDir: "dist",
  clean: true,
  // Bundle everything except node built-ins
  bundle: true,
  // Don't bundle these -- they're runtime dependencies installed via npm
  external: [
    "react",
    "ink",
    "@modelcontextprotocol/sdk",
    "commander",
    "zod",
  ],
  // Handle .tsx files
  esbuildOptions(options) {
    options.jsx = "automatic";
  },
  // Add shebang for CLI binary
  banner: {
    js: "#!/usr/bin/env node",
  },
});
