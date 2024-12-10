import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

let input = fs.readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'input.txt')).toString();

let data = input.split(/\n/).filter(line => line).map(line => line.split(''));
let size = data.length;
console.assert(data.every(row => row.length == size), "Not square");

// Part 1
let directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
    [1, 1],
    [-1, -1],
    [1, -1],
    [-1, 1]
]

let count = 0;

for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
        for (let [dy, dx] of directions) {
            if (
                y + dy * 3 < size &&
                y + dy * 3 >= 0 &&
                x + dx * 3 < size &&
                x + dx * 3 >= 0 &&
                [0, 1, 2, 3].map(i => data[y + dy * i][x + dx * i]).join('') == "XMAS"
            ) count++;
        }
    }
}

console.log(count);

// Part 2
let count2 = 0;

for (let y = 1; y < size - 1; y++) {
    for (let x = 1; x < size - 1; x++) {
        if (
            /MAS|SAM/.test([-1, 0, 1].map(i => data[y + i][x + i]).join('')) &&
            /MAS|SAM/.test([-1, 0, 1].map(i => data[y + i][x - i]).join(''))
        ) count2++;

    }
}

console.log(count2);