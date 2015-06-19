---
author: thomas
layout: post
title: KiCad OS X Binaries
---

**EDIT: KiCad [now offers pre-compiled official
binaries](http://downloads.kicad-pcb.org/osx/), I recommend using them.**

Earlier today I shared [compilation instructions for KiCad on Mac OS
X][compile-kicad]. 

Most people are probably more interested in just getting the binaries and using
them so here they are.

**[Click here to download KiCad][download]** revision 5247 (2014-10-31: Halloween edition!).

I built this version using [my instructions][compile-kicad]. To install it, just
de-compress the ZIP file and drag the KiCad.app package to your Applications
folder.

You will also need to download the standard component library. Open a terminal
and type:

    $ cd ~/Library/Application\ Support/
    $ git clone https://github.com/KiCad/kicad-library.git kicad
    $ cd kicad && touch template/kicad.pro

Please let me know in the comments if you find this package helpful. I think it
will not be long before the KiCad project has official binaries. In the meantime, I
will update them if needed.

[compile-kicad]: /2014/11/Building-KiCad-from-source-on-Mac-OS-X
[download]: https://www.dropbox.com/s/mu99yjdiomm8e6o/kicad-20141031-r5247.zip?dl=0
