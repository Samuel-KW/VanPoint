import { defineConfig } from "vite";

export default defineConfig({
	build: {
		outDir: "dist",
		assetsDir: "static",
		minify: "terser",
		sourcemap: false,
		rollupOptions: {
			output: {
				entryFileNames: `[name].[hash].js`,
				chunkFileNames: `[name].[hash].js`,
				assetFileNames: `[name].[hash].[ext]`
			}
		},
		target: "baseline-widely-available",
	},
});