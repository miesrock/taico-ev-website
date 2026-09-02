import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const websiteRoot = join(fileURLToPath(new URL("..", import.meta.url)));

const sourceFiles = (directory: string): string[] => readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  const path = join(directory, entry.name);
  return entry.isDirectory() ? sourceFiles(path) : /\.(astro|ts)$/.test(entry.name) ? [path] : [];
});

test("internal Contact links stay on the clean canonical URL", () => {
  const files = sourceFiles(join(websiteRoot, "src"));
  const contents = files.map((file) => [file, readFileSync(file, "utf8")] as const);
  const parameterizedLinks = contents.filter(([, content]) => content.includes("/contact/?"));

  assert.deepEqual(parameterizedLinks, []);
  assert.equal(contents.some(([, content]) => content.includes("contactHref")), false);
  assert.ok(contents.some(([, content]) => content.includes('href="/contact/"')));
});
