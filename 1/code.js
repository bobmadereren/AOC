import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

let input = fs.readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'input.txt')).toString();

let match = [...input.matchAll(/(\d+) +(\d+)/g)];

let as = match.map(([_, a, b]) => a).sort();
let bs = match.map(([_, a, b]) => b).sort();

let result = match.reduce((sum, _, i) => sum + Math.abs(as[i] - bs[i]), 0);

console.log(result);