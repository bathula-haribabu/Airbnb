import { accessSync } from "fs";
try {
  accessSync("node_modules/mongoose/lib/schema/union.js");
  console.log("Mongoose integrity OK");
} catch {
  console.error("Mongoose file missing. Failing fast.");
  process.exit(1);
}
