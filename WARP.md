# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

**Smile Prompt Language** is a formal markup language for structured LLM instructions using emoticons. It provides a structured approach to prompt engineering that separates concerns between prompt language and response language, enabling maintainable, consistent, and verifiable instruction following across multi-turn and multi-agent AI applications.

The project includes:
- Language specification and examples in the main README.md
- Modular prompt patterns in the `prompt/` directory
- A compiler (`COPY.js`) that resolves references and builds complete prompts
- Interactive HTML-based prompt composer (`smile-composer.html`)

## Core Concepts

### Smile Syntax
Smile uses emoticon-like delimiters to indicate semantic meaning:
- `(: ... :)` - Flexible sections
- `[: ... :]` - More rigid/structured sections  
- `[= ... =]` - Exact/literal instructions that must be followed strictly
- `[! ... !]` - Important/emphasized instructions
- `[" ... "]` - Verbatim text to repeat
- `[$ ... $]` - Variables for pre-inference substitution
- `[; ... ;]` or `(; ... ;)` - Comments/notes for humans
- `{ ... }` - Placeholders for model to fill

### Name Tags
Smile prompts require LLMs to begin responses with a **name tag** (e.g., `***(: Smile Expert***:`). This acts as:
- A handshake confirming the model understands instructions
- A persistent role anchor across multi-turn conversations
- A verification mechanism (if no name tag appears, the prompt needs adjustment)

### Separation of Concerns
Prompt language (Smile syntax) is explicitly separated from response language (markdown, JSON, etc.) to prevent context bleed and enable clear verification of instruction following.

## Development Workflow

### Working with Prompts

**Structure:**
```
prompt/
├── [prompt-name]/
│   ├── [prompt-name].smile          # Main agent file
│   ├── chain/                       # Sequential instruction modules
│   ├── document/ (or doc/)          # Content/definition modules
│   ├── data/                        # Data files (any extension)
│   ├── .smile-log/                  # Auto-generated version tracking
│   │   ├── version.json
│   │   └── warnings.json
│   ├── COMPILED_OUTPUT.txt          # Generated complete prompt
│   └── COPY_README.md               # Compiler documentation
```

**Reference Types in .smile files:**
- `[$chain="name"$]` - Chain/pipeline modules
- `[$doc="name"$]` or `[$document="name"$]` - Document modules  
- `[$data="name"$]` - Data files
- `[$doc/prompt="name"$]` - Specific subdirectory references
- `[$anything="name"$]` - Searches everywhere (warns to specify type)

### Compiling Prompts

To compile a Smile prompt (resolve all references into a single output):

```bash
cd prompt/[prompt-name]
node COPY.js
```

**On Windows:**
```powershell
cd prompt\[prompt-name]
node COPY.js
# or
.\COPY.bat
```

**Output:**
- `COMPILED_OUTPUT.txt` - Complete resolved prompt ready to use with LLMs
- `.smile-log/version.json` - Version tracking based on content hashes
- `.smile-log/warnings.json` - Compilation warnings, errors, and fix suggestions

**Debug Mode:**
```bash
DEBUG=true node COPY.js
```

### Compiler Rules

**Important constraints:**
- No nested references (agent → chain ✓, chain → doc ✗)
- Ambiguous matches cause errors (must specify type)
- Unspecified types search everywhere but generate warnings
- Always outputs .txt even if some tokens fail resolution
- Errors are inlined with readable stubs, compilation continues

**Name canonicalization:**
- Case-insensitive
- Strips spaces, hyphens, underscores
- Removes `.smile` and `.txt` extensions

## File Organization

### Main Files
- `README.md` - Complete language specification, philosophy, examples, and patterns
- `smile-composer.html` - Interactive web-based prompt composer (open directly in browser)
- `.gitignore` - Version control exclusions

### Directories
- `prompt/` - Modular Smile prompt examples and patterns
  - `Convert_Into_2_Emojis/` - Example agent with compiler
  - `make_smile_gui/` - GUI generation prompt
- `archive/` - Historical content, examples, and experimental work
  - `examples/` - Various Smile examples
  - `python/` - Python prototype scripts
  - `import/` - Unstructured prompts for conversion
  - `output/` - Generated outputs
- `.github/` - GitHub configuration (funding)
- `.clj-kondo/`, `.lsp/` - Editor tooling (Clojure)

## Testing Prompts

Smile prompts are tested by:
1. **Copy-pasting into LLM chat interfaces** (ChatGPT, Claude, Gemini, Kimi, etc.)
2. **Verifying name tag appears** at start of response
3. **Checking no prompt syntax bleeds** into response (no `(:`, `[:`, `[=`, etc. in output)
4. **Confirming response format** follows defined structure
5. **Testing across multiple turns** for instruction consistency

**Compatible LLMs:**
- OpenAI (ChatGPT, GPT-5)
- Anthropic Claude
- Google Gemini  
- Moonshot AI (Kimi)
- Mistral
- DeepSeek
- Perplexity
- Cohere

## Architecture Principles

### Token Efficiency Philosophy
- Start with comprehensive structure to maximize capability and instruction following
- Remove structure only if it doesn't reduce instruction following
- Test empirically: if model follows instructions with name tag and no syntax bleed, structure is sufficient
- More structure becomes essential as prompt size/complexity increases

### Verification Strategy
**Success indicators:**
- Name tag present at start of every response
- No prompt language in response output
- Curly brace placeholders fully replaced (not visible in output)
- All key instructions consistently followed
- Response language matches definition

**Failure indicators:**
- Missing or incorrect name tag → prompt needs rewriting
- Prompt syntax in response → increase meta-description or reduce excessive structure
- Unresolved placeholders → clarify placeholder instruction semantics

### Modular Composition
Prompts are built from discrete sections:
- **Role** - Identity and scope
- **Task** - What to do with data
- **Data** - Raw context (use `[$...$]` variables)
- **Tone** - Voice and stance
- **Response Language** - Output format blueprint
- **Style** - Visual conventions (bold, italics, etc.)
- Create custom sections as needed (Validation, Risks, Examples, etc.)

## Common Patterns

### Name Tag Pattern
```
***(: [Role Name]***:
```
Must be exact, bold+italic, with colon, followed by newline.

### Chain of Thought (CoT)
Structure responses with preparation section (dense, jargon-rich, machine-optimized) followed by user-facing section (clear, simple, positive).

### Identify Negatives & Rewrite Positively
Have model identify negative constructions in preparation and explicitly rewrite them as positive articulations.

### Response Section Instructions
Use `{curly braces}` to tell model what to fill in each markdown section:
```
# Section Name
{Instructions for what goes here}
```

## Dependencies

**Compiler:** Zero external dependencies
- Node.js built-ins only: `fs`, `path`, `crypto`
- Requires Node.js ≥14

**HTML Composer:** 
- React 18 (CDN)
- Babel standalone (CDN)
- No build step required, open directly in browser

## Additional Resources

- **Author:** Dr. Thomas Ager ([@DrThomasAger](https://linkedin.com/in/drprompt))
- **License:** MIT
- **Funding:** PayPal donations accepted ([paypal.me/hanjopurebuddha](https://paypal.me/hanjopurebuddha))
- **Compatible with:** LangChain, Guidance, and other LLM frameworks (Smile operates at syntax level)

## Philosophy Notes

Smile formalizes emergent prompt engineering practices:
- Delimiter-based structure separation
- Clear input vs. instruction distinction  
- Repeated markers for emphasis
- Positive language bias (science-backed: smiling improves mood, productivity, collaboration)

The emoticon syntax is intentionally friendly while being functionally distinct from output languages (markdown/JSON/HTML), enabling reliable verification of instruction following.
