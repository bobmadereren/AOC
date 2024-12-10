import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

let input = fs.readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'input.txt')).toString();

let data = input.split(/\n/).filter(line => line).map(line => line.split(''));
let size = data.length;
console.assert(data.every(row => row.length == size), "Not square");

// Part 1
let antennas = {};

for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
        let l = data[y][x];
        if (l != '.') {
            if (!antennas[l]) antennas[l] = [];
            antennas[l].push([y, x]);
        }
    }
}

let antinodes = data.map(row => row.map(_ => false));

for (let as of Object.values(antennas)) {
    for (let i = 0; i < as.length; i++) {
        for (let j = i + 1; j < as.length; j++) {
            let [y0, x0] = as[i];
            let [y1, x1] = as[j];
            let [dy, dx] = [y1 - y0, x1 - x0];
            for (let [x, y] of [
                [y1 + dy, x1 + dx],
                [y0 - dy, x0 - dx]
            ]) if (y < size && y >= 0 && x < size && x >= 0) antinodes[y][x] = true;
        }
    }
}

let result = antinodes.flat().filter(b => b).length;
console.log(result);
