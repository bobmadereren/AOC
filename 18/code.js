import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

let input = fs.readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'input.txt')).toString();

let data = input.split(/\n/).filter(line => line);

function distance(time) {
    let size = 70;

    let corrupted = new Set(data.slice(0, time));
    let dist = new Map();

    let queue = [[0, 0, 0]];

    for (let [x, y, d] of queue) {
        if (x < 0 || y < 0 || x > size || y > size || corrupted.has(x + ',' + y) || dist.has(x + ',' + y)) continue;

        dist.set(x + ',' + y, d);

        for (let [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]])
            queue.push([x + dx, y + dy, d + 1]);
    }

    return dist.get(size + ',' + size);
}

// Part 1
console.log(distance(1024));

// Part 2     (2856 8,14)    
let [t0, t1] = [0, data.length];
while (t1 - t0 > 1) {
    let t = (t0 + t1) >> 1;
    distance(t) ? t0 = t : t1 = t;
}
console.log(data[t1 - 1]);

