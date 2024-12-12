import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

let input = fs.readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'input.txt')).toString();

//input = "RRRRIICCFF\nRRRRIICCCF\nVVRRRCCFFF\nVVRCCCJFFF\nVVVVCJJCFE\nVVIVCCJJEE\nVVIIICJJEE\nMIIIIIJJEE\nMIIISIJEEE\nMMMISSJEEE\n";

let data = input.split(/\n/).filter(line => line).map(line => line.split(''));
let size = data.length;
console.assert(data.every(row => row.length == size), "Non-Square");

// Part 1
let marked = data.map(row => row.map(() => false));
let area = [];
let perimiter = [];

function bfs(y, x) {
    if (marked[y][x]) return;

    marked[y][x] = true;
    area[area.length - 1]++;

    for (let [y1, x1] of [[y - 1, x], [y + 1, x], [y, x - 1], [y, x + 1]])
        if (0 <= x1 && 0 <= y1 && x1 < size && y1 < size && data[y1][x1] == data[y][x])
            bfs(y1, x1);
        else
            perimiter[perimiter.length - 1]++;
}

for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++)
        if(!marked[y][x]){
            area.push(0);
            perimiter.push(0);
            bfs(y, x);
        }

let result = area.reduce((sum, _, i) => sum + area[i] * perimiter[i], 0);
console.log(result);
