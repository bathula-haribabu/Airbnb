import { accessSync } from "fs";
function must(path) {
  try {
    accessSync(path);
  } catch {
    console.error("Missing:", path);
    process.exit(1);
  }
}
must("node_modules/mongoose/package.json");
must("node_modules/mongoose/lib/index.js");
must("node_modules/mongoose/lib/schema/union.js");
must("node_modules/mongodb/lib/index.js");
must(
  "node_modules/mongodb/lib/cmap/auth/mongodb_oidc/azure_machine_workflow.js"
);
console.log("Dependency integrity OK");
