import tailwind from "bun-plugin-tailwind";

Bun.build({
  entrypoints: ["./index.html"],
  outdir: "./dist",
  publicPath: "/",
  env: "inline",
  plugins: [tailwind]
});
