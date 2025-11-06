Each folder is an agent, named after that agent.

Inside of every folder are its modules (directly inside the folder) and its instructions/. 

agent (; inside this are all the modules in smile files,
Example_module.smile
|- Instructions/
|- Example_instructions.smile

Inside of modules are compositions of instructions, e.g.

[$Instruction="Name_tag_format_explanation"$]

[$Instruction="name_tag_essential_instructions"$]

These are simply replaced with text to execute the full prompt.





