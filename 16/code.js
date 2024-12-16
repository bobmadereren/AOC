import { MinPriorityQueue } from '@datastructures-js/priority-queue';
import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

let input = fs.readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'input.txt')).toString();

let grid = input.split(/\n/).filter(line => line).map(line => line.split(''));

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
let [startY, startX] = find('S');
let [endY, endX] = find('E');

// Part 1
let dist = grid.map(row => row.map(c => ({})));
let queue = new MinPriorityQueue(([y, x, dy, dx, d]) => d);

queue.enqueue([startY, startX, 0, 1, 0]);

while (!queue.isEmpty()) {
    let [y, x, dy, dx, d] = queue.pop();

    if (dist[y][x][[dy, dx]] || grid[y][x] == '#') continue;
    dist[y][x][[dy, dx]] = d;

    if (y == endY && x == endX) break;

    queue.enqueue([y + dy, x + dx, dy, dx, d + 1]); // Forward
    queue.enqueue([y, x, -dx, dy, d + 1000]); // Rotate
    queue.enqueue([y, x, dx, -dy, d + 1000]); // Rotate
}

console.log(dist[endY][endX]);

