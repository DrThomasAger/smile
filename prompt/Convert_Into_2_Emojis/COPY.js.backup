#!/usr/bin/env node
/**
 * COPY.js — v3.3
 *
 * Objectives upheld:
 * - Always write a .txt for every .smile that has at least one token, even if some tokens fail.
 * - Resolve through wrong type or wrong subpath by falling back across the index; log the fallback and record a fix suggestion.
 * - If a token is truly unresolvable, inline a readable error stub into the compiled output, keep going, and record the error.
 * - Broaden token parsing so unquoted names may include parentheses and other marks used in author content.
 * - Zero deps, Node >= 14.
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

// ------------------------------ Config ------------------------------ //
const TYPES = new Set(["chain", "document", "data", "doc"]); // 'doc' is accepted shorthand for 'document'
const IGNORE_DIRS = new Set([".git", "node_modules", ".idea", ".vscode", ".smile-log"]);
const PRUNE_DIRS  = new Set(["build","dist","coverage",".next",".turbo","out",".cache","tmp","temp","__pycache__","venv",".venv","env",".env","target","bazel-bin","bazel-out",".gradle",".m2",".DS_Store"]);
const LOG_DIR = ".smile-log";
const WARNINGS_FILE = path.join(LOG_DIR, "warnings.json"); // includes errors and suggestions
const VERSION_FILE  = path.join(LOG_DIR, "version.json");

// Fresh token regex source for per-call instances (prevents recursion from corrupting parent state).
const TOKEN_RE_SOURCE = String.raw`\[\$(?<inner>[^\]]*?)\$\]`;

// Inner grammar: [$ <type>? <subpaths>? <op>? <name>? $]
// Broaden unquoted <name> to allow almost anything except '$' (token delimiter); quotes still supported.
// Accept ':' or '=' as operator.
const INNER_RE =
  /^(?<lead>\s*)(?<type>[A-Za-z]+)?(?<paths>(?:\/[A-Za-z0-9._\-]+)*)(?<mid>\s*)(?<op>=|:)?(?<mid2>\s*)(?:"(?<qname>[^"]+)"|(?<name>[^$][^$]*?))?(?<trail>\s*)$/;

// ------------------------------ Helpers ------------------------------ //
const hash  = (buf) => crypto.createHash("md5").update(buf).digest("hex");
const read  = (p) => fs.readFileSync(p, "utf8");
const write = (p, s) => { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, s, "utf8"); };

// Canonicalize a name for lookup: lower, strip spaces, hyphens, underscores, and trailing .smile/.txt
const canon = (s) =>
  String(s || "")
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[\-_]+/g, "")
    .replace(/\.(smile|txt)$/i, "");

// For data files we compare both with and without extension keys.
const canonNoExt = (filename) => canon(path.parse(filename).name);

function real(p) { try { return fs.realpathSync.native ? fs.realpathSync.native(p) : fs.realpathSync(p); } catch { return p; } }
function safeLstat(p){ try { return fs.lstatSync(p); } catch { return null; } }

function posToLineCol(text, index){
  let line=1, col=1;
  for(let i=0;i<index;i++){ if(text.charCodeAt(i)===10){ line++; col=1; } else { col++; } }
  return { line, col };
}

function findPromptRoot(root){
  const p = path.join(root, "prompt");
  if (fs.existsSync(p) && fs.statSync(p).isDirectory()) return p;
  return root;
}

function walkFiles(dir, filterFn){
  const out=[]; const visited=new Set();
  (function walk(d){
    const st=safeLstat(d); if(!st) return; if(st.isSymbolicLink()) return;
    const rp=real(d); if(visited.has(rp)) return; visited.add(rp);
    let ents; try { ents=fs.readdirSync(d, { withFileTypes:true }); } catch { return; }
    for(const e of ents){
      if(IGNORE_DIRS.has(e.name) || PRUNE_DIRS.has(e.name)) continue;
      const full=path.join(d,e.name); const est=safeLstat(full); if(!est) continue; if(est.isSymbolicLink()) continue;
      if(est.isDirectory()) walk(full); else if(est.isFile() && filterFn(full)) out.push(full);
    }
  })(dir);
  return out;
}

function scanSmileFiles(promptRoot){
  const startDirs = ["chain","document","data"].map(d=>path.join(promptRoot,d)).filter(p=>fs.existsSync(p));
  if (!startDirs.length) startDirs.push(promptRoot);
  const smiles=[];
  for (const d of startDirs){ smiles.push(...walkFiles(d, f=>f.toLowerCase().endsWith('.smile'))); }
  return smiles;
}

// Build an index of available targets under chain/ and document/ (nested allowed). Data allows any extension.
function buildIndex(promptRoot){
  const idx={ chain:new Map(), document:new Map(), data:new Map(), all:new Map() };

  function addKey(map, key, rec){
    if(!map.has(key)) map.set(key, []);
    const arr = map.get(key);
    if (!arr.some(r => r.full === rec.full)) arr.push(rec);
  }

  function add(type, full){
    const base = path.basename(full);
    const rec={ full, type };
    const keyWithExt = canon(base);

    addKey(idx[type], keyWithExt, rec);
    addKey(idx.all,  keyWithExt, rec);

    if (type === 'data'){
      const keyNoExt = canonNoExt(base);
      addKey(idx[type], keyNoExt, rec);
      addKey(idx.all,  keyNoExt, rec);
    }
  }

  const chainDir = path.join(promptRoot, 'chain');
  const docDir   = path.join(promptRoot, 'document');
  const dataDir  = path.join(promptRoot, 'data');
  if (fs.existsSync(chainDir))  walkFiles(chainDir,  f=>/\.smile$/i.test(f)).forEach(f=>add('chain', f));
  if (fs.existsSync(docDir))    walkFiles(docDir,    f=>/\.smile$/i.test(f)).forEach(f=>add('document', f));
  if (fs.existsSync(dataDir))   walkFiles(dataDir,   _=>true).forEach(f=>add('data', f));

  // Legacy discovery fallbacks.
  const legacyDocRoots = [ 'documents', 'sections', 'section', 'prompt', 'response' ].map(n=>path.join(promptRoot, n)).filter(p=>fs.existsSync(p));
  for (const r of legacyDocRoots) walkFiles(r, f=>/\.smile$/i.test(f)).forEach(f=>add('document', f));
  const legacyChainRoots = [ 'pipeline', 'module', 'modules' ].map(n=>path.join(promptRoot, n)).filter(p=>fs.existsSync(p));
  for (const r of legacyChainRoots) walkFiles(r, f=>/\.smile$/i.test(f)).forEach(f=>add('chain', f));
  return idx;
}

function splitInner(inner){
  const m = INNER_RE.exec(inner);
  if(!m) return null;
  const g = m.groups;
  const typeRaw = g.type ? g.type.trim() : null;
  const pathRaw = (g.paths || '').trim();
  const subpaths = pathRaw ? pathRaw.split('/').filter(Boolean) : [];
  const name = (g.qname || g.name || '').trim();
  const op = g.op || '='; // default to '=' if omitted
  return { typeRaw, subpaths, name, op, quoted: Boolean(g.qname), lead:g.lead||'', trail:g.trail||'' };
}

function normalizeType(t){
  if(!t) return null;
  t=t.toLowerCase();
  if(t==='doc') return 'doc';
  if(t==='document') return 'document';
  if(t==='chain'||t==='data') return t;
  return null;
}

function typeToFolder(t){ return t==='doc' ? 'document' : t; }

function findByNameAcross(idx, name){
  const key = canon(name);
  const hits = idx.all.get(key) || [];
  return hits.map(h => ({
    full:h.full,
    type: h.type==='document' ? 'document' : h.type,
    basename: path.basename(h.full).replace(/\.(smile|txt)$/i,'')
  }));
}

function bestCandidateByName(idx, name){
  const key = canon(name);
  const hits = (idx.all.get(key) || []).slice();

  if (!hits.length) return null;

  // Deterministic tie-break: prefer document, then chain, then data; then shorter full path; then lexical path.
  const pri = (t)=> (t==='document'?0 : t==='chain'?1 : 2);
  hits.sort((a,b)=>{
    const pa = pri(a.type), pb = pri(b.type);
    if (pa !== pb) return pa - pb;
    if (a.full.length !== b.full.length) return a.full.length - b.full.length;
    return a.full.localeCompare(b.full);
  });
  return hits[0];
}

// ------------------------------ Resolve ------------------------------ //
// Strict resolver for a declared type/path. Throws when type is unknown or nothing is found.
function resolveDeclared(idx, promptRoot, tokenObj){
  const { typeRaw, subpaths, name } = tokenObj;
  const t = normalizeType(typeRaw);
  if (!t) {
    const suggestions = findByNameAcross(idx, name);
    const sugText = suggestions.map(s=>`  - [$${s.type}="${s.basename}"$]  ->  ${s.full}`).join("\n");
    const err = new Error(`Unrecognized type "${typeRaw ?? ''}"\nToken: [$${typeRaw ?? ''}${subpaths.length?('/'+subpaths.join('/')):''}="${name}"$]\nSuggestions:\n${sugText || '  (none found)'}\n`);
    err._code = 'UNKNOWN_TYPE';
    throw err;
  }

  const folder = typeToFolder(t);
  const typeRoot = path.join(promptRoot, folder);
  const searchRoots = [];

  if (subpaths.length){
    searchRoots.push(path.join(typeRoot, ...subpaths));
    if (folder==='document' && (subpaths[0].toLowerCase()==='prompt' || subpaths[0].toLowerCase()==='response')){
      searchRoots.push(typeRoot);
    }
  } else {
    if (folder==='document'){
      const pr = path.join(typeRoot,'prompt'); const rr = path.join(typeRoot,'response');
      if (fs.existsSync(pr)) searchRoots.push(pr);
      if (fs.existsSync(rr)) searchRoots.push(rr);
    }
    searchRoots.push(typeRoot);
  }

  const wanted = canon(name);
  const isData = folder==='data';
  for (const r of searchRoots){
    if (!fs.existsSync(r)) continue;
    const files = walkFiles(r, f=>/.+/i.test(f));
    for (const f of files){
      const base = path.basename(f);
      const baseCanon = canon(base);
      const baseCanonNoExt = canonNoExt(base);
      const okName = isData ? (baseCanon === wanted || baseCanonNoExt === wanted) : (baseCanon === wanted);
      if (!okName) continue;
      if (!isData && !/\.smile$/i.test(f)) continue;
      const relFromType = path.relative(typeRoot, f).replace(/\\/g,'/');
      const relDir = path.dirname(relFromType).replace(/^(\.)$/, '');
      return {
        full:f,
        type: t==='doc' ? 'doc' : folder,
        folderPath: relDir==='.'?'' : relDir,
        basename: path.basename(f).replace(/\.(smile|txt)$/i, '')
      };
    }
  }

  const err = new Error(`Cannot resolve [$${typeRaw}${subpaths.length?('/'+subpaths.join('/')):''}="${name}"$]`);
  err._code = 'NOT_FOUND';
  throw err;
}

// ------------------------------ Compile engine ------------------------------ //
function compileContent(idx, promptRoot, filePath, text, stack, suggestions, errors, log, verbose){
  const tokenRe = new RegExp(TOKEN_RE_SOURCE, "g");
  let out = ""; let last = 0; let m;

  while ((m = tokenRe.exec(text))) {
    if (m[0].length === 0) { tokenRe.lastIndex++; continue; }
    out += text.slice(last, m.index);

    const tokenStr = m[0];
    const { line, col } = posToLineCol(text, m.index);
    const inner = m.groups.inner;
    const parsed = splitInner(inner);

    if (verbose) log(`[TOKEN] ${path.relative(promptRoot, filePath)}:${line}:${col}  ${tokenStr}`);

    if (!parsed || !parsed.name){
      const msg = `Malformed or empty reference token\nToken: ${tokenStr}`;
      errors.push({ file:filePath, line, col, error: msg });
      out += `\n[UNRESOLVED ${path.relative(promptRoot, filePath)}:${line}:${col} :: ${tokenStr} :: Malformed token]\n`;
      last = m.index + m[0].length;
      continue;
    }

    let target=null;
    let reason=null;

    try {
      target = resolveDeclared(idx, promptRoot, parsed);
      reason = 'declared';
    } catch (e){
      // Attempt cross-type fallback on unknown type or not found.
      const fallback = bestCandidateByName(idx, parsed.name);
      if (fallback){
        // Build canonical replacement token from fallback.
        const fallbackType = fallback.type === 'document' ? (parsed.typeRaw==='doc' ? 'doc' : 'document') : fallback.type;
        const typeRoot = path.join(promptRoot, typeToFolder(fallbackType));
        const relDir = path.relative(typeRoot, path.dirname(fallback.full)).replace(/\\/g,'/');
        const folderPath = relDir === '' ? '' : relDir;
        const fixedType = fallbackType;
        const pathPart = folderPath ? `/${folderPath}` : '';
        const namePart = parsed.quoted ? `"${path.basename(fallback.full).replace(/\.(smile|txt)$/i, '')}"` : path.basename(fallback.full).replace(/\.(smile|txt)$/i, '');
        const fixedToken = `[$${fixedType}${pathPart}${parsed.op || '='}${namePart}$]`;

        // Log and record suggestion.
        const note = e && e._code === 'UNKNOWN_TYPE' ? 'unknown type' : 'unresolved';
        if (verbose) log(`[FALLBACK] ${path.relative(promptRoot, filePath)}:${line}:${col}  ${note} -> compiled via ${fixedToken} -> ${path.relative(promptRoot, fallback.full)}`);
        suggestions.push({
          file:filePath,
          index:m.index,
          length:m[0].length,
          original:m[0],
          replacement: fixedToken,
          reason: e && e._code === 'UNKNOWN_TYPE' ? 'unknown type mapped by name' : 'cross-type name match',
          resolvedPath: fallback.full
        });

        // Adopt fallback as target; we will inline it.
        const typeRoot2 = path.join(promptRoot, typeToFolder(fallbackType));
        target = {
          full: fallback.full,
          type: fixedType,
          folderPath: folderPath,
          basename: path.basename(fallback.full).replace(/\.(smile|txt)$/i, '')
        };
        reason = 'fallback';
      } else {
        // Truly unresolvable: record error and inline stub.
        const msg = (e && e.message) ? e.message : String(e);
        errors.push({ file:filePath, line, col, error: msg, token: tokenStr });
        if (verbose) log(`[UNRESOLVED] ${path.relative(promptRoot, filePath)}:${line}:${col}  ${msg.split('\n')[0]}`);
        out += `\n[UNRESOLVED ${path.relative(promptRoot, filePath)}:${line}:${col} :: ${tokenStr} :: ${msg.replace(/\n/g,' | ')}]\n`;
        last = m.index + m[0].length;
        continue;
      }
    }

    // Detect circular inclusion to avoid infinite recursion.
    if (stack.includes(target.full)){
      const cycle = [...stack, target.full].map(p => path.relative(promptRoot, p)).join(" -> ");
      const msg = `Circular reference detected\nCycle: ${cycle}`;
      errors.push({ file:filePath, line, col, error: msg, token: tokenStr });
      if (verbose) log(`[CIRCULAR] ${path.relative(promptRoot, filePath)}:${line}:${col}  ${cycle}`);
      out += `\n[UNRESOLVED ${path.relative(promptRoot, filePath)}:${line}:${col} :: ${tokenStr} :: Circular -> ${cycle}]\n`;
      last = m.index + m[0].length;
      continue;
    }

    // If the declared mapping doesn't match actual location, record a fix suggestion even when declared resolve worked.
    if (reason === 'declared'){
      const declaredType = normalizeType(parsed.typeRaw) || parsed.typeRaw;
      const actualType   = target.type;
      const typeRoot = path.join(promptRoot, typeToFolder(actualType));
      const relDir = path.relative(typeRoot, path.dirname(target.full)).replace(/\\/g,'/');
      const declaredPath = (parsed.subpaths||[]).join('/');
      const declaredTypeCanonical = declaredType === 'document' && parsed.typeRaw === 'doc' ? 'doc' : declaredType;
      const normDeclared = (declaredTypeCanonical==='doc') ? 'document' : declaredTypeCanonical;
      const normActual   = (actualType==='doc') ? 'document' : actualType;

      const needsTypeFix = Boolean(declaredTypeCanonical) && normDeclared !== normActual;
      const needsPathFix = (relDir || '') !== (declaredPath || '');

      if (needsTypeFix || needsPathFix){
        const fixedType = (declaredTypeCanonical==='doc' && actualType==='document') ? 'doc' : actualType;
        const pathPart = relDir ? `/${relDir}` : '';
        const namePart = parsed.quoted ? `"${target.basename}"` : target.basename;
        const fixedToken = `[$${fixedType}${pathPart}${parsed.op || '='}${namePart}$]`;
        suggestions.push({
          file:filePath,
          index:m.index,
          length:m[0].length,
          original:m[0],
          replacement: fixedToken,
          reason: needsTypeFix && needsPathFix ? 'type and path mismatch' : (needsTypeFix ? 'type mismatch' : 'path mismatch'),
          resolvedPath: target.full
        });
        if (verbose){
          const reasonText = needsTypeFix && needsPathFix ? 'type and path mismatch' : (needsTypeFix ? 'type mismatch' : 'path mismatch');
          log(`[FALLBACK] ${path.relative(promptRoot, filePath)}:${line}:${col}  compiled via ${fixedToken} -> ${path.relative(promptRoot, target.full)}  (${reasonText})`);
        }
      } else if (verbose){
        log(`[RESOLVE] ${path.relative(promptRoot, filePath)}:${line}:${col}  -> ${path.relative(promptRoot, target.full)}`);
      }
    }

    // Inline content (chain/document require .smile; data may be any ext).
    let content;
    try {
      content = read(target.full);
    } catch (ioe){
      const msg = `Read error for "${target.full}": ${ioe && ioe.message ? ioe.message : String(ioe)}`;
      errors.push({ file:filePath, line, col, error: msg, token: tokenStr });
      out += `\n[UNRESOLVED ${path.relative(promptRoot, filePath)}:${line}:${col} :: ${tokenStr} :: ${msg.replace(/\n/g,' | ')}]\n`;
      last = m.index + m[0].length;
      continue;
    }

    const inlined = /\.smile$/i.test(target.full)
      ? compileContent(idx, promptRoot, target.full, content, [...stack, target.full], suggestions, errors, log, verbose)
      : content;

    out += inlined;
    last = m.index + m[0].length;
  }

  out += text.slice(last);
  return out;
}

// ------------------------------ Fix application ------------------------------ //
function applyFixes(suggestions){
  const byFile = new Map();
  for (const s of suggestions){ if(!byFile.has(s.file)) byFile.set(s.file, []); byFile.get(s.file).push(s); }
  for (const [file, items] of byFile){
    let text = read(file);
    items.sort((a,b)=> (b.index - a.index));
    for (const s of items){ text = text.slice(0, s.index) + s.replacement + text.slice(s.index + s.length); }
    write(file, text);
  }
}

// ------------------------------ Versioning & logging ------------------------------ //
function saveJson(p, obj){ fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, JSON.stringify(obj, null, 2), 'utf8'); }
function loadJson(p){ try { return JSON.parse(read(p)); } catch { return null; } }
function updateVersion(allFiles){
  const prev = loadJson(VERSION_FILE) || { version:0, files:{}, history:[] };
  const nextFiles = {}; for (const f of allFiles){ try { nextFiles[f] = hash(read(f)); } catch {} }
  const changed = Object.keys(nextFiles).filter(k => prev.files[k] !== nextFiles[k]);
  const next = changed.length ? { version: prev.version+1, files: nextFiles, history:[...(prev.history||[]), { version: prev.version+1, timestamp:new Date().toISOString(), changed }] } : prev;
  saveJson(VERSION_FILE, next);
}

// ------------------------------ Main ------------------------------ //
async function main(){
  const argv = process.argv.slice(2);
  const opts = { root:null, fix:false, quiet:false };
  for (const a of argv){
    if (a === '--fix') opts.fix = true;
    else if (a === '--quiet') opts.quiet = true;
    else if (!a.startsWith('-')) opts.root = path.resolve(a);
  }
  const root = opts.root || process.cwd();
  const promptRoot = findPromptRoot(root);
  const verbose = !opts.quiet;
  const log = (msg)=>{ try { console.log(msg); } catch {} };

  console.log(`[INFO] Prompt root: ${promptRoot}`);

  const idx = buildIndex(promptRoot);
  const smiles = scanSmileFiles(promptRoot);
  console.log(`[INFO] Found ${smiles.length} .smile file(s).`);

  const suggestions = [];
  const errors = [];
  const compiledOut = [];

  for (const f of smiles){
    const rel = path.relative(promptRoot, f);
    try {
      const src = read(f);
      const hasToken = new RegExp(TOKEN_RE_SOURCE, "g").test(src);
      if (!hasToken) { console.log(`[SKIP] ${rel} - no references`); continue; }

      console.log(`[WORK] Compiling ${rel} ...`);
      const compiled = compileContent(idx, promptRoot, f, src, [f], suggestions, errors, log, verbose);
      const out = f.replace(/\.smile$/i, '.txt');
      write(out, compiled);
      compiledOut.push(out);
      console.log(`[OK] ${rel} -> ${path.relative(promptRoot, out)}`);
    } catch (e){
      const msg = (e && e.message) ? e.message : String(e);
      console.error(`[FATAL] ${rel}\n  ${msg.replace(/\n/g,'\n  ')}`);
      // Even on fatal file-level errors (rare), try to emit a minimal .txt so the invariant holds.
      try {
        const out = f.replace(/\.smile$/i, '.txt');
        write(out, `[[FATAL ERROR compiling ${rel}]]\n${msg}\n`);
        compiledOut.push(out);
      } catch {}
    }
  }

  saveJson(WARNINGS_FILE, { generatedAt:new Date().toISOString(), errors, suggestions });
  updateVersion([ ...smiles, ...compiledOut ]);

  if (errors.length){
    console.log(`\nERRORS (${errors.length}) — non-fatal; outputs were still written:`);
    // Print the first N for readability.
    const maxShow = 200;
    for (let i=0; i<Math.min(errors.length, maxShow); i++){
      const e = errors[i];
      const loc = e.line && e.col ? `:${e.line}:${e.col}` : '';
      console.log(`- ${path.relative(promptRoot, e.file)}${loc}\n  ${String(e.error).replace(/\n/g,'\n  ')}`);
    }
    if (errors.length > maxShow) console.log(`...and ${errors.length - maxShow} more`);
  }

  if (suggestions.length){
    console.log(`\nSuggestions (${suggestions.length}) — canonical mappings you can apply:`);
    for (const s of suggestions.slice(0, 400)){
      console.log(`- ${path.relative(promptRoot, s.file)} @${s.index}: ${s.reason}\n  original: ${s.original}\n  replace : ${s.replacement}\n  path    : ${s.resolvedPath}`);
    }
    if (suggestions.length > 400) console.log(`...and ${suggestions.length - 400} more`);
  }

  if (suggestions.length){
    if (opts.fix){
      applyFixes(suggestions);
      console.log(`\nApplied ${suggestions.length} fix(es).`);
    } else {
      console.log(`\nType "fix" and press Enter to apply all ${suggestions.length} fix(es) now, or just press Enter to skip.`);
      await new Promise((resolve)=>{
        const stdin = process.stdin; stdin.setEncoding('utf8');
        const timer = setTimeout(()=>{ try { stdin.pause(); } catch {} resolve(); }, 80);
        stdin.once('data', (d)=>{ clearTimeout(timer); const v=(d||'').toString().trim().toLowerCase(); if (v==='fix'){ applyFixes(suggestions); console.log(`Applied ${suggestions.length} fix(es).`); } try { stdin.pause(); } catch {} resolve(); });
        try { stdin.resume(); } catch {}
      });
    }
  }

  console.log(`\nDone. Compiled ${compiledOut.length} file(s). Errors recorded: ${errors.length}. Suggestions: ${suggestions.length}.`);
}

if (require.main === module) {
  main().catch(err => {
    console.error(err && err.stack ? err.stack : err);
    process.exitCode = 1;
  });
}

module.exports = {
  buildIndex,
  compileContent,
  findPromptRoot,
  scanSmileFiles
};
