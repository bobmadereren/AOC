import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

let input = fs.readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'input.txt')).toString();

let width = 101;
let height = 103;
let time = 100;

let data = [...input.matchAll(/p=(\d+),(\d+) v=(-?\d+),(-?\d+)/g)]
    .map(robot => robot.slice(1, 5).map(Number));

let quandrants = [0, 0, 0, 0];

for (let [x, y, dx, dy] of data) {
    let endX = ((x + dx * time) % width + width) % width;
    let endY = ((y + dy * time) % height + height) % height;

    let qX = Math.sign(endX - (width - 1) / 2);
    let qY = Math.sign(endY - (height - 1) / 2);

    if (qX == 0 || qY == 0) continue;

    quandrants[(qX + 1) / 2 + qY + 1]++;
}
console.log(quandrants);

let result = quandrants.reduce((product, n) => product * n, 1);
console.log(result);