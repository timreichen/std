// deno-lint-ignore-file no-console
// Copyright 2018-2025 the Deno authors. MIT license.

import denoJson from "../deno.json" with { type: "json" };
import importMap from "../import_map.json" with { type: "json" };
import { join } from "@std/path";

const FAIL_FAST = Deno.args.includes("--fail-fast");

const imports = importMap.imports;

let failed = false;

/**
 * Checks whether import map has a correct entry for each workspace.
 */
for (const workspace of denoJson.workspace) {
  const denoJsonFilePath = join(Deno.cwd(), workspace, "deno.json");

  const { default: json } = await import(denoJsonFilePath, {
    with: { type: "json" },
  });

  const name = json.name as keyof typeof imports;
  const dependency = imports[name];

  if (!dependency) {
    console.warn(`No import map entry found for ${json.name}`);
    if (FAIL_FAST) Deno.exit(1);
    failed = true;
    continue;
  }

  const correctDependency = `jsr:${json.name}@^${json.version}`;
  if (dependency !== correctDependency) {
    console.warn(`Invalid import map entry for ${json.name}: ${dependency}`);
    console.warn(`Expected: ${correctDependency}`);
    if (FAIL_FAST) Deno.exit(1);
    failed = true;
  }
}

if (failed) Deno.exit(1);

console.log(
  `Checked import map for ${denoJson.workspace.length} workspace entries`,
);
