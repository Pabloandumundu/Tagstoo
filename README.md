DESCRIPTION

With this application you can tag folders and files; create tags with various shapes and colours for easier classification and by drag and dropping them, tag a file, a folder or all the content of a folder.

![](https://tagstoo.sourceforge.io/demoimage1lq.png)

Precise search possibilities, with various input fields, allowing to add all the necessary tags that you want. For example, in one field you can add tags ‘cat’ and ‘white’ and in another field you can add tags ‘dog’ and ‘brown’, so the search result will return all white cats and brown dogs.

Multimedia file preview in both explorer and search results cards. Cover image of epubs also are shown.

For images both system's default image viewer and program's new internal viewer can be launched alternatively.

Usual file management actions by dragging and dropping or pressing buttons; copy, move, delete, rename. And undo action button.

It is possible to export/import tagging data to a file, so data is available in any computer.

FEATURES

- Tag Folders and files easily by dragging and dropping tags created from a variety of shapes.
- Does not require installation (Windows & Linux), in Windows it's a standalone executable.
- Export/import data to a file.
- Possible to build up very specific searches.
- Various Viewmodes; from a list to cards of different sizes to preview folders and files.
- Multimedia file preview in explorer/searcher. Also Epubs.
- Integrated image viewer that can be launched alternatively to the system's default one.
- Tags positions are interchangeable.


**Distributable version, as a stand-alone and portable executable can be downloaded from [https://tagstoo.sourceforge.io/](https://tagstoo.sourceforge.io)**

To use the source code (require nw.js to launch):

1. Install NW.JS (SDK edition if you want to use Chome DevTools) in some directory.
2. Copy the source code to that directory.
3. If you want video/audio reproduction fully available download the correspondent compiled version of ffmpeg from [https://github.com/iteufel/nwjs-ffmpeg-prebuilt/releases](https://github.com/iteufel/nwjs-ffmpeg-prebuilt/releases) and overwrite the ffmpeg.dll (in Windows) or lib/libffmpeg.so (in Linux)that came with NW.JS with them.
4. Execute nw.exe (in Windows) or launch ./nw in terminal (in Linux)

The code is like a web page, with some html and the /js folder where is the code in Javascript (and jQuery).

Some notes about the code:

The program uses IndexedDB web-browser based database system to save the data, and as mentionen in features it can export data to a file (in Json format).

Program uses various libraries, that are specified in the info options of the program.
