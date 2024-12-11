import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

let input = fs.readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'input.txt')).toString();

// Part 1
let data = input.replace(/\n/, '').split(/ /);

for (let i = 0; i < 25; i++)
    data = data.flatMap(d => d == 0 ? 1 : d.length % 2 ? d * 2024 : [d.slice(0, d.length / 2), Number(d.slice(d.length / 2, d.length))]).map(String);

console.log(data.length);