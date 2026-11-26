(-: Inheritance of the Gemini web chat lens (-:

    (: What this lens is for (:

        This lens carries the personal instructions Hanjo keeps in Gemini web
        chat, in the panel Personal context, Your instructions for Gemini,
        written as Smile modules so they can be versioned, read one by one,
        and composed again. The work began on 2026-11-14 in the cloud session
        https://claude.ai/code/session_012xbfpD39E1YEjnux2FQxJW and lives on
        the branch ccr-f4b62830-7j7ao0 in draft pull request
        https://github.com/DrThomasAger/smile/pull/9.

        ( The asking, kept exactly (
            > Add these as modular prompts ssmanfixslly sectioned with.smolensynrsx in new lens Gemini web chat
        ) End the asking, kept exactly ) thank you

        It was read as modular prompts, manually sectioned, with Smile
        syntax, in a new lens named Gemini web chat. The message arrived
        twice with "Try again" after a worker restart, and the work started
        from the paste itself.

    :) End what this lens is for :) Many blessings

    (: Where his instructions begin and end in the paste (:

        The paste opened with Gemini's own settings page text, "Personal
        context", "Memory", "Your instructions for Gemini", and the two
        example lines Gemini shows, "Start responses with a TL;DR summary"
        and "Use bullet points for long paragraphs". His instructions begin at
        "This is the appropriate attitude if something is missing" and end
        mid sentence at "Don't say I'm having a problem, " exactly as he
        pasted it. Two lines reading "This session's worker process was
        restarted" were the session's own messages and live outside the lens.

        One paragraph appears twice in his panel, "You never need to write or
        repeat any process related to doing the same research twice." Both
        copies live together in the module research_done_once, which is why
        145 paragraphs make 144 modules.

    :) End where his instructions begin and end in the paste :) Thank you kindly

    (: The source of every module (:

        tools/source.tsv is the single source. Each line is a composition
        folder, a tab, a section header, a tab, and his paragraph character
        for character. Every module, composition and the compiled lens are
        made from it. A header is renamed, or a paragraph moved to another
        composition, by changing its line there and building again.

        The headers are written in his preferred words. Four were renamed on
        2026-11-26 for that reason, to "Complete work, end to end",
        "Measured limits, complete work, and confirming an image", "Life,
        health and Orchard Cottage" and "How the replies speak". Inside the
        sections every word is his, including his spelling.

    :) End the source of every module :) Warm thanks

    (: Building the lens again (:

        From this folder, run python3 tools/gen.py tools/source.tsv . to
        rewrite module/ and composition/, then echo | node COPY.js, then copy
        composition/gemini_web_chat_lens.txt to COMPILED_OUTPUT.txt.
        gen.py replaces only module/ and composition/, so tools/, viewer/ and
        these documents remain as they are.

        The echo feeds COPY.js an empty line, because COPY.js pauses to offer
        a "fix" whenever it has suggestions. COPY.js compiles only the .smile
        files under composition/, module/ and data/, and writes a .txt beside
        each one. The whole lens therefore lives in
        composition/gemini_web_chat_lens.smile, and prompt.smile at the root
        simply names it. A module in a subfolder is referenced with its
        folder, as in [$mod/writing_style="short_words"$], which is how the
        compile reaches 0 suggestions.

        After every build a check reads each line of tools/source.tsv and
        finds its paragraph inside COMPILED_OUTPUT.txt. On 2026-11-26 all
        145 were found. A raw count of faces in the compiled text shows 159
        opening (: against 156 closing :), and the difference comes from
        faces inside his own words, such as (:! Actually !:) and (: smile :).

    :) End building the lens again :) Thank you, truly

    (: The viewer (:

        tools/page.py takes the lens folder and an output file and writes a
        single page reader with the ten compositions, a card per module
        showing its faces, and a search box that narrows the cards. The page
        and its PDF are in viewer/. The PDF was printed with Playwright's
        chromium at A4, each composition beginning on a new page. Hanjo asked
        to see the lens as a website or PDF, and these were sent to him on
        2026-11-14.

    :) End the viewer :) So much appreciation

    (: What remains open (:

        The scripts in tools/ are Python because the cloud session's auto
        mode declined the babashka installer. On his Windows machine, where
        babashka is installed, gen.py and page.py can become babashka scripts
        using babashka.fs, which is how his projects prefer to script.

        smile lint, through C:\Users\hanjo\bin\smile.cmd, lives on his
        Windows machine and has yet to run over this folder. The modules
        follow its conventions by hand, four spaces per depth, a footer
        reading End and its header's name, a header beginning with a face.

        His Claude preferences share many paragraphs with this panel, word
        for word, such as the sections on maps and territories, the three
        poisons, and unfolding before certainty. A Claude lens built the same
        way could reference those same modules, so one paragraph is kept once
        and used by both lenses.

        The 144 headers are ready to join THE MAP's prompt library, each
        tagged with its ontology and its lens, Gemini web chat.

    :) End what remains open :) May this be of benefit, and thank you

:-) End inheritance of the Gemini web chat lens :-) So much gratitude
