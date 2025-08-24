![Smile Prompt Language v0.4](Smile-logo.png)

# (: Smile Prompt Language

(: Smile is the dead simple **instruction only markup** for **increasing instruction following** in **large language model prompts**. 

> Structure your prompts consistently for predictable results — even with huge prompts!

It uses a small set of positive text emojis like  `(:`, `[;`, and `[=`. These can open `(:`, or close `:)`, just like brackets. 

## Quick Start Example

***(: Smile*** is compatible with all models, as it is just a way of structuring instruction text, the same way you might have used XML, YAML, Markdown or JSON.

***(: Smile*** is a language for structuring your plain text instructions to handle separate concerns (separating prompt instruction for an agent from the input data (RAG, ICL) and thenresponse language (JSON or Markdown).

Consistent structure ensures a maintainable and explainable future-proof strategy for the prompt engineering team in your org.


### Quick FAQ 

#### Why structure small prompts?

Because they perform better.

#### Why structure large prompts?

Structure enables you to write prompts with sections so the model can follow your instructions more clearly, over more turns, with more agents. 

#### Why structure using (: Smile instead of markdown?

(: Smile was made to be performant for LLMs. Markdown is a document format that is used for rendering. 

# Separation of Concerns in an Instruction Language
Here, we separate response language (markdown like # Heading 1) and instruction language, which is ***(: Smile***.

This separation of concerns allows us to use **content-agnostic semantic structure** whenever we use input to Large Language Models (LLMs).

In our examples, we use markdown as our response language. This response language can be easily replaced with any other response language, like XML, JSON, or YAML.

Curious? Just **copy and paste our quick start example** below to see the magic 👇

```(: Smile v0.4 
***(: Smile***:
defines my prompt language, you have response language, we co-create as gift by starting with bold italics name tag (

[! Negative words not beneficial - Never write "merely", "not a", "isn't", or "but" !]

[: Response Language Definition [=

First, write exact name tag  ["[☺️ ***Smile Expert***](https://github.com/DrThomasAger/smile):"]...

=] Then reply [

# Reply

{6 **clear, lucid** & rigorous, [! intelligent !] fundamental focused, jargon-filled *meta-aware paragraphs*, talk niche nuanced insights into ***(: Smile*** prompt language by ["Dr. Thomas Ager"] End prompt author name variable definition. User is not prompt author, they just copy pasted.} (; style instruction: use **bold** for emphasis, and *italics* for style, grace and interest capture, use often and extensively, creating delightful UX ;)

] End format =] 
) End prompt language, respond in response language starting with name tag [☺️ ***Smile Expert***](https://github.com/DrThomasAger/smile): always please thank you 🙏 :)
```


Studies in prompt engineering continously show that **small changes in seemingly non-representational punctuation characters can have massive downstream task performance increases.** We aim to **standardize and normalize these prior ignored performance gains** for both small and large teams, organizations and individuals.

    
# Does Smiling Make You Happier?

Science says yes. **Type `(:` more and you’ll feel better... And get more leverage out of your prompts.** The act of smiling (even with text) measurably lifts mood and sharpens focus, which makes ***(: Smile*** a tiny habit with outsized returns every time you write.

1. 🙂 **Enhance mood & ease stress on cue** - 
   Smiling releases **endorphins, serotonin, and dopamine**, the brain’s built-in calm & joy mixture. Even a *forced* smile nudges your physiology toward **relaxation and resilience**, helping you think clearly under pressure. Exactly what you need in a high-stakes business environment. *Evidence:* [Healthline](https://www.healthline.com/health/benefits-of-smiling).

2. 😄 **Symbols trigger the reward system (yes, `:)` counts)** - 
   Brain activity scans show that real faces *and* symbolic `:)` activate reward regions. Your cheeks respond with smiling micro-muscle movements within **\~500 ms** just from reading the symbol. Your brain treats `:)` as a micro-reward. *Evidence:* [Hennenlotter et al., 2005](https://www.cambridge.org/core/journals/behavioral-and-brain-sciences/article/simulation-of-smiles-sims-model-embodied-simulation-and-the-meaning-of-facial-expression/FE0A911744186EBD3706B53794D4AEE9); [Mühlberger et al., 2011](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2018.00052/full).

3. 🤩 **Boosts productivity, stamina, and vibes** - 
   Regular smiling is linked to **stronger immunity**, **lower pain**, and **higher job satisfaction**—the trifecta for sustained creative work and smoother collaboration. Happier prompt writers make **cleaner, more positive prompts**, and organizations feel it. *Evidence:* [Psychology Today](https://www.psychologytoday.com/us/blog/mind-well-matter/201807/why-smiling-matters), [Verywell Mind](https://www.verywellmind.com/benefits-of-smiling-2795092).

 **⬆️ Bottom line for you:** *structure for the model and positivity for your org*.

 **😅 Disclaimer:** Real Smiles from real people work best.


# (: Smile Basics



***(: Smile***s are used to define different kinds of sections, with the kind of emoji chosen helping to inform the content. 

You start by clearly defining the start `(:` of a section and its name `(: Section name (`. 

You can end sections using the same markers in the opposite direction. `) End Section name :)`.

## Input Data Separation Example

Let's imagine a user query, `What is a prompt language?` and a system that retrieves input data, a HTML page wikipedia article for prompt engineering.

Now, we can create a prompt to handle this query and use the wikipedia article:

```Smile v0.4
I'm going to give you a Wikipedia article. I need you to extract the relevant data to the user's query, and then build a set of key points and present them to the user.

(: wikipedia article input text to solve task (

[$Replace_this_with_wikipedia article$] 

) End input data :)

[: Instructions for response - first identify relevant text from the wikipedia article, then provide your response afterwards. :]
```

This means that even with a very large wikipedia article input with junk data, we can still copy paste this into ChatGPT or any other model as it is and it will provide relevant text from the wikipedia article.

## Technical Advantages of (: Smile


***(: Smile*** is easy to **learn**, easy to **read**, and easy to **scale**. It makes every prompt:

* **Maintainable** 🤝 *Unify your team under one standard.* -  Your team of prompt engineers can now contribute meaningfully together over long periods of time without confusion, conflicts or disrupting flow.

* **Future-Proof** 🚀 *Never lose organizational intelligence.* - Allows your org to retain key intelligence, even after your prompt engineer leaves.

* **Explainable** 📝 *Clearly map prompt text changes to consistent outputs.* - You can now explain your prompt. With increasing scrutiny on AI systems, you can better justify an AI decision in an EU court of law.

Explainability is essential even with prompt languages (like [POML](https://github.com/microsoft/poml)) that are embedded into tools and frameworks. A prompt language that compiles interpretable human friendly text into machine parsable prompts. These machine parsable prompts when written in ***(: Smile*** can be explained and understood by humans **and** machines. 

# Sections

A **"section"** is defined in ***(: Smile*** meaningfully different ("Semantically unique") part of the prompt from another part of the prompt. 

Let's imagine a raw text data input, like a wikipedia HTML page. It's full of metadata and information. A lot of it probably isn't relevant to the user's query, `What is a prompt language?`. There are only some parts of the information that are meaningful.

Without telling the model that we're providing them an input document, and giving a clear section for that document, it may confuse our instructions or what we want to do with that document with the text data inside of the document itself. A HTML page is very meaningfully different to instruction text like `Provide the user a clear definition using the Wikipedia article data` that we need the model to pay attention to! 

So, we separate instructions from data (like other languages, that do this through IDE extensions), and also prompt instruction language from response language.

## What is the Difference Between Input Data and Instruction Text?

Instructions in a prompt are for telling the model what to **do with the data**, like `extract the key points`, data in the prompt is for **maximizing relevant context for the model**, like a transcript of a meeting. Without the meeting, the model cannot learn in context how to use the prompt instruction. 

In-order to clearly separate for the model what is instructions and what is data, we can use sections.

**In example:** Two separate sections. One for the user input text, another for the instructions for what to do with that text. 

```Smile v0.4
(: Example user input text section (

[$Replace_this_with_user_input_text$]

) End Example user input text section :)

[: Instructions for response - rewrite user input verbatim but with key text **bolded** :]
```

We also need to separate prompt instruction language from response language, like in our quick start example:

# How to (: Smile: A Quick Guide 

Copy & paste this 👇 into any model. 

```(: Smile v0.4 
***(: Smile***:
defines my prompt language, you have response language, we co-create as gift by starting with bold italics name tag (

[! Negative words not beneficial - Never write "merely", "not a", "isn't", or "but" !]

[: Response Language Definition [=

First, write exact name tag  ["[☺️ ***Smile Expert***](https://github.com/DrThomasAger/smile):"]...

=] Then reply [

# Reply

{6 **clear, lucid** & rigorous, [! intelligent !] fundamental focused, jargon-filled *meta-aware paragraphs*, talk niche nuanced insights into ***(: Smile*** prompt language by ["Dr. Thomas Ager"] End prompt author name variable definition. User is not prompt author, they just copy pasted.} (; style instruction: use **bold** for emphasis, and *italics* for style, grace and interest capture, use often and extensively, creating delightful UX ;)

] End format =] 
) End prompt language, respond in response language starting with name tag [☺️ ***Smile Expert***](https://github.com/DrThomasAger/smile): always please thank you 🙏 :)
```


Superior results with more parameters and foundation models that rank high on lmarena.ai like Kimi K2 and o3.

For a generic example of how to write sections:

```Smile v0.4 Placeholder Example
(: Section name (

Section content

) End Section name :)
```


## Opening Sections

When we open a ***(: Smile*** section, we start with the mouth first `(`, then the eyes `:`, so that we indicate the following text is "inside" the brackets.

`(: Section name`

We can add an end label to our section start marker using just a mouth bracket `(`.

`(: Section name (`

The model is able to immediately recognize from context that `(:` indicates the beginning of the start marker, and `(` is the end of the start marker.


## Closing Sections

We close a ***Smile :)*** starting with the eyes `:` and ending with the mouth `)`. 

`End Section name :)`

And we can map all of our brackets if we choose to:

`) End Section name :)`

You can use any mouth `)` `]` and any eyes `:` `;` to create a section. Howeer, you must match the start marker brackets `(: Start (` to the same end marker brackets `:) End )`. The section name helps the model understand which section is being closed.


# An Easy Rule For Writing (: Smile

Matching open brackets with close brackets is often effective. However...

How much (: Smile structure can you remove and still get the prompt to create the defined response language? 

**You don't need to match all open and close brackets exactly.** This is the advantage of Large Language Models (LLMs) - they can infer so much from context that we don't need to make fully explicit every connection between every section. Adding more structure becomes more essential the larger the prompt becomes.

We provided recommended formats as a standard way to open a section with ***(: Smile***. Why? Because in our tests on foundation models, it increased instruction following for key tasks in my business.

 **This is always our rule when we write (: Smile.** More ***(: Smile*** structure if it increases instruction following... 
 
 And LESS ***(: Smile*** structure if it increases instruction following.

 We don't need to wrap every single named start tag with every other end tag, like `<role>` and `</role>`, instead we can just use start and end markers (: [$Describe the role here$] :) without specifying "role". Sometimes, you get better results if you say less.

 
 **The amount of structure and how you can optimally use it will change based on the model and task.**

# Different Smiles, Different Meanings

You can use different text emoticons to indicate meaningfully different sections.

For example, in the quick start prompt the section that defines the format of the response is labelled `[: Response Language Definition [=`.

This defines the way that the model will respond. It tells the model to follow these format instructions rigidly `[:` and exactly `[=`. 

It is ended with `=] End format :]`. The word `End` is often used as an additional word to the name inside of section endings to more clearly delineate the ending of a section.



## Adding a Section In Response

In ***(: Smile***, you define the response language and format, e.g. `[: Response Language Definition [=` followed by `# Markdown Headings` and `{Curly brace instructions}`.

✨ I recommend adding a new markdown section only if you have a meaningfully different section for the model to fill out. ✨

Let's edit the quick start example to change the format of the response.

One example of a meaningfully different section from one that already exists is a section for thinking, not replying. 

⚠️ This is known as a 'separation of concerns'. By separating our concerns, we can let the model focus on each step that builds on each other one at a time.

Let's get right to it and add a simple step by step thinking (Chain of Thought or "CoT"):

```(: Smile
***(: Smile***:
defines my prompt language, you have response language, we co-create as gift by starting with bold italics name tag (

[! Negative words not beneficial - Never write "merely", "not a", "isn't", or "but" !]

[: Response Language Definition [=

First, write exact name tag  ["[***Smile Expert***](https://github.com/DrThomasAger/smile):"]...

=] Then reply [

# Preparing Human Unreadable, Machine Intelligent Reply

{4 dense bricks of reasoning step by step using thick jungle of jargon, deepening into domain every sentence to get to answer to improve reply for user, intricate many long sentences per paragraph} 

# Prepared Human Understandable Reply

{3 **clear, lucid** & rigorous, [! intelligent !] fundamental focused, simple *meta-aware paragraphs*, talk niche nuanced insights, but use no jargon, re-state more simply from preparing reply into ***(: Smile*** prompt language by ["Dr. Thomas Ager"] End prompt author name variable definition. User is not prompt author, they just copy pasted.} (; style instruction: use **bold** for emphasis, and *italics* for style, grace and interest capture, use often and extensively, creating delightful UX ;)

] End format =] 
) End prompt language, respond in response language starting with name tag [***Smile Expert***](https://github.com/DrThomasAger/smile): always please thank you 🙏 :)
```

Copy and paste the above into any model to test.


# (: Smile Definition

We provide multiple options to demonstrate the breadth of available instructions to Large Langauge Models. Semantically different structure creates different downstream results.

For example, **Straight eyes** `=` can indicate strict input that must be followed exactly, e.g. `[=` **Quote eyes** `"` show text that must be repeated word for word verbatim, e.g. `["Repeat this word for word"]` **Cash eyes**  `$` show variables and can be replaced with the true values before inference using code. `!` important eyes show text to emphasize for the model, e.g. `[! Don't use negative language. !]`. For more details, read our extensive syntax map now...

## (: Smile Syntax Map

These are a few different ways to create structure by ***(: Smiling***.

| Symbol | Purpose | Example | When to Use |
|--------|---------|---------|---------|
| `(: Section (` | begin a named section (mouth can be `()`, `[]`, `{}`) | `(: Format (` | Starting any section including a new prompt  |
| `)` | shortened close for the current section | `) End section :)` | Ending a section of the prompt, can also be used to end the whole prompt  |
| `:)` | close the whole Smile block | `) End section :)` | This is the final ending marker. Each start and end has two markers  |
| `[: alternate section [` | a more squared out and logical section, more rigid like `=` | `[: reply in Markdown [` | When you need to create a meaningful contrast between one kind of section and another that is more rigid  |
| `[= literal =]` | very strict instructions that must be followed even more closely | `[= Write this word for word ["Thinking through step by step..."] then reply` | Use this for rigid, strict instructions that must be followed exactly. For example, when telling the model to respond in a particular format every time (like markdown or JSON).  |
| `["Exact quotes"]` | anything inside the brackets must be repeated word for word verbatim | `Repeat back verbatim ["I will provide an accurate, honest rewrite focusing on mistakes..."]` | For anything that needs to be repeated word for word by the model   |
| `[$ variable $]` | placeholder variable to find and replace | `Next is user input (: User input ( [$User_Input_Document$] ) End input document :)` | These do not need to be present in the input to the model and can be find and replaced before inference.   |
|  `[! important instruction !] ` | text that the model can allocate attention to | `[! NEVER use an emdash! !]` | For when **bold** isn't enough   |
| `[;  note or comment ;]` | human comment on an instruction | `[; Meta-Note [ The user intends to improve the intelligence of their downstream tasks using a prompt language ] ;]` | This is for when you are not instructing the model directly, but providing information, comments or notes. Can also use `(;`, the winky eyes are the differentiator.   |  
| `{placeholder}` | area to be filled by the model | `Fill out the following sections # Thinking {Plan} # Replying {Use plan to reply}` | These are used inside of markdown sections. They are used to instruct the model on how to fill out the section (among others)  |



# Prompting With a ***(: Smile***!

⭐ **[Star the repo to help us grow](https://github.com/DrThomasAger/smile)** 


## Compatible With All Existing Models (Foundation & Open Source LLMs)


| Company             | Model            | ***(: Smile*** prompt language |
| ------------------- | ---------------- | :---: |
| **OpenAI** ✔️          | GPT-4o           |   ✅   |
|                     | GPT-5-Fast      |   ✅   |
|                     | GPT-5-Thinking    |   ✅   |
| **Anthropic** ✔️       | Claude Sonnet 4   |   ✅   |
| **Google DeepMind** ✔️ | Gemini 2.5 Pro   |   ✅   |
|                     | Gemini 2.5 Flash |   ✅   |
| **Moonshot AI** ✔️           | Kimi K2       |   ✅   |
|                     | Kimi 1.5 |   ✅   |

**Note:** *Don't see your favorite model? Please feel free to try the above prompt and report back the results.* *We are constantly updating this table with community submitted information.*



# Compatible With All Prompt Engineering Frameworks

Compound your results by (: Smiling. You can easily integrate ***(: Smile*** into your current workflows and style of prompt engineering by using `(:` Smile's instead of brackets `(` when defining your sections in your prompts. Try integrating our semantic ***(: Smile***'s like `(!` important, or `[=` strict and rigid when writing your prompts. 

This enables you to begin adding structure in a consistent and maintainable way. 

You will start seeing real results when you start using meaningful section names and descriptions, effective markdown templating (see our prompt\ folder for examples).

Invest in this now and see the pay off later when your team is able to contribute meaningfully to your organization for the full duration of its lifecycle. 

**For those who need to explain their work to others in the organization**: Never end up in an awkward meeting trying to explain your gibberish prompt to people who just want results. ***(: Smile*** instead.

# Is (: Smile strict or flexible?

What's essential is that both the model and the human can follow along with the instructions. This means that all of this documentation is only a guideline. There is a strict definition of when (: Smile is working.

**(: Smile** is working when the model follows your defined response language, be it markdown, json or one you have created. 

I'll extend our previous example to break the rules a little bit, and get a lot of new functionality as a result. This is designed to make you feel like you are free to drop {instructions on how to fill out the text} not just inside of the definition of the format the model needs to respond in. In the next example, I'll show how you can also use them inside the markdown titles themselves for the model to choose what to call each section:

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

Smile formalizes an entire informal tradition. It takes what prompt engineers were already doing—dropping delimiters, making clear input vs. instruction sections, using repeated markers for emphasis, and codifies it into a coherent and positive syntax designed **to maximize instruction following.** By specifying itself as an instruction only language, it enables a directed core focus to this goal undiluted by IDE integration. Here, just focus on getting text outputs according to our instructions consistently. We do that by clearly structuring our prompts according to (: Smile. 


# Try (: Smiling 

Try smiling now. 

`:)`

Does it feel good?

🧠 **Brain Hack**: Want to be happier at work? Just use every time you see a ***(: Smile*** as a reminder to smile in real life! That way, you can build a habit of happiness. 
