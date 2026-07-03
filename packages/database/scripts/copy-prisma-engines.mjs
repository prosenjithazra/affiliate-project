import { copyFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const sourceDir = join(packageRoot, "node_modules", ".prisma", "client");
const targetDir = join(packageRoot, "node_modules", "@prisma", "client");

if (!existsSync(sourceDir) || !existsSync(targetDir)) {
  process.exit(0);
}

mkdirSync(targetDir, { recursive: true });

for (const fileName of readdirSync(sourceDir)) {
  if (fileName === "schema.prisma" || fileName.startsWith("libquery_engine-")) {
    copyFileSync(join(sourceDir, fileName), join(targetDir, fileName));
  }
}
