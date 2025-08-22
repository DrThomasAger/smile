![Smile Prompt Language v0.4](Smile-logo.png)

# (: Smile Prompt Language

Write **structured prompts** in a **consistent way** for ***predictably positive results!***

Imagine this moment in prompt engineering as the moment when raw text became HTML, or unstructured data became markdown. 

Now unstructured prompt text can evolve into the ***(: Smile*** prompt language for Large Language Models (LLMs) and humans to read. 

***(: Smile*** is a structured markup for increasing instruction following in prompts. It does this by providing clear sections when writing prompts using token efficient, understandable to the model and the human, and positive ***(: Smile*** markup!

⭐ **[Star the repo to help us grow](https://github.com/DrThomasAger/smile)** 

👆 Help others discover Smile for **more positive prompt engineering for all.**


# (: Smile Basics
It uses a small set of text emojis like  `(:`, `[;`, and `[=`.

These can open `(:`, or close `:)`, just like brackets.

## Breaking it down - What even is a (: Smile syntactically for LLM's?

***(: Smile***'s are composed of eyes `:`, and mouths  `(`, in-order to label sections of a prompt so that humans and large language models (LLMs) can understand a consistent structure. 
It enhances instruction following, organization of the prompt, modular composability, and token efficiency.

All the while you are making more **predictable** the **key inference outputs of your organization** for both you and your model.

## Why (: Smile?
- **Science says it makes you feel good** - Smiling makes you happier, more productive, and makes the models happier too.
- **Happy data makes an AI utopia future** - The more positive data we feed the AI, the more positive it will feel towards humanity.



## Quick Start

Copy and paste this into your favourite LLM now. 
```(: Smile
(: Smile defines prompt language, you respond in response language which starts with name tag [***Semantic Markdown***] which is described next (
[: reply in plain English semantic markdown ]
[: Format of response [
***Semantic Markdown***

# Reply

{Your answer here. Write semantically, with many long comprehensive and extensive paragraphs, using jargon that adds niche nuances}
]
) End prompt language, respond only in response language :)
```
If the model echoes the `Semantic Markdown` tag and layout, it understands Smile.

Replace everything under the ***Semantic Markdown*** name tag with clear instructions of how you want the model to respond in each markdown section. In our default example above, we have asked the model to speak lengthily and use jargon. This approximates a domain expert.

### Technical Advantages of a Structured Prompt Language
- **Maintainable** -  Contribute meaningfully to the same prompt with clear comprehensibility over long periods of time to a team of prompt engineers.
- **Future-Proof**  - Allow teams of engineers to retain your prompt engineering knowledge even after your key prompt engineer leaves.
- **Explainable** - Map outcomes to prompt text changes more clearly with semantic markdown, allowing you to justify any AI decisions in a court of law more clearly.
- **Portable across foundation and open source** – Transform your text prompts so that they work across models like ChatGPT, Kimi K2, Claude or Gemini.
- **Token efficient** – Symbols such as `(:` and `:)` Compress well in modern tokenizers. 

## How to Use (: Smile

Start by clearly defining sections using (: Smile syntax to show the start and end of the section. You can also see how to use (: Smile by studying the example prompts in this repo in the `prompt` directory. 

## How to Write (: Smile 

Instructions start with **colon eyes** `:`, while **winky eyes** `;` mark comments about those instructions. 
**Straight eyes** `=` show strict input that must be followed exactly. **Quote eyes** `"` show text that must be repeated word for word verbatim. **Cash eyes**  `$` show variables.
The "mouth"—parentheses `()`, brackets `[]`, braces `{}`—just wraps the content and can be any matching pair. You can use it to enclose section names or notes. 

We provide multiple options to demonstrate the breadth of available instructions to Large Langauge Models. Semantically different structure creates different downstream results.

| Symbol | Purpose | Example |
|--------|---------|---------|
| `(: Section (` | begin a named section (mouth can be `()`, `[]`, `{}`) | `(: Format (` |
| `)` | shortened close for the current section | `) End section :)` |
| `:)` | close the whole Smile block | `) End section :)` |
| `[= literal =]` | strict text that must match exactly | `Write this word for word [= "Thinking through step by step..." =]` |
| `[$ variable $]` | placeholder variable to find and replace | `Next is user input (: User input ( [$User_Input_Document$] ) End input document :)` |
|  `[! important instruction !] ` | text that the model can allocate attention to | `[! NEVER use an emdash! !]` |
| `[: note ]` or `(;` | model-facing note about the response language (mouth can be any matching pair) | `[: reply in Markdown ] (; Ensure that you **bold** key words` |
| `[; alternate note or comment [` | human comment on an instruction | `[; this is length instruction only [ write comprehensively, extensively, with multiple lengthy paragraphs` |
| `{placeholder}` | area to be filled by the model | `Fill out the following sections # Thinking {Plan} # Replying {Use plan to reply}` |


## (: Smile Roadmap

### Phase 1 — **Research**
- **✅March 2023 – June 2025**

### Phase 2 — **Define (: Smile Syntax**
- **✅June 2025 – September 2025** *Ahead of schedule!*

### Phase 3 — **Convert Prompt Archive**
- **October 2025 – March 2026**  
Convert existing prompt archive into a **handwritten gold standard (: Smile Syntax)**.

### Phase 4 — **Test, Verify, Validate**
- **April 2026 – September 2026**  
Test and validate prompts on **downstream tasks and metrics**.

### Phase 5 — **Introduce New Tooling**
- **October 2026 – March 2027**  
Develop and launch tools for:  
  - **Prompt compression**  
  - **Integration into VS Code**  
  - **Additional utilities**

## Repository Layout
- `prompt/` – example prompts written in ***(: Smile***.
- `response/` – sample outputs from LLMs.
- `import/` – raw prompt text to be converted into ***(: Smile*** unedited and unmaintained.
- `python/` – prototype scripts for transforming prompts.

## Contribute
Help build a dataset of prompts that will be automatically converted for better performance. Share examples already written in Smile or send raw prompts you'd like translated.

- ⭐ **[Help us grow by **Starr**ing the repository](https://github.com/DrThomasAger/smile)** to help others discover Smile for **more positive prompt engineering for all.**
- 🔔 **Follow [DrThomasAger on GitHub](https://github.com/DrThomasAger)** for updates as we publish new syntax, tooling, and benchmark results.
- 🛠️ **Contribute on GitHub** by opening [issues](https://github.com/DrThomasAger/smile/issues) or [pull requests](https://github.com/DrPrompt/smile/pulls) with your own Smile snippets or conversion ideas.

