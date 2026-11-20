GOLD LETTER  ·  version 1.000
A bold slab serif display font. Free for anyone to use.

More from the maker: https://www.youtube.com/@V1CT0R10U5YT


WHAT IS IN THIS PACKAGE

  GoldLetter-Regular.ttf     the font, for Windows, macOS, Linux and most apps
  GoldLetter-Regular.otf     the same font in OpenType CFF form
  GoldLetter-Regular.woff2   the font for websites
  gold-letter.css            a stylesheet that shows the font in gold on a website
  gold-atlas.png, .fnt       the textured gold letters as images, for game engines
  OFL.txt                    the licence
  README.txt                 this guide


INSTALL IT

  Windows   Right-click GoldLetter-Regular.ttf and choose "Install for all users".
  macOS     Double-click GoldLetter-Regular.ttf and press "Install" in Font Book.
  Linux     Copy GoldLetter-Regular.ttf into ~/.local/share/fonts and run:  fc-cache -f
  Phones    iOS and Android need a font installer app. Web use needs no install.

  After installing, restart the app you want to use it in. The font then
  appears in the font list as "Gold Letter".


USE IT IN DOCUMENTS, DESIGN AND VIDEO APPS

  Pick "Gold Letter" from the font list. It is a display font, made for
  titles, thumbnails, posters, logos and headings. It reads well from about
  14 pixels upward and looks its best at 40 pixels and larger.

  Line spacing   A line height of 1.15 or more keeps descenders and accents clear.
  Kerning        The font carries its own kerning. Leave kerning on "Metrics" or "Auto".
  Colour         It takes whatever colour the app gives it. For gold, use a
                 vertical gradient from #fff3b0 through #d9a021 to #7a4f06
                 with a dark brown outline (#3a2504).


USE IT ON A WEBSITE

  Put GoldLetter-Regular.woff2, GoldLetter-Regular.ttf and gold-letter.css in
  one folder on your site, then:

    <link rel="stylesheet" href="gold-letter.css">
    <h1 class="gold-letter">Victory</h1>

  The class "gold-letter" gives gold gradient text. For the font in a flat
  colour, use it like any other font:

    h1 { font-family: "Gold Letter", Georgia, serif; color: #8b0000; }


USE IT IN A GAME

  Vector text    Load GoldLetter-Regular.ttf as you would any font. Tested in
                 the LOVE engine and on a Java canvas.
  Gold letters   gold-atlas.png with gold-atlas.fnt is a bitmap font in the
                 common BMFont text format, read by most engines. The
                 letters are about 60 pixels tall and should be drawn at that
                 size or smaller. It holds the keyboard characters only.


USE IT FROM THE COMMAND LINE

  ImageMagick   convert -font GoldLetter-Regular.ttf -pointsize 96 -fill "#e0b040" -background "#1c1c1c" label:"Gold Letter" title.png
  FFmpeg        ffmpeg -i in.mp4 -vf "drawtext=fontfile=GoldLetter-Regular.ttf:text='Gold Letter':fontsize=96:fontcolor=0xe0b040:x=(w-text_w)/2:y=80" out.mp4


WHAT IT CAN TYPE

  A to Z, a to z, 0 to 9, all keyboard punctuation and symbols, curly quotes,
  dashes, most Western and Central European accented letters, fractions,
  superscript and subscript digits, and signs such as € ¥ ¢ ° ± ÷ × ™.

  Not in the font:  £ ¤ ¦ § © ¬ ® µ ¶ Þ þ ß ð ƒ † ‡
  An app will show these in another font.


IF SOMETHING LOOKS WRONG

  The font is not in the list        Restart the app. On Windows, install "for all users".
  The old version still shows        Remove the old Gold Letter first, then install again.
  Letters are cut off at the bottom  Raise the line height to 1.15 or more.
  Gold web text shows as flat gold   The browser lacks gradient text. The flat colour is the fallback.
  The web font does not load         Keep the font files beside gold-letter.css, and serve
                                     the page from a web server, since some browsers block
                                     fonts opened straight from a folder.
  Letters look too tight or loose    Check that the app's kerning is on. Add letter spacing to taste.
  A character shows in another font  It is one of those listed above as not in the font.
  Edges look soft at very large size The letters were traced from a small drawing. Sizes
                                     above about 300 pixels show it.
  Gold atlas letters show slivers    Some capitals carry a thin edge of their neighbour.
  of a neighbouring letter           Use the vector font with a gold gradient for those words.


LICENCE

  SIL Open Font License 1.1, in OFL.txt. In short: anyone may use the font
  for personal and commercial work, embed it, change it and share it. It may
  not be sold by itself.
