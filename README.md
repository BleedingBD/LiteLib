# LiteLib

LiteLib is a lightweight Library for BetterDiscord plugins.

## Rationale

Zere's Plugin Library is good, but it's huge. Because it's so big it's more prone to breaking, causing all the plugins that depend on it to break as well. It provides a list of common Discord Modules, but because it's not updated and checked frequently, it's not always up to date meaning that plugins that depend on it may break.

ZLibrary also requires a lot of boilerplate code and provides features that are not needed for most plugins.

## Philosophy

LiteLib's philosophy is quite simple: Reduce boilerplate but keep it simple.

This can be seen in a handful of places:

* All of the metadata needed is taken from the metadata header where possible
* LiteLib will automatically remove patches and styles when the plugin is disabled.
* It's Modules module is a thin wrapper around BetterDiscord's API and will memoize it's results.
* The Patcher module is a thin wrapper around the BetterDiscord's Patcher.

## Advantages over Zere's Plugin Library

* Automatically hot reloads plugins that depend on it on first launch.
* The Library file is around 1/8th of the size of ZLibrary.
  * In all fairness this is in big parts because features that were originally part of ZLibrary were added to BetterDiscord's API, so most of the work was still done by Zerebos who also developed the current version of BD to begin with.
* Keep metadata separate from the code because all the metadata is taken from the file's header.
* The updater allows for renaming and updating of plugins paths.
* Reduced boilerplate code.
* Automatic Memoization whereever it's reasonable
* The ability to disable periodic update checks
* TypeDefs for both the library and the BdAPI are available

## Disadvantages compared to Zere's Plugin Library

* No system to build config interfaces from a json config object
* No built-in library of known Discord Modules
* No Popouts, Tooltips and Context Menu utilities