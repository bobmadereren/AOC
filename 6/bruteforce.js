import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

let input = fs.readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'input.txt')).toString();

let graph = input.split(/\n/).filter(row => row).map(row => row.split(''));

let startX = 0;
let startY = 0;
let startD = 'up';

while (graph[startY][startX] != '^') {
    startX++;
    if (startX == graph[startY].length) {
        startX = 0;
        startY++;
    }
}

function walk(y, x, d, oy, ox) {
    let marked = graph.map(row => row.map(_ => ({ up: false, down: false, left: false, right: false })));

    while (0 < y && 0 < x && y < graph.length - 1 && x < graph[y].length - 1 && !marked[y][x][d]) {
        marked[y][x][d] = true;

        switch (d) {
            case 'up': graph[y - 1][x] == '#' || (y - 1 == oy && x == ox) ? d = 'right' : y--; break;
            case 'down': graph[y + 1][x] == '#' || (y + 1 == oy && x == ox) ? d = 'left' : y++; break;
            case 'left': graph[y][x - 1] == '#' || (y == oy && x - 1 == ox) ? d = 'up' : x--; break;
            case 'right': graph[y][x + 1] == '#' || (y == oy && x + 1 == ox) ? d = 'down' : x++; break;
        }
    }
    return marked[y][x][d];
}

let count = 0;

for (let y = 0; y < graph.length; y++) {
    for (let x = 0; x < graph[y].length; x++) {
        if (graph[y][x] != '.') continue;
        if (walk(startY, startX, startD, y, x)) count++;
    }
}

console.log(count);

// takes ~6 sec
