import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

/*
    --- Brute force ---
    n = graph size
    p = length of initial path
    k = number of obstackles
    
    Indexing by [dy, dx]                O(n^2)      80sec
    Indexing by up/down/left/right      O(n^2)      6sec
    Reuse marked array                  O(n^2)      3sec
    Only check original path            O(p*n)      700ms
    Take leaps instead of steps         O(p*k)      50ms
*/

let startTime = Date.now();
let time = startTime;

// Read input
let input = fs.readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'input.txt')).toString();

console.log(`Read the input: ${- time + (time = Date.now())}ms`);


// Parse input
let graph = input.split(/\n/).filter(row => row).map(row => row.split(''));

console.log(`Parse the input: ${- time + (time = Date.now())}ms`);


// Find start position
let startX = 0;
let startY = 0;
let startD = 'up';

while (graph[startY][startX] != '^') {
    startX++;
    if (startX == graph.length) {
        startX = 0;
        startY++;
    }
}

console.log(`Find start position: ${- time + (time = Date.now())}ms`);


// Compute leap
let leap = graph.map(row => row.map(() => ({})));

for (let y = 0; y < graph.length; y++) {

    let left = -1;
    let right = graph.length;

    for (let x = 0; x < graph.length; x++)
        graph[y][x] == '#' ? left = x : leap[y][x].left = left;

    for (let x = graph.length - 1; 0 <= x; x--)
        graph[y][x] == '#' ? right = x : leap[y][x].right = right;
}

for (let x = 0; x < graph.length; x++) {

    let up = -1;
    let down = graph.length;

    for (let y = 0; y < graph.length; y++)
        graph[y][x] == '#' ? up = y : leap[y][x].up = up;

    for (let y = graph.length - 1; 0 <= y; y--)
        graph[y][x] == '#' ? down = y : leap[y][x].down = down;
}

console.log(`Compute leap: ${- time + (time = Date.now())}ms`);


// Initialize marked
let marked = graph.map(row => row.map(() => ({ up: -1, down: -1, left: -1, right: -1 })));

console.log(`Initialize marked: ${- time + (time = Date.now())}ms`);


// Walk
function walk(y, x, d, oy, ox) {
    let m = ox + oy * graph.length;

    while (0 < y && 0 < x && y < graph.length - 1 && x < graph.length - 1 && !(marked[y][x][d] == m)) {
        marked[y][x][d] = m;

        switch (d) {
            case 'up': y = x == ox && y > oy && oy > leap[y][x][d] ? oy + 1 : leap[y][x][d] + 1; d = 'right'; break;
            case 'down': y = x == ox && y < oy && oy < leap[y][x][d] ? oy - 1 : leap[y][x][d] - 1; d = 'left'; break;
            case 'left': x = y == oy && x > ox && ox > leap[y][x][d] ? ox + 1 : leap[y][x][d] + 1; d = 'up'; break;
            case 'right': x = y == oy && x < ox && ox < leap[y][x][d] ? ox - 1 : leap[y][x][d] - 1; d = 'down'; break;
        }
    }

    return marked[y][x][d] == m;
}


// Compute initial path
let [y, x, d] = [startY, startX, startD];
let pathMarked = graph.map(row => row.map(() => false));
let path = [];

while (0 < y && 0 < x && y < graph.length - 1 && x < graph.length - 1) {
    pathMarked[y][x] = true;

    switch (d) {
        case 'up': graph[y - 1][x] == '#' ? d = 'right' : y--; break;
        case 'down': graph[y + 1][x] == '#' ? d = 'left' : y++; break;
        case 'left': graph[y][x - 1] == '#' ? d = 'up' : x--; break;
        case 'right': graph[y][x + 1] == '#' ? d = 'down' : x++; break;
    }

    if (!pathMarked[y][x]) path.push([y, x]);
}

console.log(`Compute initial undirected path of length ${path.length + 1} in ${- time + (time = Date.now())}ms`);


// Count
let count = 0;

for (let [y, x] of path)
    count += walk(startY, startX, startD, y, x);

console.log(`Count: ${count} in ${- time + (time = Date.now())}ms`);
console.log(`Total time: ${- startTime + (time = Date.now())}ms`);
