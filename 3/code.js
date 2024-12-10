import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

let input = fs.readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'input.txt')).toString();

let match = [...input.matchAll(/mul\((\d{1,3}),(\d{1,3})\)/g)];

// Part 1
let result = match.reduce((sum, [_, a, b]) => sum + a * b, 0); 
console.log(result);