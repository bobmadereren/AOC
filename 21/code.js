import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

let input = fs.readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'input.txt')).toString();

let codes = input.split(/\n/).filter(line => line);

let keypad = [
    ['7', '8', '9'],
    ['4', '5', '6'],
    ['1', '2', '3'],
    ['', '0^', 'A'],
    ['<', 'v', '>'],
];

let pos = {};
for (let y = 0; y < keypad.length; y++)
    for (let x = 0; x < keypad[y].length; x++)
        for (let c of keypad[y][x])
            pos[c] = [y, x];

/**
 * All minimal words that causes the next keypad to move from (y0, x0) to (y1, x1) and press the button.
 */
function instructions([y0, x0], [y1, x1]) {
    if (y0 == y1 && x0 == x1) return ['A'];

    let result = [];

    let add = function (c, dy, dx) {
        let [y, x] = [y0 + dy, x0 + dx];
        if (0 <= y && y < keypad.length && 0 <= x && x < keypad[y].length && keypad[y][x] != '')
            instructions([y0 + dy, x0 + dx], [y1, x1]).forEach(rest => result.push(c + rest))
    }

    if (y0 < y1) add('v', 1, 0);
    if (y1 < y0) add('^', -1, 0);
    if (x0 < x1) add('>', 0, 1);
    if (x1 < x0) add('<', 0, -1);

    return result;
}

let countMap = new Map();

/**
 * Complexity of 'A'<source><target>'A' with (n + 1) keypads
 */
function count(n, source, target) {
    if (n == 0) return 1;
    if (countMap.has([n, source, target].join())) return countMap.get([n, source, target].join());

    let min = Infinity;

    for (let word of instructions(pos[source], pos[target])) {
        let len = 0;
        let current = 'A';
        for (let next of word) {
            len += count(n - 1, current, next)
            current = next;
        }
        if (len < min) min = len;
    }

    countMap.set([n, source, target].join(), min);

    return min;
}

/**
 * Complexity of a word with (n + 1) keypads
 */
function complexity(n, word) {
    let current = 'A';
    let sum = 0;
    for (let next of word) {
        sum += count(n, current, next);
        current = next;
    }
    return sum;
}

let numKeypads = 26; // <--- change to 3 for part 1
let sum = codes.reduce((sum, code) => sum + code.replace(/[^\d]/, '') * complexity(numKeypads, code), 0);
console.log(sum);
