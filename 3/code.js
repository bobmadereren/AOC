import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

let input = fs.readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'input.txt')).toString();

// Part 1
let match = [...input.matchAll(/mul\((\d{1,3}),(\d{1,3})\)/g)];
let result = match.reduce((sum, [_, a, b]) => sum + a * b, 0);
console.log(result);

// Part 2
let match2 = [...input.matchAll(/do\(\)|don't\(\)|mul\((\d{1,3}),(\d{1,3})\)/g)];
let result2 = match2.reduce((([sum, active], [op, a, b]) => /mul/.test(op) ? [sum + active * a * b, active] : [sum, /do\(\)/.test(op)]), [0, true]);
console.log(result2);