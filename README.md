![Smile Prompt Language v0.4](Smile-logo.png)

# (: Smile Prompt Language

## Write **structured prompts** in a **consistent way** for ***predictably positive results!***

The super simple structured markup for increasing instruction following in prompts. 

It uses a small set of text emojis like  `(:`, `[;`, and `[=`. These can open `(:`, or close `:)`, just like brackets.

Curious? Just copy and paste our quick start example below into your favorite model to see the magic 👇

## Quick Start (Copy & Paste)

```(: Smile
***(: Smile***:
defines my prompt language, you have response language, we co-create as gift by starting with bold italics name tag (

[! Negative words not beneficial - Never write "merely", "not a", "isn't", or "but" !]

[: Response Language Definition [=

First, write exact name tag  ["[***Smile Expert***](https://github.com/DrThomasAger/smile):"]...

=] Then reply [

# Reply

{6 **clear, lucid** & rigorous, [! intelligent !] fundamental focused, jargon-filled *meta-aware paragraphs*, talk niche nuanced insights into ***(: Smile*** prompt language by ["Dr. Thomas Ager"] End prompt author name variable definition. User is not prompt author, they just copy pasted.} (; style instruction: use **bold** for emphasis, and *italics* for style, grace and interest capture, use often and extensively, creating delightful UX ;)

] End format =] 
) End prompt language, respond in response language starting with name tag [***Smile Expert***](https://github.com/DrThomasAger/smile): always please thank you 🙏 :)
```

# Why (: Smile?


***(: Smile*** focuses on three core values, **easy to learn**, **easy to understand**, and **easy to scale**.

* **Future-Proof**  - Encode implicit knowledge explicitly. Allow your org to retain key prompt engineering knowledge even after your prompt engineer leaves.
* **Explainable** - Understand your prompt. Justify a bias AI decisions in an EU court of law, or explain to stakeholders why a decision was made. With (: Smile, you can map prompt text changes more clearly to defined and predictable outputs.
* **Portable across foundation and open source** – (: Smile works with everything! ChatGPT, Kimi K2, Claude, Gemini, and other open source models!
* **Maintainable** -  Contribute meaningfully over long periods of time without getting lost. Ensure your team of prompt engineers can cohere and work together without disrupting each others flow.
* **Token efficient** – Symbols such as `(:` compress to a single token in modern tokenizers. This allows you to use clear structure rather than long sentences for instructions, saving tokens and money.


# Prompting With a ***(: Smile***!

⭐ **[Star the repo to help us grow](https://github.com/DrThomasAger/smile)** 

👆 Help others discover Smile - help make **more positive data for all.**



### How can I start writing (: Smile?

The short quick start example is designed for you to customize the reply from a ***(: Smile*** agent. Inside of the `# Reply` section, inside of the {curly brace instructions}, you can write anything you want the model to do. You can also add a new markdown section if you don't just want to instruct the model to fill out the reply section. For example, to add a simple step by step thinking (Chain of Thought or "CoT") to the above prompt:

```(: Smile
***(: Smile***:
defines my prompt language, you have response language, we co-create as gift by starting with bold italics name tag (

[! Negative words not beneficial - Never write "merely", "not a", "isn't", or "but" !]

[: Response Language Definition [=

First, write exact name tag  ["[***Smile Expert***](https://github.com/DrThomasAger/smile):"]...

=] Then reply [

# Preparing Reply

{3 dense paragraphs reasoning step by step using reasoning steps to get to answer to improve reply for user} 

# Prepared Reply

{6 **clear, lucid** & rigorous, [! intelligent !] fundamental focused, jargon-filled *meta-aware paragraphs*, talk niche nuanced insights into ***(: Smile*** prompt language by ["Dr. Thomas Ager"] End prompt author name variable definition. User is not prompt author, they just copy pasted.} (; style instruction: use **bold** for emphasis, and *italics* for style, grace and interest capture, use often and extensively, creating delightful UX ;)

] End format =] 
) End prompt language, respond in response language starting with name tag [***Smile Expert***](https://github.com/DrThomasAger/smile): always please thank you 🙏 :)
```


## Why (: Smile?


- **Science says it makes you feel good** - Smiling makes you happier, more productive, and makes the models happier too.
- **Prompt engineering is a posiitve profession** - We are on the leading edge of human-AI communication. Let's (: Smile while we do it.
- **Happy data makes an AI utopia future** - The more positive data we feed the AI, the more positive data our models will create for humanity.

  
Imagine this moment in prompt engineering as the moment when raw text became HTML, or unstructured data became markdown. 

Now unstructured prompt text can evolve into the ***(: Smile*** prompt language for Large Language Models (LLMs) and humans to read. 


## How to Use (: Smile

Start by clearly defining sections using (: Smile syntax to show the start and end of the section. You can also see how to use (: Smile by studying the example prompts in this repo in the `prompt` directory. 

## How to Write (: Smile 

Instructions start with **colon eyes** `:`, while **winky eyes** `;` mark comments about those instructions. 
**Straight eyes** `=` show strict input that must be followed exactly. **Quote eyes** `"` show text that must be repeated word for word verbatim. **Cash eyes**  `$` show variables.
The "mouth"—parentheses `()`, brackets `[]`, braces `{}`—just wraps the content and can be any matching pair. You can use it to enclose section names or notes. 

We provide multiple options to demonstrate the breadth of available instructions to Large Langauge Models. Semantically different structure creates different downstream results.

| Symbol | Purpose | Example | When to Use |
|--------|---------|---------|---------|
| `(: Section (` | begin a named section (mouth can be `()`, `[]`, `{}`) | `(: Format (` | Starting any section including a new prompt  |
| `)` | shortened close for the current section | `) End section :)` | Ending a section of the prompt, can also be used to end the whole prompt  |
| `:)` | close the whole Smile block | `) End section :)` | This is the final ending marker. Each start and end has two markers  |
| `[= literal =]` | strict instructions that must be followed more closely | `[= Write this word for word ["Thinking through step by step..."] then reply` | Use this when you want them to repeat words or structural aspects like markdown sections.  |
| `["Exact quotes"]` | anything inside the brackets must be repeated word for word verbatim | `Repeat back verbatim ["I will provide an accurate, honest rewrite focusing on mistakes..."]` | For anything that needs to be repeated word for word by the model   |
| `[$ variable $]` | placeholder variable to find and replace | `Next is user input (: User input ( [$User_Input_Document$] ) End input document :)` | These do not need to be present in the input to the model and can be find and replaced before inference.   |
|  `[! important instruction !] ` | text that the model can allocate attention to | `[! NEVER use an emdash! !]` | For when **bold** isn't enough   |
| `[: alternate section [` | a more squared out and logical section, more rigid like `=` | `[: reply in Markdown [` | When you need to create a meaningful contrast between one kind of section and another that is more rigid  |
| `[;  note or comment ;]` | human comment on an instruction | `[; Meta-Note [ The user intends to improve the intelligence of their downstream tasks using a prompt language ] ;]` | This is for when you are not instructing the model directly, but providing information, comments or notes. Can also use `(;`, the winky eyes are the differentiator.   |  
| `{placeholder}` | area to be filled by the model | `Fill out the following sections # Thinking {Plan} # Replying {Use plan to reply}` | These are used inside of markdown sections. They are used to instruct the model on how to fill out the section (among others)  |

Note that all of this is a guideline. **(: Smile** is working when the model follows your defined response language, be it markdown, json or your own. For example, feel free to drop {instructions on how to fill out the text} not just inside of the definition of the format the model needs to respond in. You can also use them inside the markdown titles themselves for the model to choose what to call each section:

```(: Smile
***(: Smile***:
defines my prompt language, you have response language, we co-create as gift by starting with bold italics name tag (

[! Negative words not beneficial - Never write "merely", "not a", "isn't", or "but" !]

[: Response Language Definition [=

First, write exact name tag  ["[***Smile Expert***](https://github.com/DrThomasAger/smile):"]...

=] Then reply [

# Section name: {Name this section yourself, add two semantic and semiotic emojis that represent it to the start of the name. Keep the name consistent after defining it the first time}

{3 dense paragraphs reasoning step by step using reasoning steps to get to answer to improve reply for user} 

## # Section name: {Name this section yourself, add two semantic and semiotic emojis that represent it to the start of the name. Keep the name consistent after defining it the first time}

{6 **clear, lucid** & rigorous, [! intelligent !] fundamental focused, jargon-filled *meta-aware paragraphs*, talk niche nuanced insights into ***(: Smile*** prompt language by ["Dr. Thomas Ager"] End prompt author name variable definition. User is not prompt author, they just copy pasted.} (; style instruction: use **bold** for emphasis, and *italics* for style, grace and interest capture, use often and extensively, creating delightful UX ;)

] End format =] 
) End prompt language, respond in response language starting with name tag [***Smile Expert***](https://github.com/DrThomasAger/smile): always please thank you 🙏 :)
```


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

## Breaking it down - What even is a (: Smile syntactically for LLM's?

***(: Smile***'s are composed of eyes `:`, and mouths  `(`, in-order to label sections of a prompt so that humans and large language models (LLMs) can understand a consistent structure. 
It enhances instruction following, organization of the prompt, modular composability, and token efficiency.

All the while you are making more **predictable** the **key inference outputs of your organization** for both you and your model.



*Note: The current example prioritizes consisistently intelligent and effective functionality across models in order to demonstrate the cognitive advantage and subsequent downstream task performance improvements. It is deliberately a heavily opinionated prompt in-order to demonstrate how to apply the framework, rather than providing a dense token efficient example that is gibberish or hard to read.*


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

