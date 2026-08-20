// @ts-check
import { defineConfig } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import { resolve } from "path";
import remarkMath from "remark-math";
import rehypeMathjax from "rehype-mathjax";

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";
import tailwindcss from "@tailwindcss/vite";
import { pagefind } from "vite-plugin-pagefind";

import { BASE, SITE } from "./src/config.ts";

import {
  transformerMetaHighlight,
  transformerNotationHighlight,
} from "@shikijs/transformers";

// https://astro.build/config
export default defineConfig({
  vite: {
    resolve: {
      alias: {
        $components: resolve("./src/components"),
        $layouts: resolve("./src/layouts"),
        $pages: resolve("./src/pages"),
        $assets: resolve("./src/assets"),
        $content: resolve("./src/content"),
      },
    },
    ssr: {
      noExternal: [BASE + "/pagefind/pagefind.js"],
    },
    plugins: [tailwindcss(), pagefind({ outputDirectory: "dist" })],
    build: {
      rollupOptions: {
        external: [BASE + "/pagefind/pagefind.js"],
      },
    },
  },

  integrations: [mdx(), sitemap(), svelte()],

  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeMathjax],
    }),
    shikiConfig: {
      // Choose from Shiki's built-in themes (or add your own)
      // https://shiki.style/themes
      // Alternatively, provide multiple themes
      // See note below for using dual light/dark themes
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
      defaultColor: false,
      transformers: [
        transformerMetaHighlight(),
        transformerNotationHighlight(),
      ],
      wrap: true,
    },
  },

  prefetch: {
    prefetchAll: true,
  },
  site: SITE,
  base: BASE,
  output: "static",
});
