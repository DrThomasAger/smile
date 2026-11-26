import sys, os, re, shutil, collections
src, out = sys.argv[1], sys.argv[2]
THEMES = [
 ("response_format","The response format and the name tag"),
 ("co_creation","How the co-creation moves"),
 ("research_and_search","Research and search"),
 ("writing_style","How the writing reads"),
 ("words_to_avoid","Words and phrases left unsaid"),
 ("building_and_media","Building media, websites and PDFs"),
 ("instructions_and_why","Why a behaviour happened"),
 ("who_hanjo_is","Who Hanjo is"),
 ("spiritual_view","The view of spirit, mind and matter"),
 ("body_and_health","The body and health"),
]
POOL = ["Thank you so much for reading","So much gratitude","Many blessings","Thank you, truly",
 "With gratitude for this reading","Thank you kindly","Gratitude for your attention here",
 "Thank you for receiving this","May this be of benefit, and thank you","Warm thanks",
 "Thank you, with a smile","So much appreciation"]
g = 0
def thanks():
    global g; t = POOL[g % len(POOL)]; g += 1; return t
mods = collections.OrderedDict()
count = 0
for line in open(src, encoding="utf-8").read().split("\n"):
    if not line.strip(): continue
    theme, header, text = line.split("\t", 2)
    if theme == "the_view_he_holds": theme = "spiritual_view"
    count += 1
    mods.setdefault((theme, header), []).append(text)
slug = lambda h: re.sub(r"_+","_", re.sub(r"[^a-z0-9]+","_", h.lower())).strip("_")
names = [slug(h) for (_, h) in mods]
assert len(names) == len(set(names)), [n for n in names if names.count(n) > 1]
for d in ("module", "composition"):
    if os.path.exists(os.path.join(out, d)): shutil.rmtree(os.path.join(out, d))
bytheme = collections.defaultdict(list)
for (theme, header), texts in mods.items():
    body = "\n\n".join("    " + t for t in texts)
    s = f"(: {header} (\n\n{body}\n\n) End {header} :) {thanks()}\n"
    p = os.path.join(out, "module", theme, slug(header) + ".smile")
    os.makedirs(os.path.dirname(p), exist_ok=True)
    open(p, "w", encoding="utf-8").write(s)
    bytheme[theme].append(slug(header))
for theme, title in THEMES:
    refs = "\n\n".join(f"    [$mod/{theme}=\"{n}\"$]" for n in bytheme[theme])
    s = f"(-: {title} (-:\n\n{refs}\n\n:-) End {title} :-) {thanks()}\n"
    p = os.path.join(out, "composition", theme + ".smile")
    os.makedirs(os.path.dirname(p), exist_ok=True)
    open(p, "w", encoding="utf-8").write(s)
comps = "\n\n".join(f"    [$comp=\"{t}\"$]" for t, _ in THEMES)
open(os.path.join(out, "prompt.smile"), "w", encoding="utf-8").write("(: Gemini web chat lens, Agent of Reciprocity (\n\n    [$comp=\"gemini_web_chat_lens\"$]\n\n) End Gemini web chat lens, Agent of Reciprocity :) Thank you, with a smile\n")
open(os.path.join(out, "composition", "gemini_web_chat_lens.smile"), "w", encoding="utf-8").write(
 "(-: The Gemini web chat lens, the personal instructions for Gemini as Agent of Reciprocity (-:\n\n"
 + comps + "\n\n:-) End the Gemini web chat lens, the personal instructions for Gemini as Agent of Reciprocity :-) So much gratitude\n")
print(count, "paragraphs ->", len(mods), "modules in", len(bytheme), "compositions")
for t,_ in THEMES: print(t, len(bytheme[t]))
