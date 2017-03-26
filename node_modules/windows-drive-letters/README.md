# windows-drive-letters

> Get a list of available drive letters for use.

[![AppVeyor](https://ci.appveyor.com/api/projects/status/b707ardgrdf0lwa3?svg=true)](https://ci.appveyor.com/project/mrmlnc/windows-drive-letters)
[![NPM version](https://img.shields.io/npm/v/windows-drive-letters.svg?style=flat-square)](https://www.npmjs.com/package/windows-drive-letters)
[![devDependency Status](https://img.shields.io/david/mrmlnc/windows-drive-letters.svg?style=flat-square)](https://david-dm.org/mrmlnc/windows-drive-letters#info=dependencies)
[![devDependency Status](https://img.shields.io/david/dev/mrmlnc/windows-drive-letters.svg?style=flat-square)](https://david-dm.org/mrmlnc/windows-drive-letters#info=devDependencies)

## Install

```
$ npm i -S windows-drive-letters
```

## Usage

### letters & lettersSync

Get a list of all available drive letters for use:

**Asynchronous**

```js
driveLetters.letters().then((letters) => {
  console.log(letters); // => ['A', 'B', ...]
}).catch((err) => {
  console.error(err);
});
```

**Synchronous**

```js
const letters = driveLetters.lettersSync();
console.log(letters); // => ['A', 'B', ...]
```

Get a list of all available drive letters that are used (in use):

**Asynchronous**

```js
driveLetters.usedLetters().then((letters) => {
  console.log(letters); // => ['C', 'D', ...]
}).catch((err) => {
  console.error(err);
});
```

**Synchronous**

```js
const letters = driveLetters.usedLettersSync();
console.log(letters); // => ['C', 'D', ...]
```

### randomLetter & randomLetterSync

Get a random letter, available for use:

**Asynchronous**

```js
driveLetters.randomLetter().then((letter) => {
  console.log(letter); // => 'Q'
}).catch((err) => {
  console.error(err);
});
```

**Synchronous**

```js
const letter = driveLetters.randomLetterSync();
console.log(letter); // => 'N'
```

## Changelog

See the [Releases section of our GitHub project](https://github.com/mrmlnc/windows-drive-letters/releases) for changelogs for each release version.

## License

This software is released under the terms of the MIT license.
