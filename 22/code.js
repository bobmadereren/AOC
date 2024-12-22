import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

let input = fs.readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'input.txt')).toString();

let data = input.split(/\n/).filter(line => line).map(BigInt);

function next(secret) {
    secret = ((secret << 6n) ^ secret) & ((1n << 24n) - 1n);
    secret = ((secret >> 5n) ^ secret) & ((1n << 24n) - 1n);
    secret = ((secret << 11n) ^ secret) & ((1n << 24n) - 1n);
    return secret;
}

let sum = 0n;
for (let secret of data) {
    for (let i = 0; i < 2000; i++)
        secret = next(secret);
    sum += secret;
}
console.log(sum);
