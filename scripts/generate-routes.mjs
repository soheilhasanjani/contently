#!/usr/bin/env node
/**
 * Scans `src/app` for `page.tsx` files and generates typed route helpers.
 *
 * Usage:
 *   node scripts/generate-routes.mjs
 *   node scripts/generate-routes.mjs --watch
 */

import { watch } from "node:fs";
import { mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import config from "./routes.config.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

/**
 * @typedef {{
 *   appDir: string;
 *   localeSegment: string;
 *   outputFile: string;
 *   aliases: Record<string, { key: string[]; searchParams?: string[] }>;
 *   extraRoutes: Array<{ path: string; key: string[]; searchParams?: string[] }>;
 *   defaultNextKey: string[];
 *   publicPaths: string[];
 * }} RoutesConfig
 */

/**
 * @typedef {{
 *   path: string;
 *   key: string[];
 *   params: string[];
 *   searchParams: string[];
 * }} RouteEntry
 */

async function walk(dir) {
  /** @type {string[]} */
  const files = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return files;
  }

  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(full)));
    } else if (entry.isFile() && /^page\.(tsx|jsx|ts|js)$/.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

function toCamelCase(segment) {
  return segment.replace(/-([a-z0-9])/gi, (_, c) => c.toUpperCase());
}

/**
 * @param {string} absolutePagePath
 * @returns {RouteEntry | null}
 */
function pageFileToRoute(absolutePagePath) {
  const appDir = path.join(root, config.appDir);
  const rel = path.relative(appDir, path.dirname(absolutePagePath));
  const parts = rel.split(path.sep).filter(Boolean);

  if (parts[0] !== config.localeSegment) {
    return null;
  }

  /** @type {string[]} */
  const urlParts = [];
  /** @type {string[]} */
  const keyParts = [];
  /** @type {string[]} */
  const params = [];

  for (const part of parts.slice(1)) {
    if (/^\(.*\)$/.test(part)) {
      continue; // route groups
    }

    const optionalCatchAll = part.match(/^\[\[\.\.\.(.+)\]\]$/);
    const catchAll = part.match(/^\[\.\.\.(.+)\]$/);
    const dynamic = part.match(/^\[(.+)\]$/);

    if (optionalCatchAll) {
      const name = optionalCatchAll[1];
      urlParts.push(`\${params.${name}.map(encodeURIComponent).join("/")}`);
      keyParts.push(toCamelCase(name));
      params.push(name);
    } else if (catchAll) {
      const name = catchAll[1];
      urlParts.push(`\${params.${name}.map(encodeURIComponent).join("/")}`);
      keyParts.push(toCamelCase(name));
      params.push(name);
    } else if (dynamic) {
      const name = dynamic[1];
      urlParts.push(`\${encodeURIComponent(params.${name})}`);
      keyParts.push(toCamelCase(name));
      params.push(name);
    } else {
      urlParts.push(part);
      keyParts.push(toCamelCase(part));
    }
  }

  const pathname = urlParts.length === 0 ? "/" : `/${urlParts.join("/")}`;
  const alias = config.aliases[pathname];

  return {
    path: pathname,
    key: alias?.key ?? (keyParts.length ? keyParts : ["index"]),
    params,
    searchParams: alias?.searchParams ?? [],
  };
}

/**
 * @param {RouteEntry[]} entries
 * @returns {RouteEntry[]}
 */
function mergeExtras(entries) {
  const byPath = new Map(entries.map((e) => [staticPathKey(e.path), e]));

  for (const extra of config.extraRoutes) {
    const key = staticPathKey(extra.path);
    if (!byPath.has(key)) {
      byPath.set(key, {
        path: extra.path,
        key: extra.key,
        params: [],
        searchParams: extra.searchParams ?? [],
      });
    }
  }

  return [...byPath.values()].sort((a, b) => a.path.localeCompare(b.path));
}

/** Path without template interpolations, for Map keys / allowlist. */
function staticPathKey(routePath) {
  return routePath.includes("${") ? routePath : routePath;
}

/**
 * @param {string} routePath
 * @param {string[]} params
 * @param {string[]} searchParams
 * @param {number} indentDepth — property indent inside `routes` object
 */
function buildFunctionBody(routePath, params, searchParams, indentDepth) {
  const pad = "  ".repeat(indentDepth);
  const inner = "  ".repeat(indentDepth + 1);
  const hasParams = params.length > 0;
  const hasSearch = searchParams.length > 0;

  if (!hasParams && !hasSearch) {
    return `() => ${JSON.stringify(routePath)}`;
  }

  /** @type {string[]} */
  const typeFields = [];
  for (const p of params) {
    typeFields.push(`${p}: string | number`);
  }
  for (const s of searchParams) {
    typeFields.push(`${s}?: string`);
  }

  const argType = `{ ${typeFields.join("; ")} }`;

  if (!hasParams && hasSearch) {
    const lines = [
      `(opts?: ${argType}) => {`,
      `${inner}if (!opts) return ${JSON.stringify(routePath)};`,
      `${inner}const sp = new URLSearchParams();`,
    ];
    for (const s of searchParams) {
      lines.push(
        `${inner}if (opts.${s} != null && opts.${s} !== "") sp.set(${JSON.stringify(s)}, opts.${s});`,
      );
    }
    lines.push(`${inner}const q = sp.toString();`);
    const withQuery =
      routePath === "/" ? "`/?${q}`" : `\`${routePath}?\${q}\``;
    lines.push(
      `${inner}return q ? ${withQuery} : ${JSON.stringify(routePath)};`,
    );
    lines.push(`${pad}}`);
    return lines.join("\n");
  }

  const template = routePath.includes("${")
    ? `\`${routePath}\``
    : JSON.stringify(routePath);

  if (!hasSearch) {
    return `(params: ${argType}) => ${template}`;
  }

  const lines = [
    `(params: ${argType}) => {`,
    `${inner}const pathname = ${template};`,
    `${inner}const sp = new URLSearchParams();`,
  ];
  for (const s of searchParams) {
    lines.push(
      `${inner}if (params.${s} != null && params.${s} !== "") sp.set(${JSON.stringify(s)}, String(params.${s}));`,
    );
  }
  lines.push(`${inner}const q = sp.toString();`);
  lines.push(`${inner}return q ? \`\${pathname}?\${q}\` : pathname;`);
  lines.push(`${pad}}`);
  return lines.join("\n");
}

function depthForKey(key) {
  return key.length;
}

/**
 * @param {RouteEntry[]} entries
 */
function buildRoutesObjectLiteral(entries) {
  /** @type {any} */
  const tree = {};

  for (const entry of entries) {
    let node = tree;
    for (let i = 0; i < entry.key.length - 1; i++) {
      const part = entry.key[i];
      if (!node[part] || typeof node[part] === "string") {
        node[part] = {};
      }
      node = node[part];
    }
    const leaf = entry.key[entry.key.length - 1];
    node[leaf] = {
      __fn: buildFunctionBody(
        entry.path,
        entry.params,
        entry.searchParams,
        depthForKey(entry.key),
      ),
      __path: entry.path,
    };
  }

  return renderTree(tree, 1);
}

/**
 * @param {any} node
 * @param {number} depth
 */
function renderTree(node, depth) {
  const indent = "  ".repeat(depth);
  const entries = Object.entries(node);
  const lines = entries.map(([key, value]) => {
    if (value && typeof value === "object" && value.__fn) {
      return `${indent}${key}: ${value.__fn},`;
    }
    return `${indent}${key}: {\n${renderTree(value, depth + 1)}\n${indent}},`;
  });
  return lines.join("\n");
}

/**
 * @param {string[]} key
 * @param {RouteEntry[]} entries
 */
function keyToAccessor(key, entries) {
  const match = entries.find(
    (e) => e.key.length === key.length && e.key.every((k, i) => k === key[i]),
  );
  if (!match) {
    throw new Error(
      `defaultNextKey ${JSON.stringify(key)} does not match any generated route`,
    );
  }
  return `routes.${key.join(".")}`;
}

/**
 * @param {RouteEntry[]} entries
 */
function generateSource(entries) {
  const publicPaths = new Set(config.publicPaths ?? ["/", "/unauthorized", "/access-denied"]);
  const nextAllowlist = entries
    .map((e) => e.path)
    .filter((p) => !p.includes("${") && !publicPaths.has(p))
    .sort();

  const fallbackAccessor = keyToAccessor(config.defaultNextKey, entries);
  const routesLiteral = buildRoutesObjectLiteral(entries);

  return `/* eslint-disable */
/**
 * THIS FILE IS AUTO-GENERATED by \`scripts/generate-routes.mjs\`.
 * Do not edit by hand. It is gitignored and recreated on dev/build.
 *
 * Config: scripts/routes.config.mjs
 * Regenerate: npm run routes:generate
 */

export const panelNextAllowlist = [
${nextAllowlist.map((p) => `  ${JSON.stringify(p)},`).join("\n")}
] as const;

export type PanelNextPath = (typeof panelNextAllowlist)[number];

function isPanelNextPath(value: string): value is PanelNextPath {
  return (panelNextAllowlist as readonly string[]).includes(value);
}

/** Honor \`next\` only when it matches the panel allowlist; else panel default. */
export function resolveNextPath(next: string | null | undefined): string {
  if (next && isPanelNextPath(next)) {
    return next;
  }
  return ${fallbackAccessor}();
}

export const routes = {
${routesLiteral}
} as const;
`;
}

export async function generateRoutes() {
  const appDir = path.join(root, config.appDir);
  const pages = await walk(appDir);
  /** @type {RouteEntry[]} */
  const scanned = [];

  for (const file of pages) {
    const route = pageFileToRoute(file);
    if (route) scanned.push(route);
  }

  const entries = mergeExtras(scanned);
  const source = generateSource(entries);
  const outPath = path.join(root, config.outputFile);

  await mkdir(path.dirname(outPath), { recursive: true });
  await writeFile(outPath, source, "utf8");

  console.log(
    `[routes] generated ${config.outputFile} (${entries.length} routes)`,
  );
}

function debounce(fn, ms) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

async function main() {
  const watchMode = process.argv.includes("--watch");
  await generateRoutes();

  if (!watchMode) return;

  const appDir = path.join(root, config.appDir);
  const rerun = debounce(async () => {
    try {
      await generateRoutes();
    } catch (error) {
      console.error("[routes] generate failed:", error);
    }
  }, 150);

  watch(appDir, { recursive: true }, (_event, filename) => {
    if (!filename) {
      rerun();
      return;
    }
    const normalized = filename.replaceAll("\\", "/");
    if (
      /(^|\/)page\.(tsx|jsx|ts|js)$/.test(normalized) ||
      normalized.includes(config.localeSegment)
    ) {
      rerun();
    }
  });

  console.log(`[routes] watching ${config.appDir} for page changes…`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
