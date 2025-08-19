# Smile Prompt Language

Smile is an experimental markup for writing prompts in a consistent, compact and human friendly way.  
It uses a small set of emojis and brackets to label sections of a prompt so that humans and large language models (LLMs) share the same structure.

## Why Smile?
- **Readable prompts** – separate instruction structure from the text that a model should produce.
- **Portable** – the same prompt works across models like ChatGPT, Claude or Gemini.
- **Token efficient** – symbols such as `(:` and `:)` compress well in modern tokenizers.

## Core Syntax
| Symbol | Purpose | Example |
|--------|---------|---------|
| `(: Section (` | begin a named section | `(: Format (` |
| `)` | close the current section | `) End section :)` |
| `:)` | close the whole Smile block | `) End section :)` |
| `[: note ]` | inline model-facing annotation | `[: tone- friendly ]` |
| `:- comment )` | human comment that ends with `)` | `:- explain briefly )` |
| `{placeholder}` | area to be filled by the model | `The topic is {subject}` |

## Example
```text
(: Name tag (
[: reply in plain English ]
{Your answer here}
) End prompt :)
```
Copy this into your favourite LLM. If the model responds with a "Name tag", it understands Smile.

## Repository Layout
- `prompt/` – example prompts written in Smile.
- `response/` – sample outputs from LLMs.
- `import/` – raw text used in experiments.
- `python/` – prototype scripts for transforming prompts.

## Status
This project is a work in progress. Smile version **0.4** is still evolving and may change.

## Next Steps
We're preparing experiments that compare unstructured prompts against Smile-formatted prompts on downstream tasks like sentiment analysis.

## Contribute
Help build a dataset of prompts that will be automatically converted for better performance. Share examples already written in Smile or send raw prompts you'd like translated.

- ⭐ **Star [the repository](https://github.com/DrPrompt/smile)** to help others discover Smile and signal that structured prompting matters to you.
- 🔔 **Follow [DrPrompt on GitHub](https://github.com/DrPrompt)** for updates as we publish new syntax, tooling, and benchmark results.
- 🛠️ **Contribute on GitHub** by opening [issues](https://github.com/DrPrompt/smile/issues) or [pull requests](https://github.com/DrPrompt/smile/pulls) with your own Smile snippets or conversion ideas.

