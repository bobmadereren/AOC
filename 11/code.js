import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

let input = fs.readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'input.txt')).toString();

// Part 1 & 2
let data = Object.fromEntries(input.replace(/\n/, '').split(/ /).map(n => [n, 1]));

for (let i = 0; i < 75; i++) { // For part 1: 75 -> 25 
    let dataa = {};
    let add = (n, q) => dataa[n] ? dataa[n] += q : dataa[n] = q;

    for (let [n, q] of Object.entries(data)) {
        if (n == 0) add(1, q);
        else if (n.length % 2) add(n * 2024, q);
        else {
            add(n.slice(0, n.length / 2), q);
            add(Number(n.slice(n.length / 2, n.length)), q);
        }
    }
    data = dataa;
}

let result = Object.values(data).reduce((sum, q) => sum + q, 0);
console.log(result);