// import { rmSync } from 'node:fs'
// import path from 'node:path'
// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import electron from 'vite-plugin-electron'
// import renderer from 'vite-plugin-electron-renderer'
// import pkg from './package.json'
// import { minify } from 'terser';


// // https://vitejs.dev/config/
// export default defineConfig(({ command }) => {
//   rmSync('dist-electron', { recursive: true, force: true })

//   const isServe = command === 'serve'
//   const isBuild = command === 'build'
//   const sourcemap = isServe || !!process.env.VSCODE_DEBUG

//   return {
//     resolve: {
//       alias: {
//         '@': path.join(__dirname, 'src')
//       },
//     },
//     plugins: [
//       react(),
//       electron([
//         {
//           // Main-Process entry file of the Electron App.
//           entry: 'electron/main/index.ts',
//           onstart(options) {
//             if (process.env.VSCODE_DEBUG) {
//               console.log(/* For `.vscode/.debug.script.mjs` */'[startup] Electron App')
//             } else {
//               options.startup()
//             }
//           },
//           vite: {
//             build: {
//               sourcemap,
//               minify: 'terser',
//               terserOptions: {
//                 ecma: 2020,
//                 compress: {
//                   arrows: true,
//                   booleans: true,
//                   collapse_vars: true,
//                   evaluate: true,
//                   inline: true,
//                   loops: true,
//                   passes: 3,
//                   reduce_funcs: true,
//                   reduce_vars: true,
//                   typeofs: true,
//                   unsafe: true,
//                   unsafe_arrows: true,
//                   unsafe_comps: true,
//                   unsafe_Function: true,
//                   unsafe_math: true,
//                   unsafe_methods: true,
//                   unsafe_proto: true,
//                   unsafe_regexp: true,
//                   unsafe_undefined: true,
//                   unused: true,
//                 },
//                 keep_classnames: false,
//                 keep_fnames: false,
//                 module: false,
//                 mangle: {
//                   properties: false,
//                   toplevel: true,
//                 },
//                 },
//               outDir: 'dist-electron/main',
//               rollupOptions: {
//                 external: [
//                   ...Object.keys(pkg.dependencies || {}),
//                   ...Object.keys(pkg.devDependencies || {}),
//                   // Add any other external dependencies as needed
//                 ],
                
//               },
//             },
//           },
//         },
//         {
//           entry: 'electron/main/preload.js',
//           onstart(options) {
//             // Notify the Renderer-Process to reload the page when the Preload-Scripts build is complete, 
//             // instead of restarting the entire Electron App.
//             options.reload()
//           },
//           vite: {
//             build: {
//               sourcemap: sourcemap ? 'inline' : undefined, // #332
//               minify: isBuild,
//               outDir: 'dist-electron/preload',
//               rollupOptions: {
//                 external: Object.keys('dependencies' in pkg ? pkg.dependencies : {}),
//               },
//             },
//           },
//         }
//       ]),
//       // Use Node.js API in the Renderer-process
//       renderer(),
//     ],
//     server: process.env.VSCODE_DEBUG && (() => {
//       const url = new URL(pkg.debug.env.VITE_DEV_SERVER_URL)
//       return {
//         host: url.hostname,
//         port: +url.port,
//       }
//     })(),
//     clearScreen: false,
//   }
// })
import { rmSync, copySync } from 'fs-extra'; // Use fs-extra for file operations
import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import electron from 'vite-plugin-electron';
import renderer from 'vite-plugin-electron-renderer';
import pkg from './package.json';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  // Clean the dist-electron directory before each build
  rmSync('dist-electron', { recursive: true, force: true });

  const isServe = command === 'serve';
  const isBuild = command === 'build';
  const sourcemap = isServe || !!process.env.VSCODE_DEBUG;

  return {
    resolve: {
      alias: {
        '@': path.join(__dirname, 'src')
      },
    },
    plugins: [
      react(),
      electron([
        {
          entry: 'electron/main/index.ts',
          onstart(options) {
            if (process.env.VSCODE_DEBUG) {
              console.log('[startup] Electron App');
            } else {
              options.startup();
            }
          },
          vite: {
            build: {
              sourcemap,
              minify: isBuild,
              outDir: 'dist-electron/main',
              rollupOptions: {
                external: [
                  ...Object.keys(pkg.dependencies || {}),
                  ...Object.keys(pkg.devDependencies || {}),
                ],
              },
            },
          },
        },
        {
          entry: 'electron/preload/index.ts',
          onstart(options) {
            options.reload();
          },
          vite: {
            build: {
              sourcemap: sourcemap ? 'inline' : undefined,
              minify: isBuild,
              outDir: 'dist-electron/preload',
              rollupOptions: {
                external: Object.keys(pkg.dependencies || {}),
              },
            },
          },
        }
      ]),
      renderer(),
    ],
    server: process.env.VSCODE_DEBUG && (() => {
      const url = new URL(pkg.debug.env.VITE_DEV_SERVER_URL);
      return {
        host: url.hostname,
        port: +url.port,
      };
    })(),
    clearScreen: false,
    // Hook into Vite's buildEnd event to copy the preload.js file to the main output directory after the build is complete
    buildEnd: () => {
      copySync(
        path.resolve(__dirname, 'dist-electron/preload/preload.js'),
        path.resolve(__dirname, 'dist-electron/main/preload.js')
      );
    },
  };
});
