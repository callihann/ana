const fs = require("fs").promises;
const path = require("path");

const scoreArray = [100, 400, 800, 1200, 1600, 2000];
const wordListPromise = fs.readFile(path.join(__dirname, "./words_alpha.txt"), "utf8");
const usedWords = new Set();

/**
 * Generates a random word of the specified length.
 * @param {number} length - The length of the word to generate.
 * @returns {Promise<string>} A promise that resolves to a randomly generated word which has been shuffled.
 */
async function randomWord(length) {
	const re = new RegExp(`\\b\\w{${length},${length}}\\b`, "gm");
	try {
		const data = await wordListPromise;
		let lines = data.match(re);
		let index = Math.floor(Math.random() * lines.length);
		return shuffleLetters(lines[index]); // shuffle the letters of the word
	} catch (err) {
		console.error(err);
	}
}

/**
 * Shuffles the letters of a word.
 * @param {string} word - The word to shuffle.
 * @returns {string} The shuffled word.
 */
function shuffleLetters(word) {
	let letters = word.split("");
	for (let i = letters.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[letters[i], letters[j]] = [letters[j], letters[i]];
	}
	return letters.join("");
}

/**
 * Checks if a given word can be formed using the letters in the result.
 * @param {string} word - The word to be checked.
 * @param {string} result - Used to determine whether the checked word is valid.
 * @returns {boolean} - Returns true if the word can be validated, false otherwise.
 */
async function checkWord(word, result) {
	const data = await wordListPromise;
	let lines = data.split("\r\n");
	let counter = 0;
	const letterCount = new Map();
	for (const letter of result) {
		letterCount.set(letter, (letterCount.get(letter) || 0) + 1);
	}
	for (const letter of word) {
		if (!letterCount.has(letter) || letterCount.get(letter) <= 0) {
			return false;
		}
		letterCount.set(letter, letterCount.get(letter) - 1);
		counter++;
	}
	if (usedWords.has(word)) {
		return false;
	} else if (counter !== word.length) {
		return false;
	} else if (lines.includes(word)) {
		usedWords.add(word);
		return true;
	} else {
		return false;
	}
}

async function main() {
	let result = await randomWord(6);
	let score = 0;
	const readline = require("readline").createInterface({
		input: process.stdin,
		output: process.stdout,
	});
	console.log("Enter Word (or 'exit' to quit): \n");
	console.log(result);
	const getUserInput = async () => {
		readline.question(`${score} > `, async (name) => {
			if (name === "exit") {
				readline.close();
				return;
			} else if (await checkWord(name, result)) {
				score += scoreArray[name.length - 3];
			}
			getUserInput();
		});
	};
	getUserInput();
}

main();
