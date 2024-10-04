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
        visibleTyping: "/visible-typing/index.html",
        musicVj: "/music-vj/index.html",
        heartbeats: "/heartbeats/index.html",
      },
    },
  },
}
