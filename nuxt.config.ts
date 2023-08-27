import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";
import { nodePolyfills } from "vite-plugin-node-polyfills";
//vue-dapp: https://vue-dapp-docs.netlify.app/configurations.html
import rollupPolyfillNode from "rollup-plugin-polyfill-node";
import nodeStdlibBrowser from "node-stdlib-browser";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    "@nuxthq/ui",
    [
      "@pinia/nuxt",
      {
        autoImports: ["defineStore", ["defineStore", "definePiniaStore"]],
      },
    ],
  ],
  colorMode: {
    preference: "system", // default theme
    dataValue: "theme", // activate data-theme in <html> tag
    classSuffix: "",
  },
  vite: {
    optimizeDeps: {
      include: ["debug"],
      exclude: ["@noir-lang/acvm_js", "@aztec/bb.js"],
      // Enable polyfill node used in development, refer to https://github.com/sodatea/vite-plugin-node-stdlib-browser/blob/b17f417597c313ecd52c3e420ba8fc33bcbdae20/index.cjs#L17
      esbuildOptions: {
        inject: [require.resolve("node-stdlib-browser/helpers/esbuild/shim")],
      },
    },
    build: {
      rollupOptions: {
        plugins: [
          // Enable rollup polyfills plugin used in production bundling, refer to https://stackoverflow.com/a/72440811/10752354
          rollupPolyfillNode(),
        ],
      },
      commonjsOptions: {
        transformMixedEsModules: true, // Enable @walletconnect/web3-provider which has some code in CommonJS
      },
    },
    resolve: {
      // Enable polyfill node used in development to prevent from vite's browser compatibility warning
      alias: { ...nodeStdlibBrowser },
    },
    plugins: [
      wasm(),
      topLevelAwait(),
      nodePolyfills({
        // To exclude specific polyfills, add them to this list.
        exclude: [
          "fs", // Excludes the polyfill for `fs` and `node:fs`.
        ],
        // Whether to polyfill specific globals.
        globals: {
          Buffer: true, // can also be 'build', 'dev', or false
          global: true,
          process: true,
        },
        // Whether to polyfill `node:` protocol imports.
        protocolImports: true,
      }),
    ],
  },
});
