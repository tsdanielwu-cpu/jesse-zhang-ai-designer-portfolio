import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const distOnlyAssetExcludes = [
  "assets/floral-particle-source.png",
  "assets/projects/flower-guangzhou/flower-purple-ruins-wide.png",
  "assets/projects/flower-guangzhou/flower-blue-white-wide.png",
  "assets/projects/flower-guangzhou/flower-gazebo-wide.png",
  "assets/projects/flower-guangzhou/flower-sunflower-wide.png",
  "assets/projects/flower-guangzhou/flower-purple-wide.png",
  "assets/projects/flower-guangzhou/flower-rose-wide.png",
  "assets/projects/virtual-daike/poster-main.png",
  "assets/projects/virtual-daike/ticket-new-year.png",
];

function removeGeneratedAssetCopies() {
  return {
    name: "remove-generated-asset-copies",
    closeBundle() {
      const outDir = path.resolve("dist");
      for (const rel of distOnlyAssetExcludes) {
        fs.rmSync(path.join(outDir, rel), { force: true });
      }

      const pixelRoot = path.join(outDir, "assets/projects/pixel-dwelling");
      for (const group of ["city", "forest", "ocean", "polar"]) {
        const dir = path.join(pixelRoot, group);
        if (!fs.existsSync(dir)) continue;
        for (const file of fs.readdirSync(dir)) {
          if (file.endsWith(".png")) {
            fs.rmSync(path.join(dir, file), { force: true });
          }
        }
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), removeGeneratedAssetCopies()],
});
