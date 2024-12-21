import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

let input = fs.readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'input.txt')).toString();

let size = 70;
let bytes = 1024;

let corrupted = new Set(input.split(/\n/).slice(0, bytes));
let dist = new Map();

let queue = [[0, 0, 0]];

for (let [x, y, d] of queue) {
    if (x < 0 || y < 0 || x > size || y > size || corrupted.has(x + ',' + y) || dist.has(x + ',' + y)) continue;

    dist.set(x + ',' + y, d);

    for (let [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]])
        queue.push([x + dx, y + dy, d + 1]);
}

console.log(dist.get(size + ',' + size));
