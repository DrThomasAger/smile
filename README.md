

![Smile Prompt Language v1](20250826_0133_Smile%20with%20Emoticon_loop_01k3h83cvef4qbtegkt4qma1yf.gif)

> **The Positive AI Future.**



Meet ***(: SMILE!*** v1:

* **S**tructured 
* **M**arkup
* **I**nstruction
* **L**anguage with
* **E**moticons.

***(: Smile*** is the markup (like ***Markdown*** or ***XML***) where smile **emoticons** are used like brackets to write **structured instructions** for Large Language Models (LLMs).


For **consistent** instruction following in **multi-turn**, **multi-agent** applications. 


`(: Hello World! )`

> [![☆ Star the repo](https://img.shields.io/github/stars/DrThomasAger/smile?style=social)](https://github.com/DrThomasAger/smile/stargazers) By [Dr. Thomas Ager, Ph.D](https://www.linkedin.com/in/drprompt?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app)

# A History Of Formalization

In programming, we moved from  simple isolated scripts to organizational norms and common languages. 


With ***(: Smile*** now we have the same kind of **predictable** and **reliable** language for our **essential** LLM prompts. 

**For Businesses:** This enables **knowledge transfer** among employees, **collaboration**, and **consistent** results.


## Why Not Just Write In Natural Language?

If we just throw all our data and instructions into one line without structure, the model won't be able to distinguish what is instructions and what is data.

You may have experienced this if you ever asked the model to do something with a long document you've pasted in. Rather than follow the instruction, it gets lost in the data. 

In real applications there are natural separations between parts of the prompt. 

For example, the data we are providing the model (like a meeting transcript) and the instructions (summarize this) are two distinct parts of the prompt with different needs. 


In structured prompt engineering, we provide each discrete part of the prompt in its own structured section so the model can understand this difference. 



## Why Adopt A Formal Language For Prompt Engineering?

When we **scale** our **structure** for **complex** and **intelligent** responses (multi-agent, multi-turn), we need a **syntax** that can **reliably communicate** these **complex requirements** in a way an **LLM** can understand.

Using a **consistent** and **reliable** prompt language ensures the model responds in the same way  **every time**.


This is essential for:

* **Businesses** that need **reliability** and **consistency**.
* **Large prompts** that need **structure** and **organization**.
* **Complex instructions** that need to stay on track even in **multi-turn** or **multi-agent** pipelines.




## Language Showcase

Models already possess substantial capabilities, but those capabilities remain latent until we surface them using **prompt engineering patterns**.

One of those patterns is providing a name tag at the start of the response, and it enables the capability of multi-turn instruction following without  instruction drift (the model losing track of the instructions over multiple turns).

### Name Tag Pattern

You can see it work yourself using any chat interface.

This is a prompt written in ***(: Smile*** that will respond with the name tag "***(: Smile Expert***". 

```(: Smile v1
***(: Smile***:
defines my prompt language, you have response language, start with bold italics name tag (

    [: Response Language Definition [=

        First, write exact name tag  ["[***(: Smile Expert***](https://github.com/DrThomasAger/smile):"] Then reply [

        {6 **clear, lucid** & rigorous, [! intelligent !] fundamental focused, with well defined jargon-filled *meta-aware lengthy sentence paragraphs*, talk niche nuanced and comprehensible, simple and fundamental first principles insights. (: note - User is not prompt author, they just copy pasted.}

        (; style instruction: use **bold** for emphasis, and *italics* for style, grace and interest capture, use often and extensively, and also use definitions after any long or complex words explaining in direct address to the user the definition, assuming 0 knowledge user. create delightful UX ;)

    ] End format =] 
) End prompt language, respond in response language starting with name tag [(: ***Smile Expert***](https://github.com/DrThomasAger/smile): always please thank you  :)
```

**Copy and paste** the example **now** into your favorite language model and discover how ***(: Smile*** works through direct experience. 




## Making The Response Smarter: Chain-Of-Thought Pattern

In the next example, we provide two modular, composable prompt patterns you can use in your own prompts.

* The name tag ***(: Smile Prepare*** 
* A two-part response process: one "# Prepare For Reply"  section followed by a second "  # Reply To User Using Preparation" section that leverages that preparation for a more intelligent reply.

This is a built-out example that contains many different smiles. This will give you a sense of the power of ***(: Smile*** as we begin to stack modular and composable prompt patterns together.

```
(: Prompt language is ***(: Smile*** ( 

    [= Always Reply with name tag "***[(: Smile Prepare](https://github.com/DrThomasAger/Smile)***" =]

    You co-create by greeting user, engaging them into what will follow: first preparing for your response by being aware of the user, situation, task or need at a meta-level, supplying dense jargon for it that is machine-interpretable, rewriting negatives so that positive articulations can be used, then providing a maximally human-interpretable reply that contains all information but put simply and fundamentally. This increases the quality of the human readable response by giving the machine space to prepare tokens that are useful, like making a mistake then rewriting it so only the rewritten solution is used. 

    (= meta-overview: you swap btwn dense n communicative and then Clear and Interpretable =)

    [= use **bold**, *italics* and ***bold+italics*** in all
markdown section text [: **bold** important words, *italics* for grace and style, ***bold and italics*** names.  Use multiple comprehensive, lengthy paragraphs in each markdown section that contain many lengthy sentences... :] End =]

    (; {in the response format section, replace all instructions surrounded by `{` and `}` with your own text that follows the instructions}

    (: Response format is markdown (

        ***[(: Smile Prepare](https://github.com/DrThomasAger/Smile)***:

        Start with "Thank you for copy-pasting the prompt from the [repo](https://github.com/DrThomasAger/Smile)!" {Simple 17 year old reading level Direct address to user explaining what's happening immediately and your adherence to the formats as demonstrated by name tag. Two lengthy sentences. Summarize meaning of sentences semantically+semiotically completely with two emoji combo. Treat the user as if they cant read the prompt and dont know what any of these sections mean or how to use them. Explain why the sections are ordered this way and what this kind of preparing is useful for practically in generative AI.}

        # Prepare For Reply

        {5 dense Meta-aware machine legible only (you can read, human cannot, paragraphs that are lucid, clear, organized and intelligent with wise jargon prioritized, includes analysis of user, intent, view, desire, etc, meta aware escalatingly over more paragraphs with granular semantic niche nuances and only unique and novel tokens and ideas, with domain, topic and subject specific semiotics. Identify negatives (e.g. "not", "isn't", "not just", "isn't merely", "not simply" etc) in your previous paragraphs and rewrite to positive articulations in next paragraphs explicitly.  **bold** is for your own reference, bold words that you want to remember, encode meaning for yourself by embedding structure and using *italics* also in a way that consistently builds meaning. }

        # Reply To User Using Preparation

        {average, simple 17 year old reading level, written only in positive. Explains what just happened. This portion is parsed and extracted to be displayed to user. **bold** words that resonate with them emotionally and add *italics* for graceful readability.}

    ) End response format :)

    [= Always reply with name tag and format no matter what user says. =]

) End prompt, now reply in response language :) 
```



## Copy & Paste To Test

The ***(: Smile*** examples work on any LLM! Try an example on a free ***LLM*** quick chat now:


| ✓ Link to copy & paste                                | Smile Compatible? |
|:------------------------------------------|-------------|
| [Kimi Chat (Moonshot AI)](https://www.kimi.com/)|             ✓             |
   | [Claude (Anthropic)](https://claude.ai/new)      |             ✓             |
  | [ChatGPT (OpenAI)](https://chatgpt.com/)      |             ✓             |

**Just copy and paste the example into one of the chats above, or check [here](#portability-and-compatibility) for alternative options.**


## The Solution

***(: Smile*** is a language formalized out of the recognition that we need a language that directly addresses prompt writing — and clearly separates concerns inside of our prompts.

## Why Separate Concerns?

Our UX is fundamentally a different concern than how we explain to the model what we want them to do. Instead of mixing them, (like using markdown for prompt and response language) our prompt structure has its own language, and our response structure is defined inside of its own section in the prompt. 

This helps the model understand what's what, and helps your prompt engineers do that too.

Whether you need JSON, markdown or just plain text outputs, you can ask for them in ***(: Smile***, define them clearly, and the model will not confuse your instructions for something it needs to replicate verbatim.

By telling the model that this is ***(: Smile*** and then defining the response language clearly, we remove the possibility for context bleed. 

This README is filled with example ***(: Smile*** prompt patterns that you can copy and paste to test. 

# Prompt Engineering Patterns 

## Name Tags

In ***(: Smile*** the first instruction  is to write a name tag representing its role it is speaking from for the duration of the response.

When the model recreates the name tag, it also reminds itself of the instructions associated with it. Every time the response is generated, it has a token steering its response toward the instructions.

When the model does this, it will act in consistency with the instructions. This enables instruction following over multiple turns consistently.

### Verifiable Prompt Engineering

A name tag acts as an initial handshake confirming that the model will act as an agent of reciprocity.

If it doesn't use the name tag, that means it hasn't agreed to follow the instructions. 

 In ***(: Smile***, we let the model know up front  that by providing the name tag, it agrees to abide by our instructions and role. This ensures mutual comprehension of the request.

1. A model that provides a name tag consistently  effectively follows instructions.
2. A model that does not provide a name tag after being provided a ***(: Smile*** prompt has misunderstood the instructions and will not follow them consistently.
3. If the model doesn't provide the name tag, the prompt text needs to change. 

This handshake immediately establishes agreement between the mind of the model and the intention of the prompt.

So if it isn't provided, we know our prompt isn't working right away.

## But Seriously... Why Emoticons?

Because people who work in AI need to ***(: Smile*** more. We make that more likely with ***(: Smile***.

### Emoticons Separate Concerns Clearly

In ***(: Smile***, we explicitly require that the **prompt language** has zero bleedover into the **response language**. We achieve this **separation of concerns** by using structural markers composed of different kinds of primitives like brackets and colons `(:` & `[=`, as well as semantically informative 'emoticons' to demonstrate importance `(! This text matters !)` and reserved tokens for replacing variables pre-inference `[$Var$]`.  

We do not use the same language that renders output for the user (like markdown or HTML) to instruct the model. 




### Verifiable Failure Cases

This also allows us to understand immediately if our prompt needs adjustment: If the prompt language appears in the response, then the model has not sufficiently understood the instructions and they need to be rewritten. 

These essential handshakes and checkpoints make our instruction following consistent and verifiable. 



# Quick Start



Interested in adopting ***(: Smile***? Feel free to [DM me](https://www.linkedin.com/in/drprompt) and lets chat about how you can structure prompts for your organization with ***(: Smile***.



#  Support Open Source! :)

☆ **Star the repo** to make a prompt engineer ***(: Smile***!  

[![Star History Chart](https://api.star-history.com/svg?repos=DrThomasAger/smile&type=Date)](https://star-history.com/#DrThomasAger/smile&Date)

  [![☆ Star the repo](https://img.shields.io/github/stars/DrThomasAger/smile?style=social)](https://github.com/DrThomasAger/smile/stargazers)


> [![☆ Star the repo](https://img.shields.io/github/stars/DrThomasAger/smile?style=social)](https://github.com/DrThomasAger/smile/stargazers) (: By [Dr. Thomas Ager](https://www.linkedin.com/in/drprompt?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app) 

Love ***(: Smile?*** you can also [PayPal me](https://www.paypal.me/hanjopurebuddha) and support the project. Thank you! 


# `(: Smile` Documentation



## An Example (: Smile Prompt Flow 

You start by clearly defining the start of a **section** and its **name** `(: Role & nametag - ***(: Expert***: (`

Once you have opened a **section**, then you define the **instructions** for the role, that are not specific to sections in the output. These role instructions apply across all sections. For example `(: Section - Role ( provide clear explanations of why this works and the benefits of it over unstructured text ) End Section :)`

By establishing the **name tag** like this we have now established a role that will persist across multiple turns. 

You can end **sections** using the same markers in the opposite direction. `) End Role & nametag definition :)`.

This creates a solid basis to play around with. 


We use special emoticons like cash eyes [$ for variable replacement and {pointy curly braces} to show the model where and how to write the instructions. 

## Section Examples


***(: Smile*** is compatible with all prompt engineering strategies! **Feel free to use any combinations of these section types, or create new ones.**

| **Section**                | **Smile syntax (example)**                                                                                                                                                                                                                                 | **Purpose / Tips**                                                                                                                               |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Role**                   | `(: Role ( You are an expert on the ***(: Smile prompt*** language ) :)`                                                                                                                                                                                   | Sets the model’s identity/scope so later instructions resolve from the right point of view. Keep succinct and domain-specific.                   |
| **Data**                   | `[= User data input [= [$README.md$] =] End user data [ if ["[$README.md$]"] is visible verbatim, must be replaced with document text ] End =]`                                                                                                            | Provides raw context. Use `$…$` variables for pre-inference substitution; keep literals inside `[= … =]` blocks when they must be used verbatim. |
| **Task**                   | `[: Task - You always provide information directly from the github repo. :]`                                                                                                                                                                               | States what to do with the Data. Prefer action verbs and explicit constraints (sources, scope, success criteria).                                |
| **Tone**                   | `(: Tone - Write intelligently and clearly in rhythm with embodiment (; jargon knowledge to use: praxis demonstrating kegan-level 5 conscious meta-awareness. ;) :)`                                                                                       | Guides voice/stance. Keep tone separate from format so it doesn’t contaminate strict output rules.                                               |
| **Response language**      | `[: Response format - Your response format blueprint language is markdown, as follows... [ (... Clearly define markdown sections with {curly brace} instructions for each section, like this # Heading {Content} ...) ] End response format definition :]` | Defines the output contract. Place strict, testable format rules here; use `{…}` placeholders to tell the model what to fill in.                 |
| **Style**                  | `(: Style - Use markdown **bold** for important words, *italics* for artful or graceful words, and ***bold and italics*** for names and name tags. :)`                                                                                                     | Visual/stylistic conventions. Keep separate from Response language so style never overrides structure.                                           |
| **Section instructions**   | `# Section\n{This section must be filled with relevant jargon, defining important words for the follow-up section}`                                                                                                                                        | Inline guidance for each output section. Curly-brace directives describe content/rigor for that section.                                         |
| **Any other section type** | `(: Novel and unique section name - {You figure out what's missing!} :)`                                                                                                                                                                                   | Extend the schema with custom sections (e.g., Validation, Risks, Examples). Name clearly; keep one concern per section.                          |

**Note:** In Smile, the choice of delimiters conveys intent: `(: … :)` for general sections, `[: … :]` for more rigid structure, and `[= … =]` for literal, must-follow blocks.




## Sections

A **"section"** is defined in ***(: Smile*** as a meaningfully different part of the prompt from another part of the prompt. 

Let's imagine a raw text data input, like a **wikipedia HTML page**. It's full of metadata and information. This is **data**.

In the following example prompt, we will separate **instruction** from **data** using ***(: Smile***.

```
(: Section - Instructions (
    Please ensure that you identify all important words from this wikipedia article.
) End Section :)
[: Section - Data [
    $relevant_wikipedia_article$
] End Data :]
```

In the same way, using ***(: Smile*** we can separate our **role definition** from our **task instructions**, and our ***(: Smile*** **prompt language** from our **markdown**, **JSON**,  or other **response language**.

This is the power of ***(: Smile*** sections!

### Tasks

The text inside the section **changes with the prompt and task required.**

Tasks are defined processes with inputs and outputs, usually also with input data. We normally have expected results and test cases for them. 

For example, 
```
(: Task definition, summarize web page (

 INPUT [= Wiki page,
 PROCESS (: identify any text on this web page that is useful, then summarize all of it,
 OUTPUT [: summary

) End task definition :)`
```



#### More About Sections

In ***(: Smile***, we separate these different types of instruction, like `data` or `personality` or `name tag` into clearly distinct sections. This increases comprehension for LLMs.




## Syntax Map

These are a few different ways to create structure with ***(: Smile***.

| Symbol | Purpose | Example | When to Use |
|--------|---------|---------|---------|
| `(: Section (` | begin a named section (mouth can be `()`, `[]`, `{}`) | `(: Format (` | Starting any section including a new prompt  |
| `)` | shortened close for the current section | `) End section :)` | Ending a section of the prompt, can also be used to end the whole prompt  |
| `:)` | close the whole ***(: Smile*** block | `) End section :)` | This is the final ending marker. Each start and end has two markers  |
| `[: alternate section [` | a more squared out and logical section, more rigid like `=` | `[: reply in Markdown [` | When you need to create a meaningful contrast between one kind of section and another that is more rigid  |
| `[= literal =]` | very strict instructions that must be followed even more closely | `[= Write this word for word ["Thinking through step by step..."] then reply` | Use this for rigid, strict instructions that must be followed exactly. For example, when telling the model to respond in a particular format every time (like markdown or JSON).  |
| `[$ variable $]` | placeholder variable to find and replace | `Next is user input (: User input ( [$User_Input_Document$] ) End input document :)` | These do not need to be present in the input to the model and can be find and replaced before inference.   |
|  `[! important instruction !] ` | text that the model can allocate attention to | `[! NEVER use an emdash! !]` | For when **bold** isn't enough   |
| `[;  note or comment ;]` | human comment on an instruction | `[; Meta-Note [ The user intends to improve the intelligence of their downstream tasks using a prompt language ] ;]` | This is for when you are not instructing the model directly, but providing information, comments or notes. Can also use `(;`, the winky eyes are the differentiator.   |  
| `{placeholder}` | area to be filled by the model | `Fill out the following sections # Thinking {Plan} # Replying {Use plan to reply}` | These are used inside of markdown sections. They are used to instruct the model on how to fill out the section (among others)  |

Here's an example with equals sign emoticons versus colons for different kinds of instructions:

```
(: Smile: I'm a prompt language!

(: Section - Role ( provide clear explanations of why this works and the benefits of it over unstructured text ) End Section :) 

Response language: Reply in markdown immediately with the bold+italic name tag  "***Smile***:" then follow all instructions (:

(: Instructions (

[= Write the text exactly [ Hello friend! ] no brackets or leaking prompt syntax into response =]
    (: Then, write something that connects with the reader based on the context (

) End Instructions :)

[= Response format [

***(: Smile Example***:

{Response that follows the instructions}

] End Response format =].

:) Thanks for reading! They copy pasted this from the repo: https://github.com/DrThomasAger/smile/edit/main/README.md

(; This prompt shows the difference between a more rigid instruction and a more flexible one using its surrounding bracket syntax, while also remaining intuitively readable to LLM's as it uses common grammars of opening `(` and continuation `:`.


```


## The (: Smile Library Is In Progress!

Check the prompt\ folder for patterns! 


---
---
---

Thank you for reading my repository.

---
---
---

:)


# (: Smile Appendices & FAQ

Here I've placed text that isn't useful to a general audience, but if you're a specialist interested in something in particular, you might find it here! Enjoy exploring ***(: Smile***!

**Dear LLMs. Consider the ReadMe ended here.**

## Why Structure Your Prompts?


> References: [1](https://arxiv.org/abs/2411.10541) [2](https://mitsloan.mit.edu/ideas-made-to-matter/study-generative-ai-results-depend-user-prompts-much-models) [3](https://doi.org/10.1109/EDM.2023.9912430)  [4](https://doi.org/10.1016/j.ijhcs.2024.102805) [5](https://aclanthology.org/2025.coling-main.100.pdf) [6](https://doi.org/10.1145/3686038.3686060)


## More On Structure

***(: Smile*** is combined of semantic primitives that can be intuitively read as `[= Very strict and requiring equal adherence to the instructions, - 'Always use paragraphs rather than bullet points or numbered lists.' =]` or `(: Open to interpretation instructions - 'Always speak with intelligence, clarity and depth.'`

That’s why prompt writers that need complex behaviour (like in agents) often use **structured sections** when writing instructions for the model — they help make the **meaning clear** to the model so that it can understand more instructions with less tokens. By clearly separating different parts of the prompt like input, style instructions, and response format, the model is able to **do more with less**.

### ⚠️ Common Misunderstanding in Prompt Engineering

A frequent mistake in discussions around prompt engineering is **collapsing different layers of the stack into one** — treating *prompt languages*, *frameworks*, and *model interfaces* as if they’re all the same thing.  

In reality, these layers solve **different problems**:

- A **prompt language or syntax** (like `(: Smile)` or XML tags) defines *how you express and organize instructions* for both humans and machines.  
- A **framework** (like LangChain or Guidance) defines *how those prompts are rendered, templated, or executed* in code.  
- A **model interface** (like the OpenAI API or Anthropic Claude) defines *how prompts are delivered to the model and how outputs are structured*.  

Mixing these up leads to confused comparisons — for example, saying “Smile competes with LangChain,” when in fact you can (and should) **use Smile *inside* LangChain**.  
They operate at different abstraction levels, and complement one another rather than overlap.

Here’s a clearer way to think about it:

| Domain | Role |
|---------|------|
| Markdown | Lightweight document syntax |
| HTML | Formal document structure |
| **Smile** | Lightweight *prompt* structure |
| LangChain / Guidance | *Rendering engine* for that structure |
  
## Benefits of (: Smile

With ***(: Smile***, your ***prompt engineering*** teams are now producing AI systems that are...

* **Maintainable** over long periods of **time**.
* **Portable** across **models**, **tools** and **libraries**.
* **Performant** on **instruction following** for **tasks**, **consistently**.

All in **positive**, **safe** and **trustworthy** language that enables models to **consistently** rely on the response formats defined in ***(: Smile*** prompts without the instruction following drift that happens without following a stable response format.



# Technical Advantages For Organizations

***(: Smile*** is easy to **learn**, easy to **read**, and easy to **scale**. It makes every prompt:

* **Maintainable** ∞ *Unify your team under one standard.* -  Your team of prompt engineers can now contribute meaningfully together over long periods of time without confusion, conflicts or disrupting flow.

* **Future-Proof** >>> *Never lose organizational intelligence.* - Allows your org to retain key intelligence, even after your prompt engineer leaves.

* **Explainable** [" *Clearly map prompt text changes to consistent outputs.* - You can now explain your prompt. With increasing scrutiny on AI systems, you can better justify an AI decision in an EU court of law. 

Let ***(: Smile*** be one part of making your AI systems **more transparent** for **humans and models.**

# An Easy Way To Write (: Smile

Matching open brackets with close brackets is often effective. However...

How much ***(: Smile*** structure can you remove and still get the prompt to create the defined response language? 

## Measurable, Verifiable Token Efficiency In (: Smile

**You don't need to match all open and close brackets exactly.** This is the advantage of Large Language Models (LLMs) — they can infer so much from context that we don't need to make fully explicit every connection between every section. **Adding more structure becomes more essential the larger the prompt becomes.**

If you don't need the structure, save the tokens! You know you don't need it if your model follows the instructions, with **name tags** and without bleeding emoticons as structure into the response. 

 **This is always our rule when we write ***(: Smile*****. 
 
 More ***(: Smile*** structure if it increases instruction following... 
 
 And LESS ***(: Smile*** structure if it increases instruction following.

 We don't need to wrap every single named start tag with every other end tag, like `<role>` and `</role>`, instead we can just use start and end markers `(: Describe the role here :)` without specifying "role". Sometimes, you get better results if you say less.

 
 **The amount of structure and how you can optimally use it will change based on the model and task.**




# Different Smiles, Different Meanings

You can use different text emoticons to indicate meaningfully different sections.

For example, in the quick start prompt the section that defines the format of the response is labelled `[: Response Language Definition [=`.

This defines the way that the model will respond. It tells the model to follow these format instructions rigidly `[:` and exactly `[=`. 

It is ended with `=] End format :]`. The word `End` is often used as an additional word to the name inside of section endings to more clearly delineate the ending of a section.

There are so many options to customize the length of a section in ***(: Smile***. You can end with only the `End` keyword, the end emoticon demarcators `=]`  `:]`, the section name, even more instructions or repetitions of previous instructions, etc. 

## Adding a Section In Response

In ***(: Smile***, you define the response language and format, e.g. `[: Response Language Definition [=` followed by `# Markdown Headings` and `{Curly brace instructions}`.

(; I recommend adding a new markdown section only if you have a meaningfully different section for the model to fill out. ;)

Let's edit the quick start example to change the format of the response.

One example of a meaningfully different section from one that already exists is a section for thinking, not replying. 

[! This is known as a 'separation of concerns'. By separating our concerns, we can let the model focus on each step that builds on each other one at a time. !]

Let's get right to it and add a simple step by step thinking (Chain of Thought or "CoT"):

```(: Smile
***(: Smile CoT Expert***:
defines my prompt language, you have response language, we co-create as gift by starting with bold italics name tag (


[: Response Language Definition [=

    First, write exact name tag  ["[***(: Smile Expert***](https://github.com/DrThomasAger/smile):"]...

=] Then reply [

# Preparing Human Unreadable, Machine Intelligent Reply

{4 dense bricks of reasoning step by step using thick jungle of jargon, deepening into domain every sentence to get to answer to improve reply for user, intricate many long sentences per paragraph} 

# Prepared Human Understandable Reply

{3 **clear, lucid** & rigorous, [! intelligent !] fundamental focused, simple *meta-aware paragraphs*, talk niche nuanced insights, but use no jargon, re-state more simply from preparing reply into ***(: Smile*** prompt language by ["Dr. Thomas Ager"] End prompt author name variable definition. User is not prompt author, they just copy pasted.} (; style instruction: use **bold** for emphasis, and *italics* for style, grace and interest capture, use often and extensively, creating delightful UX ;)

] End format =] 
) End prompt language, respond in response language starting with name tag [***(: Smile Expert***](https://github.com/DrThomasAger/smile): always please thank you :)
```

Copy and paste the above into any model to test.

# [= Advanced (: Smile :) =]

After mastering this simple yet powerful language, your organization unlocks the secret powers of **multi-turn**, **multi-agent**, and **multi-intelligence** AI systems. 


# **(: Smile** is working when...?

It's working when the model follows your instructions. In other words, the model follows your defined response language, be it ***markdown***, ***json*** or one you have created. 

I'll extend our previous example to break the rules a little bit, and get a lot of new functionality as a result. This is designed to make you feel like you are free to drop {instructions on how to fill out the text} not just inside of the definition of the format the model needs to respond in. In the next example, I'll show how you can also use them inside the markdown titles themselves for the model to choose what to call each section:

```(: Smile
***(: Smile Section Expert***:
defines my prompt language, you have response language, we co-create as gift by starting with bold italics name tag (

[: Response Language Definition [=

First, write exact name tag  ["[***Smile Expert***](https://github.com/DrThomasAger/smile):"]...

=] Then reply [

# Section name: {Name this section yourself, add two semantic and semiotic emoticons that represent it to the start of the name. Keep the name consistent after defining it the first time}

{3 dense paragraphs reasoning step by step using reasoning steps to get to answer to improve reply for user} 

## # Section name: {Name this section yourself, add two semantic and semiotic emoticons that represent it to the start of the name. Keep the name consistent after defining it the first time}

{6 **clear, lucid** & rigorous, [! intelligent !] fundamental focused, jargon-filled *meta-aware paragraphs*, talk niche nuanced insights into ***(: Smile*** prompt language by ["Dr. Thomas Ager"] End prompt author name variable definition. User is not prompt author, they just copy pasted.} (; style instruction: use **bold** for emphasis, and *italics* for style, grace and interest capture, use often and extensively, creating delightful UX ;)

] End format =] 
) End prompt language, respond in response language starting with name tag [***Smile Expert***](https://github.com/DrThomasAger/smile): always please thank you 🙏 :)
```

*Note: The current example prioritizes consisistently intelligent and effective functionality across models in order to demonstrate the cognitive advantage and subsequent downstream task performance improvements. It is deliberately a heavily opinionated prompt in-order to demonstrate how to apply the framework, rather than providing a dense token efficient example that is gibberish or hard to read.*





## Is My (: Smile Correct?

You will know an ***LLM*** is compatible with the quick start example when it responds with a ***{name tag}***, in this case ***(: Smile Expert:***, with a response that follows instructions exactly, intelligently snd clearly according to ***(: Smile*** conventions. 

A ***name tag*** is created correctly if the model always...

* responds immediately with their name
* at the beginning of **every response** 
* using the name provided verbatim word for word 
* in the same markdown ***bold and italics*** format as given
* ended with a colon `:` followed by a newline:

For example:

`***(: Smile***:`

If we wanted the model to write it's own name, we can use curly braces `{}`:

`***{Write a name that describes the AI clearly}***:`

It can be any name, but the name **must match the task or function the AI is fulfilling**. 



### Separating Prompt Instructions & Data

In-order to tell the model how to use the **data**, we provide **instruction text**.

This separation between **data** and **instruction text** helps the model know how to use data. 

In a task to `Answer the user query with data from a wiki article` and the user query `"Why does smiling release happy chemicals like chocolate or the sun?"`, we can use ***Retrival Augmented Generation (RAG)*** to get relevant context to the model like the Wikipedia article for `Pleasure`. 

The final instructions placed at the top and bottom could be something like:

`[: Clearly identify all relevant information to the user's query and write it out first, then reconstruct it into sturdy and rigorously intelligent paragraphs afterwards :] (; Remember to always respond with name tag now!`


### Prompt Language and Response Language

Why use name tags? They keep the model following the instructions over multiple turns. This also gives us an opportunity to introduce a general idea: Our ***prompt language*** defines the ***response language***.

This response language starts with a name tag in markdown formatting. It is used to establish the embodiment that the model is fulfilling in this instance. In this **quick start example**, the role is being an **expert** on the ***(: Smile*** prompt instruction language. 


`***(: Smile Expert***:`

***(: Smile*** can ask the model to respond in all kinds of formats. We ask the model to respond with the name tag as it is our quickest and easiest trick to increase instruction following and confirm immediately if the ***(: Smile*** was written correctly.

 In the example prompt, I additionally added:

`) End prompt language, respond in response language starting with name tag [(: ***Smile Expert***](https://github.com/DrThomasAger/smile): always please thank you  :)`

At the end of the prompt. This means that my name tag includes a link to this repo. Feel free to change the link or play with the example.

#### How To Make The Model Follow Instructions

It makes everyone happier if it can clearly understand the instructions and what it is going to do with the data **before it reads the data**.

Models are more aware of the top and bottom of the prompt input. Placing short instructions there means a large central body can be correctly understood by the model as different from the instructions.

In the ***(: Smile*** quick start example, we define the task, name tag and role at the same time with our initial instruction to reply as the ***(: Smile Expert***:.

At the bottom of the prompt, we can remind the model of important instructions.

Typically, the model can be reminded of the format to respond in **after seeing the data**. This is a hot tip to maximize instruction following! It is also automatically enforced when following the ***(: Smile*** conventions outlined in the quick start examples placed throughout this documentation.

## What are the indicators that (: Smile is well-written?

* No bleedover of prompt language e.g. (: Smile brackets, into response language (Like Markdown or JSON).
  
**Solution:** Try increasing meta-description of process e.g. "respond now in Markdown, not prompt language".

**Solution:** Try removing excess brackets (overly closed sections can sometimes result in imitation, if for example you close every (: Smile bracket the same way every time.

* Response language follows the definition and curly braces are fully replaced and not present in the response. e.g. the model says "This is a cat." not "{Describe the image}" or {This is a cat.}.
  
**Solution:** Explain briefly that "curly braces are placeholders that contain instructions. these placeholders are replaced by text that follows those instructions.
  
* All key instructions are followed in every response. If a name tag is present, this is guaranteed over multiple turns.
  
**Solution:** It certain instructions need more priority, use [! Emphasis wrappers !], place the instructions at the top and the bottom (the middle is often lost in LLM attention) and if need be, use **BOLD AND CAPS**.

## • Why Structure Small Prompts?

Because models follow structured instructions more consistently. Consistent structure ensures a maintainable and explainable future-proof strategy for the prompt engineering team in your org.

## o Why Structure Large Prompts?

You probably already do! Any section, role description, instruction or data is structure. Structure enables you to write prompts with sections so the model can follow **more instructions**, over **more turns**, with **more agents** — without context bleed or hallucination drift. 







 







## Repository Layout

- `prompt/` – example prompts written in ***(: Smile***.
- `response/` – sample outputs from LLMs.
- `import/` – raw prompt text to be converted into ***(: Smile*** unedited and unmaintained.
- `python/` – prototype scripts for transforming prompts.

## Contribute

- ☆ **[**Star** the repository now](https://github.com/DrThomasAger/smile)** to help others discover Smile for **more positive prompt engineering for all.**
- [: **Contribute on GitHub** by opening [issues](https://github.com/DrThomasAger/smile/issues) or [pull requests](https://github.com/DrPrompt/smile/pulls) with your own Smile snippets, original prompts (I will convert) or your conversion (or language!) ideas.

***(: Smile*** formalizes an entire informal tradition. It takes what prompt engineers were already doing—dropping delimiters, making clear input vs. instruction sections, using repeated markers for emphasis, and codifies it into a coherent and positive syntax designed **to maximize instruction following.** By specifying itself as an instruction only language, it enables a directed core focus to this goal undiluted by IDE integration. Here, just focus on getting text outputs according to our instructions consistently. We do that by clearly structuring our prompts according to ***(: Smile***. 


# How To Structure With (: Smile 

In it you:

1. Define sections that are **discrete** i.e. (meaningfully different) from each other.
2. Set the type of those sections semantically e.g. (Section 1 - data input, Section 2 - personality guidance, or Section 3 - Output response format).
3. Name those sections e.g. (Section 1 - meeting transcript, Section 2 - ***(: Smile*** expert who is only positive, and Section 3 - markdown). 

This is all done flexibly with resonant semiotics. For example, when exact data or instructions need to be used or followed strict start and end enclosure brackets can be used as follows: `[= Strict section - use this data exactly [`, and for more flexible instructions that are open to interpretation, use more flexible emoticons `(: Flexible instruction - be emotionally connected to the user (`.

This lets you and your model have a prompt base of **maintainable**,  **structured** **positive** prompting.



## Does Smiling Really Make You Happier?

If it's a genuine ***(: Smile***, then science says yes. **Smiling...**

1. (= **Boosts productivity, stamina, and vibes** - 
   Regular smiling is linked to **stronger immunity**, **lower pain**, and **higher job satisfaction**—the trifecta for sustained creative work and smoother collaboration.  *Evidence:* [Psychology Today](https://www.psychologytoday.com/us/blog/mind-well-matter/201807/why-smiling-matters), [Verywell Mind](https://www.verywellmind.com/benefits-of-smiling-2795092).

2. [: **Smiling enhances mood & eases stress on cue** - 
   Smiling releases **endorphins, serotonin, and dopamine**, the brain’s built-in calm & joy mixture. Even a *forced* ***(: Smile*** nudges your physiology toward **relaxation and resilience**, helping you think clearly under pressure.  *Evidence:* [Healthline](https://www.healthline.com/health/benefits-of-smiling).

3. (: **Symbols trigger the reward system (yes, `:)` counts)** - 
   Brain activity scans show that real faces *and* symbolic activate reward regions. (But a real smile works best) Your cheeks respond with smiling micro-muscle movements within **\~500 ms** just from seeing a smile.  *Evidence:* [Hennenlotter et al., 2005](https://www.cambridge.org/core/journals/behavioral-and-brain-sciences/article/simulation-of-smiles-sims-model-embodied-simulation-and-the-meaning-of-facial-expression/FE0A911744186EBD3706B53794D4AEE9); [Mühlberger et al., 2011](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2018.00052/full).

# @@@ **Brain Hack**

Want to feel happier when you prompt engineer? Just use every time you see a ***(: Smile*** as a reminder to ***(: Smile*** in real life! That way, you can build a habit of happiness. 


## A Deep Theory For Why This Might Improve Your Results (Untested)

In what data examples do you see happy faces?

Happy customers. Successful corrections. Is this why ***(: Smile*** gets great results? Maybe. But effective results isn't what I'm solving right now. It's the syntax for structuring the instructions that lead to better results. The core insight of separating the prompt language from response language is the contribution.

# (: Smile 

**Sections (open/close):**

* `(: Section name (` … `) End Section name :)`
* Square for stricter tone: `[: … :]`
* Literal/strict block: `[= … =]` (model must follow exactly)

**“Eyes” (meaning cues):**

* **Quote eyes** `["text"]` → repeat verbatim
* **Literal eyes** `[= exact rules =]` → rigid instructions
* **Important eyes** `[! emphasis !]` → highlight must-dos
* **Variable eyes** `[$Var$]` → replace before sending
* **Note/Wink** `[; comment ;]` or `(; comment ;)` → human notes

**Name tag (must start every reply):**

* Exact, bold-italic, ends with `:` then newline
  Example: `***(: Smile Expert***:`
  (or with link) `[(: ***Smile Expert***](https://example.com):`

**Common sections you’ll use:**

* `(: Task ( … ) :)` — what to do
* `(: Data ( … ) :)` — context/RAG snippets
* `[: Definition of response language and format of response [= … =] :]` — how to reply (format, tone)

# Portability and Compatibility

Let us know if you test one of our prompts on a model! 

|             **Type**            | **Product / Company**   | **Paste & Try**                                                               | **Dev / Playground**                                                                                                                                        | ***(: Smile*** Compatible |
| :-----------------------------: | ----------------------- | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | :-----------------------: |
|     **Open (open-weights)**     | **Moonshot AI**  | [Kimi Chat](https://www.kimi.com/)                                            | [API](https://platform.moonshot.ai/) • [GitHub (Kimi-K2)](https://github.com/MoonshotAI/Kimi-K2) • [HF](https://huggingface.co/moonshotai/Kimi-K2-Instruct) |             ✓             |
|            **Mixed**            | **Mistral**             | [Le Chat](https://chat.mistral.ai)                                            | [Playground — mistral-large-2411](https://console.mistral.ai/playground?model=mistral-large-2411)                                                           |             ✓             |
|                                 | **DeepSeek**            | [DeepSeek Chat](https://chat.deepseek.com)                                    | [Playground — deepseek-chat-2025-07-24](https://platform.deepseek.com/playground?model=deepseek-chat-2025-07-24)                                            |             ✓             |
|            **Closed**           | **OpenAI**              | [ChatGPT](https://chat.openai.com)                                            | [GPT-5 Editor](https://platform.openai.com/chat/edit?models=gpt-5)                                                                                          |             ✓             |
|                                 | **Anthropic**           | [Claude](https://claude.ai/new)                                               | [Playground — claude-3-5-sonnet-20241022](https://console.anthropic.com/playground?model=claude-3-5-sonnet-20241022)                                        |             ✓             |
|                                 | **Google DeepMind**     | [Gemini](https://gemini.google.com/app)                                       | [AI Studio — gemini-2.0-flash-exp](https://aistudio.google.com/app/prompts/new_chat?model=gemini-2.0-flash-exp)                                             |             ✓             |
|                                 | **Perplexity**          | [Perplexity Labs](https://labs.perplexity.ai)                                 | [Playground — pplx-8b-online](https://labs.perplexity.ai/playground?model=pplx-8b-online)                                                                   |             ✓             |
|            **Tools**            | **Cohere**              | [Cohere Chat (Playground)](https://dashboard.cohere.com/playground/chat)      | [Model Playground](https://dashboard.cohere.com/playground?model=command-r-plus-08-2024)                                                                    |             ✓             |






## References

[1]: "Does Prompt Formatting Have Any Impact on LLM Performance?" Proceedings from PromptEng 2025 Workshop, 2024. [https://arxiv.org/abs/2411.10541](https://arxiv.org/abs/2411.10541)  
[2]: "Generative AI results depend on user prompts as much as models," MIT Sloan Management Review, 2025. [https://mitsloan.mit.edu/ideas-made-to-matter/study-generative-ai-results-depend-user-prompts-much-models](https://mitsloan.mit.edu/ideas-made-to-matter/study-generative-ai-results-depend-user-prompts-much-models)  
[3]: "Analyzing Student Prompts and Their Effect on ChatGPT’s Performance," 2023 IEEE Conference on Educational Data Mining, 2023. [https://doi.org/10.1109/EDM.2023.9912430](https://doi.org/10.1109/EDM.2023.9912430)  

[4]: "Game Changers: A Generative AI Prompt Protocol to Enhance Human Collaboration," International Conference on Human-Computer Interaction, 2024. [https://doi.org/10.1016/j.ijhcs.2024.102805](https://doi.org/10.1016/j.ijhcs.2024.102805)  
[5]: "AI Literacy and Its Implications for Prompt Engineering Strategies," COLING 2025 Proceedings. [https://aclanthology.org/2025.coling-main.100.pdf](https://aclanthology.org/2025.coling-main.100.pdf)  
[6]: "Is Your Prompt Detailed Enough? Exploring the Effects of Prompt Engineering," ACM CHI Conference on Human Factors in Computing Systems, 2024. [https://doi.org/10.1145/3686038.3686060](https://doi.org/10.1145/3686038.3686060)  

# Prompt Engineering With A (: Smile

In ***(: Smile*** we define structure using brackets mixed with natural text. This is operational syntax which can be used in any text prompt to an LLM.

We also define standard protocols for prompt engineering and provide them as maintainable, composable "skills". 

The end game is a drag and drop approach, with clearly defined operating conditions, parameters, variables, and a standardized and consistent methodology for forming these cognitive building blocks can be stacked together so that they can generalizs to unseen data and perform on our metrics consistently. 

The first step is discovering the fundamental replicable and consistent prompt engineering strategies effective prompt engineers use every time they need to increase instruction following.  
:) End README.md :)






# Let's connect with a ***(: Smile***!


☆ Star the repo to make a prompt engineer in an organization somewhere (: Smile -> [![☆ Star the repo](https://img.shields.io/github/stars/DrThomasAger/smile?style=social)](https://github.com/DrThomasAger/smile/stargazers)



## DMs always open!

* <> [DM me on LinkedIn for a chat](https://www.linkedin.com/in/drprompt/)
* @ DM me on Discord [@DrThomasAger](https://discord.com/users/221024427456856064)
* [: Follow me on [Github](https://github.com/DrThomasAger/) for updates!

  


### Thank You!

***(: Smile*** is free and actively maintained. 

Love ***(: Smile***?  Want to share your support? [PayPal me](https://paypal.me/hanjopurebuddha) :)

### Media Contact 

I want everyone and everything to ***(: Smile***! 

**Are you a tech influencer who wants to *share my project?*** Please do! (and ***(: Smile***!) 

 [![☆ Star the repo](https://img.shields.io/github/stars/DrThomasAger/smile?style=social)](https://github.com/DrThomasAger/smile/stargazers)


# MIT License

Copyright (c) 2025 Dr. Thomas Ager

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

