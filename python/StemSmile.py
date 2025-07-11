# (: Smile prompt language stemming
# Going from any (: Smile prompt ( to token efficient stemmed (: Smile ( 
# Note that there is also the "transmute_to_smile.py" which uses a variety of prompts to create the different versions of (: Smile 
# This is Hybrid ;) Smile in this comment.
# This project creates Stem : Smile, our personal project to translate any (: Smile prompt of any kind into it's most semantic and token efficient stemmed version.
# We also additionally provide support for Stem :- Smile  Labelled. ) the Stem : Smile variant that labels Stems for readability and increased performance on a variety of tasks.
# Want to know if StemSmile increase performance and token efficiency on your task? Run our automated evaluation suite to compare your companies prompts on key benchmarks compared to (: Smile 

# Get text. We import our text from a text file. This is the method that gets the input which will become Stem : Smile ) and Stem :- Smile Labelled. )



# Split text into tokens using openAI tiktokenizer for 4o

# For each token identify its most meaningful mapping to a stem or another single token word. Select the most powerful combination of a single token representation and the meaning being conveyed in context. All conversions are done using API calls to 4o with the prompt "Does this word 'prompt' (1 token) make sense in context as a replacement for 'PROMPT' (2 tokens)? Context tokens: {:! Here, program automatically replaces this entire section and replaces it with user input containing the token 'prompt' before inference !:}"

# This is repeated for every single word separated by newlines, puncutation (e.g. ",", ".", ":)" etc), whitespace, and so on. All tokens are mapped to their shorter representations. Grammar is automatically decided to be cut or trimmed using the following prompt: "Will removing this grammar make more sense or less sense in context? Example: '[: Multi line comment 
# Example :]', does it make more sense for the end tag ':]' to be removed? Does it harm understanding? Categorize into either: harmful and unreadable, neutral and non-semantic, meaningful and semantic."

# We now have a representation that has reduced token count while still retaining meaning