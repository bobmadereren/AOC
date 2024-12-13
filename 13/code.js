import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

let input = fs.readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'input.txt')).toString();

let match = [...input.matchAll(/Button A: X\+(\d*), Y\+(\d*)\nButton B: X\+(\d*), Y\+(\d*)\nPrize: X=(\d*), Y=(\d*)/g)]
    .map(machine => machine.slice(1, 7).map(Number));

let sum = 0;

for (let [Ax, Ay, Bx, By, Px, Py] of match) {

    Px += 10000000000000;
    Py += 10000000000000;

    console.log([Ax, Ay, Bx, By, Px, Py].join('\t'));

    let q = Ax * By - Ay * Bx;
    let d1 = Px * By - Py * Bx;
    let d2 = -Px * Ay + Py * Ax;

    if (q == 0 || d1 % q != 0 || d2 % q != 0) continue;

    let z1 = d1 / q;
    let z2 = d2 / q;

    if (z1 >= 0 && z2 >= 0)
        sum += z1 * 3 + z2;
}

console.log(sum);