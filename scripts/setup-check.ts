import { execSync } from "node:child_process";
import { existsSync } from "node:fs";

console.log("Verificando ambiente de desenvolvimento...\n");

const checks = [
  {
    name: "Node.js",
    run: () => {
      const version = process.version;
      const major = parseInt(version.slice(1).split(".")[0] ?? "0", 10);
      if (major < 20) throw new Error(`Node ${version} — requer >= 20`);
      return version;
    },
  },
  {
    name: "Docker",
    run: () => execSync("docker --version", { encoding: "utf-8" }).trim(),
  },
  {
    name: ".env",
    run: () => {
      if (!existsSync(".env")) {
        throw new Error("arquivo .env não encontrado — copie .env.example");
      }
      return "arquivo encontrado";
    },
  },
];

let allPassed = true;

for (const check of checks) {
  try {
    const result = check.run();
    console.log(`  ✓ ${check.name}: ${result}`);
  } catch (error) {
    allPassed = false;
    const message = error instanceof Error ? error.message : String(error);
    console.log(`  ✗ ${check.name}: ${message}`);
  }
}

console.log(allPassed ? "\nAmbiente OK." : "\nCorrija os itens acima antes de continuar.");
process.exit(allPassed ? 0 : 1);
