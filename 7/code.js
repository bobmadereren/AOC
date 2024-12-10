import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

let input = fs.readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'input.txt')).toString();

let data = input.split(/\n/).filter(line => line).map(line => line.split(/:? /).map(n => Number(n)));

// Part 1
function test([left, n, ...ns]) {
    let rs = [n];
    for(let n of ns)
        rs = rs.map(r => [r + n, r * n]).flat();

    return rs.some(right => left == right);
}

let result = data.filter(test).reduce((sum, [n]) => sum + n, 0);
console.log(result);

