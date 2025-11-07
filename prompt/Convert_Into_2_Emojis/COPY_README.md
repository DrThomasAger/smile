# SMILE Compiler (COPY.js)

**Created by:** Dr. Thomas Ager  
**Co-created by:** Claude (Anthropic) - v1.0 November 2025

Compiles SMILE agents by resolving references into a single prompt.

## Usage

```bash
node COPY.js
```

Outputs to console and writes `COMPILED_OUTPUT.txt`

## Reference Types

**Specified types:**
```smile
[$chain="name"$]           → Searches: chain/, pipeline/
[$doc="name"$]             → Searches: documents/*, section/*
[$doc/prompt="name"$]      → Searches: documents/prompt/, section/prompt/
[$doc/response="name"$]    → Searches: documents/response/, section/response/
[$data="name"$]            → Searches: data/, default/, root
```

**Unspecified type (searches everywhere):**
```smile
[$anything="name"$]        → Searches all folders for match
```

If type not recognized as chain/doc/data, searches entire agent structure.

Old terminology auto-maps:
- `Module/pipeline` → `chain`
- `section/document` → `doc`  
- `var/variable` → `data`

## Rules

**No nested references:**
```
agent.smile → chain.smile ✓
chain.smile → doc.smile ✗ (error: nested reference)
```

**Ambiguous matches error:**
```
If "name" found in multiple locations → error, must specify type
```

**Unspecified types warn:**
```
[$something="name"$] → Searches everywhere, warns to specify type
```

## Version Logging

`.smile-log/version.json` tracks:
- File content hashes
- Version number (increments on change)
- Timestamp
- File list

Version updates only when file content changes.

## Debug Mode

```bash
DEBUG=true node COPY.js
```

Shows resolution paths, warnings, version updates.

## Structure Support

Works with both:
- **New:** chain/, documents/, data/
- **Old:** pipeline/, section/, data/

Case-insensitive, handles snake_case/kebab-case.

## Dependencies

Zero. Uses only Node.js built-ins:
- `fs` - File system
- `path` - Path handling  
- `crypto` - Hash generation

---

**Building the prompt engineering tools of the future**
