import { fileURLToPath, URL } from "node:url";
import { resolve } from "path";
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  showEnvDetail(env);
  return {
    plugins: [
      vue(),
      Components({
        resolvers: [
          AntDesignVueResolver({
            importStyle: false, // css in js
          }),
        ],
        dirs: ["src/components"],
        extensions: ["vue"],
        deep: true,
      }),
      AutoImport({
        resolvers: [AntDesignVueResolver()],
        imports: ["vue", "vue-router", "pinia", "vue-i18n"],
        dirs: [
          "src/hooks",
          "src/http",
          "src/router",
          "src/models",
          "src/services",
          "src/stores",
          "src/utils",
          "src/components",
          "src/constants",
          "src/language",
        ],
        dts: true,
      }),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
        "@assets": resolve(__dirname, "src", "assets"),
        "vue-i18n": "vue-i18n/dist/vue-i18n.cjs.js",
      },
    },
    define: {
      "process.env": env,
    },
    build: {
      rollupOptions: {
        output: {
          entryFileNames: `assets/[name].[hash].js`,
          chunkFileNames: `assets/[name].[hash].js`,
          assetFileNames: `assets/[name].[hash].[ext]`,
        },
        plugins: [],
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler", // or 'modern'
        },
      },
    },

    server: {
      port: 8888,
      host: "0.0.0.0",
      proxy: {
        "/localty": {
          target: "http://aspaewp00025355:8696",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/localty/, ""), // 路径重写
        },
      },
    },
  };
});

function showEnvDetail(env: { [key: string]: string }): void {
  console.log("\x1B[32m ***** Environment Message ***** \x1B[0m ");
  for (const key in env) {
    console.log(`\x1B[32m ${key}: \x1B[0m `, `\x1B[36m${env[key]}\x1B[0m`);
  }
}
