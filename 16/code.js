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

function distance(sourceY, sourceX, ...sourceDirections) {
    let dist = grid.map(row => row.map(c => ({})));
    let queue = new MinPriorityQueue(([y, x, dy, dx, d]) => d);

    for (let [dy, dx] of sourceDirections)
        queue.enqueue([sourceY, sourceX, dy, dx, 0]);

    while (!queue.isEmpty()) {
        let [y, x, dy, dx, d] = queue.pop();

        if (dist[y][x][[dy, dx]] != null || grid[y][x] == '#') continue;
        dist[y][x][[dy, dx]] = d;

        queue.enqueue([y + dy, x + dx, dy, dx, d + 1]); // Forward
        queue.enqueue([y, x, -dx, dy, d + 1000]); // Rotate
        queue.enqueue([y, x, dx, -dy, d + 1000]); // Rotate
    }

    return dist;
}

// Part 1
let endDistance = distance(endY, endX, [1, 0], [-1, 0], [0, 1], [0, -1]);
let totalDistance = endDistance[startY][startX][[0, -1]];

console.log(totalDistance);

// Part 2
let startDistance = distance(startY, startX, [0, 1]);
let count = 0;
for (let y in grid)
    for (let x in grid[y])
        if (grid[y][x] != '#')
                count += [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dy, dx]) => startDistance[y][x][[dy, dx]] + endDistance[y][x][[-dy, -dx]] == totalDistance);

console.log(count);
