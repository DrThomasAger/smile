import os, re, html
import sys
root = sys.argv[1]
out = sys.argv[2]
order = [l.split('"')[1] for l in open(f"{root}/composition/gemini_web_chat_lens.smile") if "$comp=" in l]
secs = []
for c in order:
    txt = open(f"{root}/composition/{c}.smile", encoding="utf-8").read()
    title = re.match(r"\(-: (.*?) \(-:", txt).group(1)
    mods = []
    for folder, name in re.findall(r'\[\$mod/(\w+)="(\w+)"\$\]', txt):
        m = open(f"{root}/module/{folder}/{name}.smile", encoding="utf-8").read()
        head = re.match(r"\(: (.*?) \(\n", m).group(1)
        body = m.split("(\n", 1)[1].rsplit("\n) End", 1)[0].strip("\n")
        paras = [p.strip() for p in body.split("\n\n") if p.strip()]
        mods.append((head, paras, f"module/{folder}/{name}.smile"))
    secs.append((c, title, mods))
total = sum(len(m) for _,_,m in secs)
toc = "".join(f'<a href="#{c}"><span>{html.escape(t)}</span><em>{len(m)}</em></a>' for c,t,m in secs)
body = ""
for c,t,mods in secs:
    body += f'<section id="{c}"><h2><span class="f">(-:</span> {html.escape(t)} <span class="f">(-:</span></h2>'
    for h,ps,path in mods:
        pp = "".join(f"<p>{html.escape(p)}</p>" for p in ps)
        body += f'<article><h3><span class="f">(:</span> {html.escape(h)} <span class="f">(</span></h3>{pp}<footer><span class="f">)</span> End {html.escape(h)} <span class="f">:)</span><code>{path}</code></footer></article>'
    body += f'<p class="end"><span class="f">:-)</span> End {html.escape(t)} <span class="f">:-)</span></p></section>'
page = f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Gemini Web Chat Lens</title>
<style>
:root{{--bg:#fbf8f2;--ink:#2b2622;--soft:#6f655c;--line:#e6ddd0;--card:#fff;--face:#b4683a;--wash:#f3ece1}}
@media (prefers-color-scheme:dark){{:root:not([data-theme=light]){{--bg:#171513;--ink:#ece5da;--soft:#a69b8e;--line:#332d27;--card:#1f1c19;--face:#e09a6a;--wash:#24201c}}}}
*{{box-sizing:border-box}}html{{scroll-behavior:smooth}}
body{{margin:0;background:var(--bg);color:var(--ink);font:17px/1.7 Georgia,"Iowan Old Style",serif}}
.wrap{{max-width:760px;margin:0 auto;padding:0 16px 80px}}
header.top{{padding:56px 0 24px;border-bottom:1px solid var(--line)}}
h1{{font-size:clamp(30px,7vw,46px);line-height:1.1;margin:0 0 14px;font-weight:600;letter-spacing:-.01em}}
.lede{{color:var(--soft);margin:0}}
.f{{color:var(--face);font-family:ui-monospace,Menlo,monospace;font-weight:500;font-size:.82em}}
nav{{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:8px;margin:28px 0}}
nav a{{display:flex;justify-content:space-between;gap:10px;padding:12px 14px;border:1px solid var(--line);border-radius:10px;background:var(--card);color:var(--ink);text-decoration:none;font-size:15px;line-height:1.35;transition:transform .2s,border-color .2s}}
nav a:hover{{transform:translateY(-2px);border-color:var(--face)}}nav em{{font-style:normal;color:var(--soft)}}
.search{{position:sticky;top:0;z-index:2;background:var(--bg);padding:12px 0;border-bottom:1px solid var(--line)}}
.search input{{width:100%;font:inherit;font-size:16px;padding:10px 14px;border:1px solid var(--line);border-radius:10px;background:var(--card);color:var(--ink)}}
.count{{font-size:13px;color:var(--soft);margin-top:6px;font-family:system-ui,sans-serif}}
h2{{font-size:clamp(22px,5vw,28px);margin:56px 0 18px;line-height:1.25;font-weight:600}}
article{{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:18px 20px;margin:14px 0;animation:rise .5s ease both}}
h3{{font-size:18px;margin:0 0 8px;line-height:1.35;font-weight:600}}
article p{{margin:0 0 10px;white-space:pre-wrap;overflow-wrap:anywhere}}
footer{{font-size:14px;color:var(--soft);display:flex;flex-wrap:wrap;gap:4px 12px;align-items:baseline}}
footer code{{font-size:12px;background:var(--wash);padding:1px 6px;border-radius:5px;overflow-wrap:anywhere}}
.end{{color:var(--soft);font-size:15px}}
mark{{background:#f4d9a8;color:inherit;border-radius:3px}}
@keyframes rise{{from{{opacity:0;transform:translateY(6px)}}to{{opacity:1;transform:none}}}}
@media print{{.search{{display:none}}nav a{{break-inside:avoid}}article{{break-inside:avoid;animation:none;border-color:#ccc}}body{{font-size:12pt;background:#fff;color:#000}}section{{break-before:page}}}}
</style></head><body><div class="wrap">
<header class="top"><h1>Gemini Web Chat Lens</h1>
<p class="lede">These are the personal instructions for Gemini web chat. Each instruction is its own Smile module with your words kept exactly as you wrote them. The {total} modules sit in ten compositions.</p></header>
<nav>{toc}</nav>
<div class="search"><input id="q" type="search" placeholder="Search the instructions" aria-label="Search"><div class="count" id="n">{total} modules</div></div>
{body}
</div><script>
const q=document.getElementById('q'),n=document.getElementById('n'),arts=[...document.querySelectorAll('article')];
q.addEventListener('input',()=>{{const v=q.value.trim().toLowerCase();let k=0;
arts.forEach(a=>{{const hit=!v||a.textContent.toLowerCase().includes(v);a.style.display=hit?'':'none';if(hit)k++}});
document.querySelectorAll('section').forEach(s=>{{s.style.display=[...s.querySelectorAll('article')].some(a=>a.style.display!=='none')?'':'none'}});
n.textContent=v?k+' of {total} modules':'{total} modules'}});
</script></body></html>'''
open(out,"w",encoding="utf-8").write(page)
print(total)
