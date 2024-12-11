import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

let input = fs.readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'input.txt')).toString();

//input = "89010123\n78121874\n87430965\n96549874\n45678903\n32019012\n01329801\n10456732\n";

let data = input.split(/\n/).filter(line => line).map(line => line.split('').map(Number));
let size = data.length;
console.assert(data.every(row => row.length == size), "Non-Square");

// Part 1
function bfs(y, x, marked) {
    if (marked[y][x]) return 0;

    marked[y][x] = true;
    if (data[y][x] == 9) return 1;

    let nines = 0;
    for (let [y1, x1] of [[y - 1, x], [y + 1, x], [y, x - 1], [y, x + 1]])
        if (0 <= x1 && 0 <= y1 && x1 < size && y1 < size && data[y1][x1] - data[y][x] == 1)
            nines += bfs(y1, x1, marked);

    return nines;
}

let sum = 0;

for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++)
        if (data[y][x] == 0)
            sum += bfs(y, x, data.map(row => row.map(() => false)));

console.log(sum);
