import { resetSandbox, sandboxPool } from "./sandboxDb.js";

async function main() {
  await resetSandbox();
  console.log("Sandbox database reset.");
  await sandboxPool.end();
}

main().catch(console.error);
