import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

let input = fs.readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'input.txt')).toString();

let data = input.split(/\n/).filter(line => line).map(line => line.split('').map(Number));
let size = data.length;
console.assert(data.every(row => row.length == size), "Non-Square");

// Part 1
{
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
}

// Part 2
{
    let marked = data.map(row => row.map(() => false));
    let nines = data.map(row => row.map(() => undefined));

    function bfs(y, x) {
        if (marked[y][x]) return;

        nines[y][x] = data[y][x] == 9;

        for (let [y1, x1] of [[y - 1, x], [y + 1, x], [y, x - 1], [y, x + 1]])
            if (0 <= x1 && 0 <= y1 && x1 < size && y1 < size && data[y1][x1] - data[y][x] == 1) {
                bfs(y1, x1);
                nines[y][x] += nines[y1][x1];
            }
    }

    let sum = 0;

    for (let y = 0; y < size; y++)
        for (let x = 0; x < size; x++)
            if (data[y][x] == 0) {
                bfs(y, x);
                sum += nines[y][x];
            }

    console.log(sum);
}