import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

let input = fs.readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'input.txt')).toString();

//input = "RRRRIICCFF\nRRRRIICCCF\nVVRRRCCFFF\nVVRCCCJFFF\nVVVVCJJCFE\nVVIVCCJJEE\nVVIIICJJEE\nMIIIIIJJEE\nMIIISIJEEE\nMMMISSJEEE\n";

let data = input.split(/\n/).filter(line => line).map(line => line.split(''));
let size = data.length;
console.assert(data.every(row => row.length == size), "Non-Square");

// Part 1 & 2
let marked = data.map(row => row.map(() => false));
let area = [];
let perimiter = [];
let corners = [];

function bfs(y, x) {
    if (marked[y][x]) return;

    marked[y][x] = true;
    area[area.length - 1]++;

    let dirs = [[-1, 0], [0, 1], [1, 0], [0, -1]];
    let peek = (dy, dx) => 0 <= x + dx && 0 <= y + dy && x + dx < size && y + dy < size && data[y + dy][x + dx] == data[y][x];

    for (let [dy, dx] of dirs)
        if (peek(dy, dx))
            bfs(y + dy, x + dx);
        else
            perimiter[perimiter.length - 1]++;

    for (let [dy, dx] of dirs)
        if (!peek(dy, dx) && !peek(-dx, dy) || peek(dy, dx) && peek(-dx, dy) && !peek(dy - dx, dy + dx))
            corners[corners.length - 1]++;
}

for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++)
        if (!marked[y][x]) {
            area.push(0);
            perimiter.push(0);
            corners.push(0);
            bfs(y, x);
        }

let result = area.reduce((sum, _, i) => sum + area[i] * perimiter[i], 0);
console.log(result);

let result2 = area.reduce((sum, _, i) => sum + area[i] * corners[i], 0);
console.log(result2);
