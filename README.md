DESCRIPTION

Tag folders and files (including multimedia) by dragging the tags on them, you can create tags of various shapes and colors for a more intuitive classification.

![](https://tagstoo.sourceforge.io/img_ext/demoimage1lq.png)

Precise search possibilities, with various input fields, allowing to add all the necessary tags that you want. For example, in one field you can add the tags 'cat' and 'white' and in another field you can add the tags 'dog' and 'brown', so the search result will return all white cats and brown dogs.  Another more abstract example to show the available searches can be: Searh under folders that have (tag50) or (tag51 + tag52) files that have (tag1 + tag2 + tag7 + tag8) or (tag1 + tag2 + tag6 + tag9) but don't have (tag10) and (tag11).

Multimedia files preview in both explorer and searcher results cards. The cover images of epubs also are shown.

For images both system's default image viewer and program's new internal viewer can be launched alternatively.

Usual file management actions by dragging and dropping or pressing buttons; copy, move, delete, rename. And undo button.

It's possible to export/import the tagging data to a file, so data is available in any computer.

FEATURES

- Tag Folders and files easily by dragging and dropping tags created from a variety of shapes.
- No installation required. Compatible with Windows, Linux and Mac OS.
- Export/import data to a file.
- Possible to build up very specific searches.
- Various Viewmodes; from lists to cards of different sizes to preview folders and files.
- Multimedia file preview in explorer/searcher. Also Epubs.
- Integrated image viewer that can be launched alternatively to the system's default viewer.
- Tags positions are interchangeable.
- If you want a softer interface you have the option to choose a 'grayscale' mode.


**Distributable version, as a stand-alone and portable executable can be downloaded from [https://tagstoo.sourceforge.io/](https://tagstoo.sourceforge.io)**

To use the source code (require nw.js to launch):

1. Install Electron (https://electronjs.org/).
2. Put the source code of Tagstoo in a folder.
3. Execute "electron ." in the terminal inside that folder.

The code is like a web page, with some html, css and the /js folder where the main code can be found in Javascript (and jQuery).

Some notes about the code:

The program uses IndexedDB web-browser based database system to save the data, and as mentionen in features it can export data to a file (in Json format).

Program uses various libraries, that are specified in the info options of the program.
