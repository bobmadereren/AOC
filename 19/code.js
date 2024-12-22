import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

let input = fs.readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'input.txt')).toString();

let [towelss, ...patternss] = input.split(/\n/);
let towels = towelss.split(/, /);
let towelSet = new Set(towels);
let patterns = patternss.filter(line => line);

let countMap = new Map();
countMap.set('', 1);

function count(pattern) {
    if (countMap.has(pattern)) return countMap.get(pattern);

    let result = 0;

    for (let i = 1; i <= pattern.length; i++)
        if (towelSet.has(pattern.slice(0, i))) // <--- use the first i letters as a towel
            result += count(pattern.slice(i)); // <--- and count how many times you can choose the rest of the towels

    countMap.set(pattern, result);

    return result;
}

// Part 1
let possible = patterns.filter(count);
console.log(possible.length);

// Part 2
let sum = patterns.reduce((sum, pattern) => sum + count(pattern), 0);
console.log(sum);