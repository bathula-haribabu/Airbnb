import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

function must(p) {
  if (!fs.existsSync(p)) {
    console.error("Missing:", p);
    process.exit(1);
  }
}

const base = "node_modules";
must(path.join(base, "mongoose", "package.json"));
must(path.join(base, "mongodb", "lib", "index.js"));

// Try to resolve internal 'union' module directly (will throw if missing/corrupt)
try {
  const unionPath = path.join(base, "mongoose", "lib", "schema", "union.js");
  if (fs.existsSync(unionPath)) {
    console.log("Found union.js");
  } else {
    // Fallback: check schema index still loads (different version may inline union)
    await import(
      pathToFileURL(path.join(base, "mongoose", "lib", "schema", "index.js"))
    );
    console.log(
      "schema/index.js loads (union.js not present in this version) – OK"
    );
  }
} catch (e) {
  console.error("Failed loading mongoose schema internals:", e.message);
  process.exit(1);
}

console.log("Dependency integrity OK");
