import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

let input = fs.readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'input.txt')).toString();

let [towelss, ...patternss] = input.split(/\n/);
let towels = towelss.split(/, /);
let patterns = patternss.filter(line => line);

let possible = new Set(towels);
let impossible = new Set();

function test(pattern) {
    if (impossible.has(pattern)) return false;
    if (possible.has(pattern)) return true;

    let result = false;

    for (let i = 1; i < pattern.length; i++)
        if (test(pattern.slice(0, i)) && test(pattern.slice(i)))
            result = true;
        

    result ? possible.add(pattern) : impossible.add(pattern);

    return result;
}

console.log(patterns.filter(test).length);