/** @type {import('vite').UserConfig} */

export default {
  server: {
    port: 2333,
  },
  root: "./src",
  publicDir: "../public",
  base: "/creative-computing/",
  build: {
    outDir: "../docs",
    rollupOptions: {
      input: {
        main: "/index.html",
        clock: "/clock/index.html",
      },
    },
  },
}
