import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

let input = fs.readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'input.txt')).toString();

let data = input
    .split(/\n\n/)
    .map(thing => thing
        .split(/\n/)
        .filter(line => line)
        .map(line => line.split(''))
    );

let locks = [];
let keys = [];

function transpose(matrix) {
    let height = matrix.length;
    let width = Math.max(...matrix.map(row => row.length));
    let result = [];
    for (let x = 0; x < width; x++) {
        result[x] = [];
        for (let y = 0; y < height; y++)
            result[x][y] = matrix[y][x];
    }
    return result;
}

for (let thing of data) {
    if (thing.at(0).every(c => c == '#') && thing.at(-1).every(c => c == '.')) {
        let lock = [0, 0, 0, 0, 0];
        for (let x = 0; x < 5; x++)
            for (let y = 1; y < 6; y++)
                if (thing[y][x] == '#')
                    lock[x]++;
        locks.push(lock);
    }

    if (thing.at(0).every(c => c == '.') && thing.at(-1).every(c => c == '#')) {
        let key = [0, 0, 0, 0, 0];
        for (let x = 0; x < 5; x++)
            for (let y = 1; y < 6; y++)
                if (thing[y][x] == '#')
                    key[x]++;
        keys.push(key);
    }
}

function fit(key, lock) {
    for (let x = 0; x < 5; x++)
        if (key[x] + lock[x] > 5)
            return false;
    return true;
}

let count = 0;
for (let lock of locks)
    for (let key of keys)
        count += fit(key, lock);
    
console.log(count);