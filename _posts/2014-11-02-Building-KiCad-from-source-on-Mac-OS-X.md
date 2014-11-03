---
author: thomas
title: Building KiCad from source on Mac OS X
layout: post
---

**tldr:**

 * If you are looking for a quick way to get KiCad running, please refer to [my newer
post with pre-compiled binaries][kicad-binaries].
 * If the pre-compiled package does not work for you or if you would like to learn
 how to compile it yourself, keep reading!


I have known for a while now that I needed to learn KiCad. Most open-source
projects are now using it (very simple ones to highly complex like the
[HackRF]), it is supposedly quite stable, very capable and the community is
growing quicker every week.

On a recent plane ride, I spent several hours watching the excellent [KiCad
series by Contextual Electronics][ce-kicad-playlists], hosted by [Chris
Gammell](https://twitter.com/Chris_Gammell) who is co-host on the most excellent
[TheAmpHour podcast](http://www.theamphour.com).

The first videos felt somewhat out of order and you have to hold your breath to
put the pieces together but once you are passed Series 1 to 3 everything starts
to make sense. I found the videos to be a great balance of speed and density
(that is they are very dense and very little time is wasted on easy stuff).

## Installing KiCad on a Mac

To start practising I only needed a working installation of KiCad. In the past I
have toyed with KiCad in an Ubuntu virtual machine. As much as I love Linux,
this is not quite as convenient as using KiCad directly in my Mac and so I spent
some time looking for Mac OS binaries yesterday.

[Wayne And Layne had announced in
March](http://discuss.wayneandlayne.com/t/experimental-mac-build-from-march-3-2014/17)
that they would be distributing regular OS X builds. From messages on the Kicad
Devel list, I understand that they had to do a lot of work on the code base to
get it to run nicely on OS X. Fortunately it seems that work has led to [some
great progress](https://lists.launchpad.net/kicad-developers/msg15487.html).

I searched the web for recent KiCad binaries but could not find any.  I believe
this will change very soon but until then, or if you like to live the bleeding
edge, I hope you will find those compilation instructions useful.

<!-- more -->


## Howto compile KiCad from source


Those steps are based on [`Documentation/compiling/mac-osx.txt`][compile] which
I have found to be the most up-to-date doc. Because it is part of the source
code, it will probably be regularly updated.  I have tried those steps on two
mac books. One with 10.9 (Mavericks) and one with 10.10 (Yosemite).

### Install dependencies

You will of course need Xcode. Download and install it from the Mac AppStore.

Then you will need [brew]. If you do not have it installed yet, this should be
enough to download and install it on your computer:

    ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

There are a few dependencies you need to install with brew:

    brew install cmake
    brew install bzr
    brew install glew
    brew install cairo

Now simply follow these instructions to download KiCad source code from its
[main repository on Bazaar][kicad-bzr]. (Note: if you do not want to use Bazaar,
there is a [GitHub mirror][kicad-git]. It should work but some of the compile
steps seem to require the bzr command line tool. Please let me know if you try
this with success).

    mkdir KiCad
    cd KiCad
    bzr branch lp:kicad

Then you need to tell Bazaar who you are. You do not need an account, just a
name and email address:

    bzr whoami "YourName <yourname@email.com>"

### Install wxWidgets or wxPython

KiCad depends on wxWidgets or wxPython but you cannot install them with brew
because they require KiCad specific patches (this is true on OS X only and I
understand the KiCad team is working with the wxWidgets team to merge those
patches upstream).

The [Mac OS X compile instructions][compile] state that you should be able to
use wxPython or wxWidgets but I have only managed to get the project to compile
with wxWidgets. This means I do not have scripting support in my build at the
moment.

Now you need to [download][wxw-download], and decompress it:

    tar -jxf ~/Downloads/wxWidgets-3.0.2.tar.bz2

> **Attention Mac OS X 10.10 Users (Yosemite)**
>
> There is a [known and reported bug][wxbug] in wxWidgets 3.0.2 which breaks
> compilation on Yosemite. The fix is extremely simple, edit
> `wxWidgets-3.0.2/src/osx/webview_webkit.mm` and change line 31:
>
>     #include <WebKit/WebKit.h>
>
>should read:
>
>     #include <WebKit/WebKitLegacy.h>
>
> (This will hopefully be fixed soon, if you are using wxWidgets-3.0.3, you
> might not need this).

And compile it with the script provided with KiCad:

    sh kicad/scripts/osx_build_wx.sh wxWidgets-3.0.2 wx-bin kicad "-j4" 

(this takes a while ...)

### Configure and build KiCad

Now you should have everything required to configure KiCad, run:

    mkdir build
    cd build
    cmake ../kicad \ -DCMAKE_C_COMPILER=clang \
    -DCMAKE_CXX_COMPILER=clang++ \
    -DwxWidgets_CONFIG_EXECUTABLE=../wx-bin/bin/wx-config \
    -DKICAD_SCRIPTING=OFF \ -DKICAD_SCRIPTING_MODULES=OFF \
    -DKICAD_SCRIPTING_WXPYTHON=OFF \ -DCMAKE_INSTALL_PREFIX=../bin \
    -DCMAKE_BUILD_TYPE=Release

If everything looks ok, run:

    make
    make install

And now you should have a working copy of KiCad in the bin folder.

### Install the standard component library

Finally, you will need to get the KiCad standard library (the components) and
install it locally:

    cd ~/Library/Application\ Support/
    git clone https://github.com/KiCad/kicad-library.git kicad
    cd kicad && touch template/kicad.pro

(thanks to [sethtrain] for this last step. Took me a while to figure out ...)

### Run KiCad

To launch KiCad, just run:

    cd KiCad
    open bin/kicad.app

Hope you find these instructions helpful! Please post a note in the comments
below if you have questions or feedback to share. Another great resource is the
[Kicad Info forum][kicad-forum].

## Common problems

Those are the problems I have encountered. I will add more as they are reported.


#### wxWidgets compilation fails

When building wxWidgets, you get:

    ../wxWidgets-3.0.2/src/osx/webview_webkit.mm:936:25: error: cannot initialize a variable of type 'WebBackForwardList *' with an rvalue of type 'WKBackForwardList *'
        WebBackForwardList* history = [m_webView backForwardList];
                            ^         ~~~~~~~~~~~~~~~~~~~~~~~~~~~
    ../wxWidgets-3.0.2/src/osx/webview_webkit.mm:954:25: error: cannot initialize a variable of type 'WebBackForwardList *' with an rvalue of type 'WKBackForwardList *'
        WebBackForwardList* history = [m_webView backForwardList];
                            ^         ~~~~~~~~~~~~~~~~~~~~~~~~~~~
    3 warnings and 2 errors generated.
    make: *** [webviewdll_osx_webview_webkit.o] Error 1

This is the [known bug][wxbug] mentioned above. To fix this, edit
 `wxWidgets-3.0.2/src/osx/webview_webkit.mm` and change line 31:

     #include <WebKit/WebKit.h>

should read:

     #include <WebKit/WebKitLegacy.h>

#### bzr: ERROR: Unable to determine your name.

When running `make` for KiCad, you get:

    bzr: ERROR: Unable to determine your name.

Explaination: For some reason, KiCad build tools want you to have a properly configured
bazaar.

The fix is extremely simple:

    bzr whoami "Your Name <email@address.com>"


[hackrf]: https://github.com/mossmann/hackrf
[wxw-download]: http://sourceforge.net/projects/wxwindows/files/3.0.2/wxWidgets-3.0.2.tar.bz2/download
[ce-kicad-playlists]: https://www.youtube.com/user/contextualelectronic/playlists
[brew]: http://brew.sh
[sethtrain]: https://forum.kicad.info/t/tips-for-running-kicad-on-mac-os-x/70
[compile]: http://bazaar.launchpad.net/~kicad-product-committers/kicad/product/view/head:/Documentation/compiling/mac-osx.txt
[kicad-bzr]: https://code.launchpad.net/kicad
[kicad-git]: https://github.com/KiCad/kicad-source-mirror
[wxbug]: http://trac.wxwidgets.org/ticket/16329
[kicad-forum]: https://forum.kicad.info/
[kicad-binaries]: /2014/11/KiCad-OS-X-Binaries/
