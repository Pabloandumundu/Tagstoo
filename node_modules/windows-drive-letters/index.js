'use strict';

const childProcess = require('child_process');
const tableParser = require('table-parser');

const command = 'wmic logicaldisk get caption';

function removeUsedLetters(usedLetters) {
  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  for (let i = 0; i < usedLetters.length; i++) {
    letters.splice(letters.indexOf(usedLetters[i]), 1);
  }

  return letters;
}

function letters() {
  return new Promise((resolve, reject) => {
    childProcess.exec(command, (err, stdout) => {
      if (err) {
        return reject(err);
      }

      const letters = tableParser.parse(stdout).map((caption) => {
        return caption.Caption[0].replace(':', '');
      });

      resolve(removeUsedLetters(letters));
    });
  });
}

module.exports.letters = letters;

function usedLetters() {
  return new Promise((resolve, reject) => {
    childProcess.exec(command, (err, stdout) => {
      if (err) {
        return reject(err);
      }

      const letters = tableParser.parse(stdout).map((caption) => {
        return caption.Caption[0].replace(':', '');
      });

      resolve(letters);
    });
  });
}

module.exports.usedLetters = usedLetters;

function randomLetter() {
  return new Promise((resolve, reject) => {
    letters()
      .then((letters) => {
        const index = Math.floor(Math.random() * letters.length);
        resolve(letters[index]);
      })
      .catch(reject);
  });
}

module.exports.randomLetter = randomLetter;

function usedLettersSync() {
  const stdout = childProcess.execSync(command);
  const letters = tableParser.parse(stdout.toString()).map((caption) => {
    return caption.Caption[0].replace(':', '');
  });

  return letters;
}

module.exports.usedLettersSync = usedLettersSync;

function lettersSync() {
  const stdout = childProcess.execSync(command);
  const letters = tableParser.parse(stdout.toString()).map((caption) => {
    return caption.Caption[0].replace(':', '');
  });

  return removeUsedLetters(letters);
}

module.exports.lettersSync = lettersSync;

function randomLetterSync() {
  const letters = lettersSync();
  const index = Math.floor(Math.random() * letters.length);
  return letters[index];
}

module.exports.randomLetterSync = randomLetterSync;
