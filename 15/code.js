import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

let input = fs.readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'input.txt')).toString();

// Part 1
{
    let [gridData, pathData] = input.split('\n\n');
    let grid = gridData.split(/\n/).map(line => line.split(''));
    let path = pathData.replaceAll('\n', '');

    let [y, x] = [0, 0];

    while (grid[y][x] != '@') {
        x++;
        if (x == grid[y].length) {
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
}

// Part 2
{
    let widen = {
        '#': '##',
        'O': '[]',
        '.': '..',
        '@': '@.',
    }

    let [gridData, pathData] = input.split('\n\n');
    let grid = gridData.split(/\n/).map(line => line.split('')).map(row => row.flatMap(c => widen[c].split('')));
    let path = pathData.replaceAll('\n', '');

    let [y, x] = [0, 0];

    while (grid[y][x] != '@') {
        x++;
        if (x == grid[y].length) {
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

        if (dy == 0) {
            let t = 1;
            while (/\[|\]/.test(grid[y][x + t * dx]))
                t++;

            if (grid[y][x + t * dx] == '#')
                continue;

            while (t > 0)
                grid[y][x + t * dx] = grid[y][x + (--t) * dx];
        }

        if (dx == 0) {
            let t = 1;
            let layers = [[x]];

            while (layers[t - 1].length > 0) {
                layers[t] = [];
                for (let x of layers[t - 1]) {
                    if (grid[y + t * dy][x] == ']') layers[t].push(x - 1, x);
                    if (grid[y + t * dy][x] == '[') layers[t].push(x, x + 1);
                }
                layers[t] = [...new Set(layers[t])];
                t++;
            }
            t--;

            if (layers.some((layer, t) => layer.some(x => grid[y + (t + 1) * dy][x] == '#')))
                continue;

            while (t >= 0) {
                for (let x of layers[t]){
                    grid[y + (t + 1) * dy][x] = grid[y + t * dy][x];
                    grid[y + t * dy][x] = '.';
                }
                t--;
            }

        }

        if (grid[y + dy][x + dx] == '.')
            [y, x] = [y + dy, x + dx];
    }

    let result = grid.flatMap((row, y) => row.map((c, x) => [y, x, c]))
        .filter(([y, x, c]) => c == '[')
        .reduce((sum, [y, x]) => sum + x + y * 100, 0);

    console.log(result);
}