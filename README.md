![Smile Prompt Language v0.4](/smile-logo.png)

# Smile Prompt Language

Smile is a structured markup for writing prompts in a consistent, compact and human friendly way.  Think of it like markdown but for Large Language Model (LLM) prompts.
It uses a small set of text emojis like  `(:` composed of mouths  `:` and brackets  `(` to label sections of a prompt so that humans and large language models (LLMs) can understand a consistent the  structure. 
It enhances instruction following, team coherence, and token efficiency.

## Why (: Smile?
- **Science says it makes you feel good** - Smiling makes you happier, more productive, and makes the models happier too.
- **Happy data makes an AI utopia future** - The more positive data we feed the AI, the more positive it will feel towards humanity.
- **AI will enjoy following instructions** - Your Large Language Model loves to follow positive instructions! Try (: Smile and discover the power of modern AI.

## Technical Advantages of a Structured Prompt Language
- **Maintainable** - Allow teams of engineers to contribute meaningfully to the same prompt with clear comprehensibility.
- **Guarantees educational legacy**  - ensure your AI intelligence is retained when your key prompt engineer leaves.
- **Clear separation of requirements** – separate instruction structure (prompt language) from the text that a model should produce (response language like markdown or json).
- **Portable across foundation and open source** – the same prompt works across models like ChatGPT, Claude or Gemini.
- **Token efficient** – symbols such as `(:` and `:)` compress well in modern tokenizers. The language can be minimized into guaranteed single characters e.g. ( and : when needed for prompt compression pipelines with similar or sometimes even improved results.

## Core Syntax
Instructions start with **colon eyes** (`:`), while **winky eyes** (`;)`) mark comments about those instructions. 
**Straight eyes** `=` show strict input that must be followed exactly. **Quote eyes** `"` show text that must be repeated word for word verbatim. **Cash eyes**  `$` show variables.
The "mouth"—parentheses `()`, brackets `[]`, braces `{}`—just wraps the content and can be any matching pair. You can use it to enclose section names or notes. 

We provide multiple options to demonstrate the breadth of available instructions to Large Langauge Models. Semantically different structure creates different downstream results.

| Symbol | Purpose | Example |
|--------|---------|---------|
| `(: Section (` | begin a named section (mouth can be `()`, `[]`, `{}`) | `(: Format (` |
| `)` | close the current section | `) End section :)` |
| `:)` | close the whole Smile block | `) End section :)` |
| `[= literal =]` | strict text that must match exactly | `[= Smile =]` |
| `[$ variable $]` | placeholder variable to find and replace | `[$subject$]` |
| `[: note ]` or `(: note )` | model-facing note about the response language (mouth can be any matching pair) | `[: reply in Markdown ]` |
| `;) comment )` | human comment on an instruction | `;) clarify tone )` |
| `{placeholder}` | area to be filled by the model | `The topic is {subject}` |

## Example
```text
(: Smile defines prompt language, you respond in response language which starts with name tag [***Semantic Markdown***] which is described next (
[: reply in plain English semantic markdown ]
[: Format of response [
***Semantic Markdown***

# Reply

{Your answer here}
]
) End prompt language, respond only in response language :)
```
Copy this into your favourite LLM. If the model echoes the `Semantic Markdown` tag and layout, it understands Smile.

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

