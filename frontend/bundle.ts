import tailwind from "bun-plugin-tailwind";

Bun.build({
  entrypoints: ["./index.html"],
  outdir: "./dist",
  publicPath: "/",
  env: "inline",
  minify: true,
  plugins: [tailwind],
});
