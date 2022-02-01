import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
  plugins: [
    VitePWA({
      includeAssets: [
        "favicon.svg",
        "favicon-mask.svg",
        "favicon.ico",
        "apple-touch-icon.png",
        "icons/pwa-maskable-512x512.png",
        "icons/apple-touch-icon-152x152.png",
        "icons/apple-touch-icon-167x167.png",
        "icons/apple-touch-icon-180x180.png",
        "icons/favicon-16x16.png",
        "icons/favicon-32x32.png",
        "icons/favicon-48x48-android.png",
        "icons/favicon-64x64.png",
        "icons/favicon-128x128.png",
        "icons/favicon-192x192-android.png",
        "icons/favicon-196x196-android.png",
        "icons/mstile-150x150.png",
        "icons/pwa-192x192.png",
        "icons/pwa-256x256.png",
        "icons/pwa-512x512.png",
        "fonts/Inter-roman.var.3_19.woff2",
        "robots.txt"
      ],
      manifest: {
        name: "Ok Color Picker",
        short_name: "Color Picker",
        description: "Color picker based on Okhsv and Okhsl (Oklab).",
        theme_color: "#3a3a3a",
        background_color: "#3a3a3a",
        icons: [
          {
            src: "icons/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "icons/pwa-256x256.png",
            sizes: "256x256",
            type: "image/png"
          },
          {
            src: "icons/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png"
          },
          {
            src: "icons/pwa-maskable-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable"
          }
        ]
      }
    }),
    viteSingleFile()
  ],
  build: {
    assetsInlineLimit: 100000000,
    chunkSizeWarningLimit: 100000000,
    cssCodeSplit: false,
    brotliSize: false,
    rollupOptions: {
      inlineDynamicImports: true,
      output: {
        manualChunks: () => "everything.js"
      }
    }
  }
});
