import { execSync } from "node:child_process";

if (process.env.NODE_ENV === "production") {
  console.error("db:reset não pode ser executado em produção.");
  process.exit(1);
}

console.log("Resetando banco de dados local...");

try {
  execSync("npx prisma migrate reset --force", { stdio: "inherit" });
  console.log("Banco resetado com sucesso.");
} catch {
  console.error("Falha ao resetar banco. Verifique se o Docker está rodando.");
  process.exit(1);
}
