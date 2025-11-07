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
    
    return this.resolveReferences(content);
  }

  resolveReferences(content) {
    // Match any [$type="name"$] pattern, type is optional
    const refPattern = /\[\$(\w*)(?:\/(\w+))?[=:"]\s*([^$]+?)\s*\$\]/gi;
    
    return content.replace(refPattern, (match, type, subtype, name) => {
      const cleanName = name.replace(/["']/g, '').replace(/\.txt$/, '').replace(/\.smile$/, '');
      this.log(`Found reference: ${type}${subtype ? '/' + subtype : ''} → ${cleanName}`);
      
      try {
        const resolvedPath = this.resolvePath(type, subtype, cleanName);
        if (!resolvedPath) {
          throw new Error(`Cannot resolve: ${match}`);
        }
        
        const resolvedContent = fs.readFileSync(resolvedPath, 'utf-8');
        this.trackFileHash(resolvedPath, resolvedContent);
        
        // Check for nested references
        if (/\[\$\w+[=:"]/.test(resolvedContent)) {
          throw new Error(`Nested references not allowed. Found reference in ${path.basename(resolvedPath)}`);
        }
        
        return resolvedContent;
      } catch (e) {
        throw new Error(`${e.message} (in reference: ${match})`);
      }
    });
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
      // Type not specified or not recognized - search everywhere
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
        searchPaths = [
          path.join(this.agentPath, 'documents', 'prompt'),
          path.join(this.agentPath, 'documents', 'response'),
          path.join(this.agentPath, 'section', 'prompt'),
          path.join(this.agentPath, 'section', 'response'),
          path.join(this.agentPath, '..', 'documents', 'prompt'),
          path.join(this.agentPath, '..', 'documents', 'response'),
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
    
    // Search everywhere: chain, documents, data
    const allPaths = [
      path.join(this.agentPath, 'chain'),
      path.join(this.agentPath, 'pipeline'),
      path.join(this.agentPath, 'documents', 'prompt'),
      path.join(this.agentPath, 'documents', 'response'),
      path.join(this.agentPath, 'section', 'prompt'),
      path.join(this.agentPath, 'section', 'response'),
      path.join(this.agentPath, 'data'),
      path.join(this.agentPath, 'data', 'input'),
      path.join(this.agentPath, 'data', 'output'),
      path.join(this.agentPath, 'default'),
      this.agentPath,
      path.join(this.agentPath, '..', 'chain'),
      path.join(this.agentPath, '..', 'pipeline'),
      path.join(this.agentPath, '..', 'section', 'prompt'),
      path.join(this.agentPath, '..', 'section', 'response')
    ];

    const matches = this.findMatches(allPaths, searchName);

    if (matches.length === 0) {
      return null;
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
        const fileBase = file.replace(/\.smile$/i, '').replace(/\.txt$/i, '');
        const fileBaseLower = fileBase.toLowerCase();

        if (fileBaseLower === searchName || 
            fileBaseLower.replace(/[-_]/g, '') === searchName.replace(/[-_]/g, '')) {
          const fullPath = path.join(searchPath, file);
          matches.push({
            path: fullPath,
            location: path.relative(this.agentPath, searchPath)
          });
        }
      }
    }

    return matches;
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
