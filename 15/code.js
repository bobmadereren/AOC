import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

let input = fs.readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'input.txt')).toString();

let [gridData, pathData] = input.split('\n\n');
let grid = gridData.split(/\n/).map(line => line.split(''));
let size = grid.length;
let path = pathData.replaceAll('\n', '');
console.assert(grid.every(row => row.length == size), "Non-Square!");

let [y, x] = [0, 0];

while (grid[y][x] != '@') {
    x++;
    if (x == size) {
        x = 0;
        y++;
    }
}

grid[y][x] = '.';

for (let move of path) {
    let [dy, dx] = [0, 0];
    switch (move) {
        case '^': dy = -1; break;
        case '>': dx = 1; break;
        case 'v': dy = 1; break;
        case '<': dx = -1; break;
    }

    if (grid[y + dy][x + dx] == '.') {
        [y, x] = [y + dy, x + dx];
        continue;
    }

    if (grid[y + dy][x + dx] == '#')
        continue;

    let t = 1;
    while (grid[y + t * dy][x + t * dx] == 'O')
        t++;

    if (grid[y + t * dy][x + t * dx] == '#')
        continue;

    grid[y + t * dy][x + t * dx] = 'O';
    grid[y + dy][x + dx] = '.';
    [y, x] = [y + dy, x + dx];

    
}

let result = grid.flatMap((row, y) => row.map((c, x) => [y, x, c]))
    .filter(([y, x, c]) => c == 'O')
    .reduce((sum, [y, x]) => sum + x + y * 100, 0);

console.log(result);

