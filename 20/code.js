import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

let input = fs.readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'input.txt')).toString();

let grid = input.split(/\n/).filter(line => line).map(row => row.split(''));
let size = grid.length;

function find(c) {
    let [y, x] = [0, 0];
    while (grid[y][x] != c) {
        x++;
        if (x == grid[y].length) {
            x = 0;
            y++;
        }
    }
    return [y, x];
}
let [endY, endX] = find('E');

let dist = grid.map(row => row.map(c => null));

let queue = [[endY, endX, 0]];
for (let [y, x, d] of queue) {
    if (dist[y][x] != null || grid[y][x] == '#') continue;
    dist[y][x] = d;
    for (let [dy, dx] of [[1, 0], [-1, 0], [0, 1], [0, -1]])
        queue.push([y + dy, x + dx, d + 1]);
}
queue = null;

let cheatLength = 20; // 2 for Part 1
let count = 0;

for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++)
        for (let dy = -cheatLength; dy <= cheatLength; dy++)
            for (let dx = - cheatLength; dx <= cheatLength; dx++)
                if (Math.abs(dy) + Math.abs(dx) <= cheatLength)
                    if (
                        0 <= x + dx &&
                        0 <= y + dy &&
                        y + dy < size &&
                        x + dx < size &&
                        grid[y][x] != '#' &&
                        grid[y + dy][x + dx] != '#'
                    )
                        if (dist[y + dy][x + dx] + Math.abs(dy) + Math.abs(dx) <= dist[y][x] - 100)
                            count++;

console.log(count);
