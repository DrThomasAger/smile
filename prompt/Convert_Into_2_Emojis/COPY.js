#!/usr/bin/env node

/**
 * SMILE Agent Compiler (COPY.js)
 * Compiles .smile agent files by resolving chain/doc/data references
 * 
 * Created by: Dr. Thomas Ager
 * Co-created by: Claude (Anthropic) - v1.0 November 2025
 * 
 * Usage: node COPY.js [agent-folder-path]
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class SmileCompiler {
  constructor(agentPath) {
    this.agentPath = path.resolve(agentPath);
    this.logPath = path.join(this.agentPath, '.smile-log');
    this.warnings = [];
    this.fileHashes = {};
    this.debug = process.env.DEBUG === 'true';

    // Track resolution stack to detect cycles across recursive transclusion.
    this._resolvingStack = [];
  }

  log(...args) {
    if (this.debug) console.log('[SMILE]', ...args);
  }

  warn(message) {
    this.warnings.push(message);
    this.log('Warning:', message);
  }

  compile() {
    this.log('Starting compilation from:', this.agentPath);
    
    const agentFiles = fs.readdirSync(this.agentPath)
      .filter(f => f.endsWith('.smile') && !f.startsWith('Name'));
    
    if (agentFiles.length === 0) {
      throw new Error('No agent entry point found');
    }

    const entryPoint = agentFiles.includes('prompt.smile') ? 'prompt.smile' : agentFiles[0];
    this.log('Entry point:', entryPoint);
    
    const entryPath = path.join(this.agentPath, entryPoint);
    const compiled = this.resolveFile(entryPath);
    
    this.updateVersionLog();
    
    return this.cleanOutput(compiled);
  }

  resolveFile(filePath) {
    this.log(`Resolving: ${path.relative(this.agentPath, filePath)}`);

    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    this.trackFileHash(filePath, content);
    
    // Check for malformed references
    this.validateSyntax(content, filePath);
    
    // Recursively resolve within this file
    return this.resolveReferences(content, filePath);
  }

  validateSyntax(content, filePath) {
    // Check for unclosed references
    const openRefs = (content.match(/\[\$/g) || []).length;
    const closeRefs = (content.match(/\$\]/g) || []).length;
    
    if (openRefs !== closeRefs) {
      throw new Error(`Malformed reference in ${path.basename(filePath)}: Found ${openRefs} [$  but ${closeRefs} $]`);
    }
  }

  resolveReferences(content, currentFile) {
    // Match any [$type="name"$] pattern, type is optional, subtype allowed with slash.
    const refPattern = /\[\$(\w*)(?:\/(\w+))?[=:"]\s*([^$]+?)\s*\$\]/gi;
    
    return content.replace(refPattern, (match, type, subtype, name) => {
      const cleanName = name.replace(/["']/g, '').replace(/\.txt$/i, '').replace(/\.smile$/i, '');
      const typeShown = type || '(unspecified)';
      this.log(`Found reference: ${typeShown}${subtype ? '/' + subtype : ''} → ${cleanName}`);
      
      try {
        const resolvedPath = this.resolvePathWithFallback(type, subtype, cleanName);
        if (!resolvedPath) {
          throw new Error(`Cannot resolve: ${match}\nIn file: ${path.basename(currentFile)}`);
        }

        // Cycle detection across transclusion stack
        if (this._resolvingStack.includes(resolvedPath)) {
          const cycleChain = [...this._resolvingStack.map(p => path.basename(p)), path.basename(resolvedPath)].join(' → ');
          throw new Error(
            `Cyclic reference detected: ${cycleChain}\n` +
            `  While resolving from: ${path.basename(currentFile)}`
          );
        }
        
        const resolvedContent = fs.readFileSync(resolvedPath, 'utf-8');
        this.trackFileHash(resolvedPath, resolvedContent);

        // Validate referenced content so syntax errors are reported at the correct source.
        this.validateSyntax(resolvedContent, resolvedPath);
        
        // Chains may include docs/data, but not other chains.
        const isChainReference = ['chain', 'module', 'pipeline'].includes((type || '').toLowerCase());
        const hasChainReference = /\[\$(?:chain|module|pipeline)[=:"]/i.test(resolvedContent);
        
        if (isChainReference && hasChainReference) {
          const nestedMatch = /\[\$(?:chain|module|pipeline)[=:"]/.exec(resolvedContent);
          const lines = resolvedContent.substring(0, nestedMatch.index).split('\n');
          const lineNum = lines.length;
          const lineContent = resolvedContent.split('\n')[lineNum - 1];
          throw new Error(
            `Nested chain reference found in: ${path.basename(resolvedPath)} (line ${lineNum})\n` +
            `  Line content: ${lineContent.trim()}\n` +
            `  Chains can only reference docs/data, not other chains\n` +
            `  Referenced from: ${path.basename(currentFile)}`
          );
        }

        // Recursively resolve references within the injected content.
        this._resolvingStack.push(resolvedPath);
        try {
          const fullyResolved = this.resolveReferences(resolvedContent, resolvedPath);
          return fullyResolved;
        } finally {
          this._resolvingStack.pop();
        }
      } catch (e) {
        throw e;
      }
    });
  }

  resolvePathWithFallback(type, subtype, name) {
    // Try typed lookup first (or untyped curated search), then deep global search across any folder.
    const p = this.resolvePath(type, subtype, name);
    if (p) return p;

    // Deep search anywhere in agentPath and its parent
    const searchName = name.toLowerCase();
    const deepRoots = [
      this.agentPath,
      path.dirname(this.agentPath)
    ];

    const matches = this.findMatchesDeep(deepRoots, searchName);

    if (matches.length === 0) {
      return null;
    }
    if (matches.length > 1) {
      const locations = matches.map(m => m.location).join(', ');
      throw new Error(`Multiple files found for "${name}" during deep search in: ${locations}. Specify type or more specific name to disambiguate.`);
    }

    const only = matches[0];
    // If caller specified a type but the discovered location suggests a different category, warn and proceed.
    const declared = (type || '').toLowerCase();
    const inferred = this.inferCategoryFromLocation(only.location); // 'chain' | 'doc' | 'data' | 'default' | 'root' | 'unknown'
    if (declared && inferred !== 'unknown' && declared !== inferred) {
      this.warn(`Declared type "${declared}" for "${name}" but found in "${only.location}" (inferred "${inferred}"). Resolved by deep search.`);
    } else {
      this.warn(`Resolved "${name}" by deep search at "${only.location}". Consider organizing or specifying type.`);
    }

    this.log(`  Deep-resolved ${type ? type + ':' : ''}${name} → ${path.relative(this.agentPath, only.path)}`);
    return only.path;
  }

  resolvePath(type, subtype, name) {
    const lowerType = type ? type.toLowerCase() : '';
    const searchName = name.toLowerCase();

    // Normalize type names
    const typeMap = {
      'module': 'chain',
      'pipeline': 'chain',
      'chain': 'chain',
      'section': 'doc',
      'document': 'doc',
      'doc': 'doc',
      'data': 'data',
      'var': 'data',
      'variable': 'data',
      'segment': 'data'
    };

    const normalizedType = typeMap[lowerType];
    if (!normalizedType || lowerType === '') {
      // Type not specified or not recognized - curated search then deep
      return this.searchAllLocations(name);
    }

    let searchPaths = [];

    if (normalizedType === 'chain') {
      searchPaths = [
        path.join(this.agentPath, 'chain'),
        path.join(this.agentPath, 'pipeline'),
        path.join(this.agentPath, '..', 'chain'),
        path.join(this.agentPath, '..', 'pipeline')
      ];
    } else if (normalizedType === 'doc') {
      if (subtype) {
        searchPaths = [
          path.join(this.agentPath, 'documents', subtype),
          path.join(this.agentPath, 'section', subtype),
          path.join(this.agentPath, '..', 'documents', subtype),
          path.join(this.agentPath, '..', 'section', subtype)
        ];
      } else {
        // Include unsorted documents under documents/ and section/ roots
        searchPaths = [
          path.join(this.agentPath, 'documents'),
          path.join(this.agentPath, 'documents', 'prompt'),
          path.join(this.agentPath, 'documents', 'response'),
          path.join(this.agentPath, 'section'),
          path.join(this.agentPath, 'section', 'prompt'),
          path.join(this.agentPath, 'section', 'response'),
          path.join(this.agentPath, '..', 'documents'),
          path.join(this.agentPath, '..', 'documents', 'prompt'),
          path.join(this.agentPath, '..', 'documents', 'response'),
          path.join(this.agentPath, '..', 'section'),
          path.join(this.agentPath, '..', 'section', 'prompt'),
          path.join(this.agentPath, '..', 'section', 'response')
        ];
      }
    } else if (normalizedType === 'data') {
      searchPaths = [
        path.join(this.agentPath, 'data'),
        path.join(this.agentPath, 'data', 'input'),
        path.join(this.agentPath, 'data', 'output'),
        path.join(this.agentPath, 'default'),
        this.agentPath
      ];
    }

    const matches = this.findMatches(searchPaths, searchName);

    if (matches.length === 0) {
      // Let caller trigger deep fallback
      return null;
    }

    if (matches.length > 1) {
      const locations = matches.map(m => m.location).join(', ');
      throw new Error(`Multiple files found for "${name}" in: ${locations}. Specify type to disambiguate.`);
    }

    if (matches.length === 1 && normalizedType === 'doc' && !subtype) {
      this.warn(`Unspecified doc reference "${name}" resolved to ${matches[0].location}. Consider using doc/prompt or doc/response.`);
    }

    this.log(`  Resolved ${type}:${name} → ${path.relative(this.agentPath, matches[0].path)}`);
    return matches[0].path;
  }

  searchAllLocations(name) {
    const searchName = name.toLowerCase();
    
    // Curated, common locations first (including unsorted doc roots)
    const allPaths = [
      path.join(this.agentPath, 'chain'),
      path.join(this.agentPath, 'pipeline'),
      path.join(this.agentPath, 'documents'),
      path.join(this.agentPath, 'documents', 'prompt'),
      path.join(this.agentPath, 'documents', 'response'),
      path.join(this.agentPath, 'section'),
      path.join(this.agentPath, 'section', 'prompt'),
      path.join(this.agentPath, 'section', 'response'),
      path.join(this.agentPath, 'data'),
      path.join(this.agentPath, 'data', 'input'),
      path.join(this.agentPath, 'data', 'output'),
      path.join(this.agentPath, 'default'),
      this.agentPath,
      path.join(this.agentPath, '..', 'chain'),
      path.join(this.agentPath, '..', 'pipeline'),
      path.join(this.agentPath, '..', 'documents'),
      path.join(this.agentPath, '..', 'section')
    ];

    let matches = this.findMatches(allPaths, searchName);

    if (matches.length === 0) {
      // Deep fallback across any folder if curated search fails
      const deepRoots = [
        this.agentPath,
        path.dirname(this.agentPath)
      ];
      matches = this.findMatchesDeep(deepRoots, searchName);
      if (matches.length === 0) return null;
    }

    if (matches.length > 1) {
      const locations = matches.map(m => m.location).join(', ');
      throw new Error(`Multiple files found for "${name}" in: ${locations}. Specify type (chain/doc/data) to disambiguate.`);
    }

    this.warn(`Unspecified type for "${name}". Found in ${matches[0].location}. Consider specifying chain/doc/data.`);
    this.log(`  Resolved ${name} → ${path.relative(this.agentPath, matches[0].path)}`);
    return matches[0].path;
  }

  findMatches(searchPaths, searchName) {
    const matches = [];

    for (const searchPath of searchPaths) {
      if (!fs.existsSync(searchPath) || !fs.statSync(searchPath).isDirectory()) continue;

      const files = fs.readdirSync(searchPath);

      for (const file of files) {
        const fullPath = path.join(searchPath, file);
        if (fs.statSync(fullPath).isDirectory()) continue;

        const fileBase = file.replace(/\.smile$/i, '').replace(/\.txt$/i, '');
        const fileBaseLower = fileBase.toLowerCase();

        if (fileBaseLower === searchName || 
            fileBaseLower.replace(/[-_]/g, '') === searchName.replace(/[-_]/g, '')) {
          matches.push({
            path: fullPath,
            location: path.relative(this.agentPath, searchPath) || '.'
          });
        }
      }
    }

    return matches;
  }

  findMatchesDeep(rootDirs, searchName) {
    const seen = new Set();
    const results = [];

    const matchBase = (base) => {
      const baseLower = base.toLowerCase();
      return baseLower === searchName ||
             baseLower.replace(/\.smile$/i, '').replace(/\.txt$/i, '').replace(/[-_]/g, '') === searchName.replace(/[-_]/g, '');
    };

    const walk = (root) => {
      if (!fs.existsSync(root)) return;
      const stack = [root];
      while (stack.length) {
        const dir = stack.pop();
        let entries = [];
        try {
          entries = fs.readdirSync(dir, { withFileTypes: true });
        } catch {
          continue;
        }
        for (const ent of entries) {
          const full = path.join(dir, ent.name);
          if (ent.isDirectory()) {
            // Skip version log directory noise
            if (ent.name === '.smile-log' || ent.name === 'node_modules' || ent.name.startsWith('.git')) continue;
            stack.push(full);
          } else if (ent.isFile()) {
            const base = ent.name;
            // De-dup by absolute path
            if (seen.has(full)) continue;
            if (matchBase(base)) {
              seen.add(full);
              results.push({
                path: full,
                location: path.relative(this.agentPath, path.dirname(full)) || '.'
              });
            }
          }
        }
      }
    };

    for (const r of rootDirs) walk(r);
    return results;
  }

  inferCategoryFromLocation(location) {
    const segs = location.split(path.sep).map(s => s.toLowerCase());
    if (segs.includes('chain') || segs.includes('pipeline')) return 'chain';
    if (segs.includes('documents') || segs.includes('section')) return 'doc';
    if (segs.includes('data') || segs.includes('default')) return 'data';
    if (location === '.' || location === '') return 'root';
    return 'unknown';
  }

  trackFileHash(filePath, content) {
    const hash = crypto.createHash('md5').update(content).digest('hex');
    this.fileHashes[filePath] = hash;
  }

  updateVersionLog() {
    if (!fs.existsSync(this.logPath)) {
      fs.mkdirSync(this.logPath, { recursive: true });
    }

    const versionFile = path.join(this.logPath, 'version.json');
    let previousHashes = {};
    let currentVersion = 1;

    if (fs.existsSync(versionFile)) {
      const log = JSON.parse(fs.readFileSync(versionFile, 'utf-8'));
      previousHashes = log.hashes || {};
      currentVersion = log.version || 1;
    }

    let hasChanges = false;

    for (const [filePath, hash] of Object.entries(this.fileHashes)) {
      if (previousHashes[filePath] !== hash) {
        hasChanges = true;
        break;
      }
    }

    if (hasChanges) {
      currentVersion++;
      const logData = {
        version: currentVersion,
        timestamp: new Date().toISOString(),
        hashes: this.fileHashes,
        files: Object.keys(this.fileHashes).map(f => path.relative(this.agentPath, f))
      };

      fs.writeFileSync(versionFile, JSON.stringify(logData, null, 2), 'utf-8');
      this.log(`Version updated: v${currentVersion}`);
    } else {
      this.log(`No changes detected, version remains: v${currentVersion}`);
    }
  }

  cleanOutput(content) {
    content = content.replace(/\r\n/g, '\n');
    content = content.replace(/\n{4,}/g, '\n\n\n');
    return content.trim();
  }
}

function main() {
  const args = process.argv.slice(2);
  const agentPath = args[0] || process.cwd();

  try {
    const compiler = new SmileCompiler(agentPath);
    const result = compiler.compile();
    
    console.log(result);
    
    if (compiler.warnings.length > 0) {
      console.error('\nWarnings:');
      compiler.warnings.forEach(w => console.error(`  - ${w}`));
    }

    const outFile = path.join(agentPath, 'COMPILED_OUTPUT.txt');
    fs.writeFileSync(outFile, result, 'utf-8');

  } catch (error) {
    console.error('\n❌ Compilation failed:', error.message);
    if (process.env.DEBUG === 'true') {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { SmileCompiler };
