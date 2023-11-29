#!/usr/bin/env node

const fs = require("fs").promises;
const path = require("path");
const argv = require("minimist")(process.argv.slice(2));

const scoreArray = [100, 400, 800, 1200, 1600, 2000];
const wordListPromise = fs.readFile(path.join(__dirname, "./words_alpha.txt"), "utf8");
const usedWords = new Set();

/**
 * Generates all possible permutations of a given string.
 *
 * @param {string} lst - The input string to generate permutations from.
 * @returns {string[]} - An array of all possible permutations.
 */
function getPermutations(lst) {
	let returnedList = [];
	/**
	 * Helper function to generate all permutations of a given string.
	 * @param {string} lst - The string to generate permutations from.
	 * @param {number} length - The length of each permutation.
	 * @returns {string[]} - An array of all permutations.
	 */
	function getPermutationsHelper(lst, length) {
		// so so so ugly
		if (length === 0) return [""];
		if (length === 1) return lst;
		let result = [];
		for (let i = 0; i < lst.length; i++) {
			let firstChar = lst[i];
			let charsLeft = lst.substring(0, i) + lst.substring(i + 1);
			let innerPermutations = getPermutationsHelper(charsLeft, length - 1);
			for (let permutation of innerPermutations) {
				result.push(firstChar + permutation);
			}
		}
		return result;
	}
	for (let i = 0; i <= lst.length; i++) {
		for (let j = 1; j <= i; j++) {
			let subsets = getPermutationsHelper(lst, j);
			for (let subset of subsets) {
				if (subset.length >= 3) {
					// Check if the length of the subset is at least 3
					let possible = "";
					for (let letter of subset) {
						possible += letter;
					}
					returnedList.push(possible);
				}
			}
		}
	}
	return returnedList;
}

/**
 * Finds all the words that can be formed by permuting the letters of a given word.
 * @param {string} word - The input word.
 * @returns {Promise<string[]>} - A promise that resolves to an array of words formed by permuting the letters of the input word.
 */
async function findAllWords(word) {
	const data = await wordListPromise;
	let words = getPermutations(word);
	let lines = data.split("\r\n");
	let out = [];
	words.forEach((item) => {
		if (lines.includes(item)) {
			out.push(item);
		}
	});
	return out;
}

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
 * Checks if a word is present in the given array and has not been used before.
 * @param {string} word - The word to check.
 * @param {string[]} res - The array to search for the word.
 * @returns {boolean} - True if the word is present and not used before, false otherwise.
 */
async function checkWord(word, res) {
	if (res.includes(word) && !usedWords.has(word)) {
		usedWords.add(word);
		return true;
	} else {
		return false;
	}
}

/**
 * The main function that runs the anagram game.
 * @returns {Promise<void>} A promise that resolves when the game is finished.
 */
async function main() {
	// worst piece of code I have ever written
	let theoreticalScore = 0;
	let score = 0;
	const readline = require("readline").createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	if (argv["h"] || argv["help"]) {
		console.log("Usage: node index.js [options]");
		console.log("Options:");
		console.log("-h, --help\t\tShow this help message and exit.");
		console.log("-t, \t\t\tDisplay theoretical score.");
		console.log("How to play:");
		console.log("Given a random set of letters provided by the program, try to form as many words as possible.");
		process.exit(0);
	}
	let result = await randomWord(6);
	let res = await findAllWords(result);

	res.forEach((element) => {
		theoreticalScore += scoreArray[element.length - 3];
	});

	console.log("Enter Words (or 'exit' to quit): \n");
	console.log(result);
	const getUserInput = async () => {
		readline.question(argv["t"] ? `${score} / ${theoreticalScore} > ` : `${score} > `, async (name) => {
			if (name === "exit") {
				console.log(`You got ${usedWords.size} of ${res.length} words!`);
				readline.close();
				return;
			} else if (await checkWord(name, res)) {
				score += scoreArray[name.length - 3];
			}
			getUserInput();
		});
	};
	getUserInput();
}

main(); // entry point
