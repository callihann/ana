# ANA - A New Anagram (game in your terminal)

![version](https://img.shields.io/badge/version-1.0.1-blue) ![version](https://img.shields.io/badge/i_love-anagrams-29ff38)
![image](https://i.ibb.co/QK94wfw/image.jpg)

This project is a JavaScript implementation of an anagram game. It generates a random set of letters and challenges the player to form as many words as possible using those letters. The game keeps track of the player's score and provides a theoretical score based on all possible words that can be formed. The project utilizes file handling to read a word list file and uses various string manipulation techniques to generate permutations of the input word and check if they exist in the word list. The game is played through the command line interface.

## Installation

Clone the repository.

```
git clone https://github.com/callihann/anagram-in-terminal.git
```

OR download a precompiled build

```
https://github.com/callihann/anagram-in-terminal/releases
```

OR install from npm

```
npm install @marlowemarlowe/ana -g
```

## Usage

### Cloned Repository

```
npm install
node ./index.js
```

### Install via npm

```
npm install @marlowemarlowe/ana -g
npx ana
```

### Prebuilt Binary

If using prebuilt binaries run using the console. Please note that MacOS and Linux binaries are untested and may be prone to error.

```
# windows
./1.0.1-anagrams-win.exe
```

### Building From Source

In order to build from source using [pkg](https://www.npmjs.com/package/pkg), simply use the predesignated configuration in package.json.

```
npm run build
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## Authors and acknowledgment

Thank you to GitHub user [dwyl](https://github.com/dwyl) for their [english-words](https://github.com/dwyl/english-words) repository. The file `words_alpha.txt` included in this repository was sourced from the [english-words](https://github.com/dwyl/english-words) repository.

## License

[MIT](https://choosealicense.com/licenses/mit/)
