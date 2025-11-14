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
[$composition="name"$]     → Searches: composition/, chain/, pipeline/
[$comp="name"$]            → Shorthand for composition
[$module="name"$]          → Searches: module/, document/, documents/*, section/*
[$mod="name"$]             → Shorthand for module  
[$mod/prompt="name"$]      → Searches: module/prompt/, document/prompt/, section/prompt/
[$mod/response="name"$]    → Searches: module/response/, document/response/, section/response/
[$data="name"$]            → Searches: data/, default/, root
```

**Note:** Use `comp` (short for composition) and `mod` (short for module) in your .smile files for brevity.

**Unspecified type (searches everywhere):**
```smile
[$anything="name"$]        → Searches all folders for match
```

If type not recognized as composition/mod/data, searches entire agent structure.

Old terminology auto-maps:
- `chain/pipeline` → `composition`
- `document/section` → `module` (shorthand: `mod`)
- `var/variable` → `data`

## Rules

**No nested references:**
```
agent.smile → composition.smile ✓
composition.smile → module.smile ✗ (error: nested reference)
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
- **New:** composition/, module/, data/
- **Old:** chain/, pipeline/, document/, documents/, section/, data/

Case-insensitive, handles snake_case/kebab-case.

## Dependencies

Zero. Uses only Node.js built-ins:
- `fs` - File system
- `path` - Path handling  
- `crypto` - Hash generation

---

**Building the prompt engineering tools of the future**
