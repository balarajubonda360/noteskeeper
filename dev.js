import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(fileURLToPath(import.meta.url));
const processes = [
  {
    name: "API",
    cwd: path.join(root, "server"),
    args: ["server.js"],
  },
  {
    name: "Web",
    cwd: path.join(root, "client"),
    args: [path.join(root, "client", "node_modules", "vite", "bin", "vite.js"), "--host", "127.0.0.1"],
  },
];

const children = processes.map(({ name, cwd, args }) => {
  const child = spawn(process.execPath, args, { cwd, stdio: "inherit", env: process.env });
  child.on("error", (error) => {
    console.error(`[${name}] failed to start: ${error.message}`);
    stopAll(1);
  });
  child.on("exit", (code, signal) => {
    if (!stopping) {
      console.error(`[${name}] stopped (${signal ?? code ?? "unknown status"}); stopping both services.`);
      stopAll(code || 1);
    }
  });
  return child;
});

let stopping = false;
function stopAll(exitCode = 0) {
  if (stopping) return;
  stopping = true;
  for (const child of children) {
    if (!child.killed) child.kill();
  }
  process.exitCode = exitCode;
}

process.on("SIGINT", () => stopAll(0));
process.on("SIGTERM", () => stopAll(0));

console.log("Starting InkVault services in this terminal:");
console.log("  Web: http://localhost:5173");
console.log("  API: http://localhost:5000/api/health");
