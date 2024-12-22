import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

let input = fs.readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'input.txt')).toString();

//input = "123";

let data = input.split(/\n/).filter(line => line).map(BigInt);

function next(secret) {
    secret = ((secret << 6n) ^ secret) & ((1n << 24n) - 1n);
    secret = ((secret >> 5n) ^ secret) & ((1n << 24n) - 1n);
    secret = ((secret << 11n) ^ secret) & ((1n << 24n) - 1n);
    return secret;
}

// Part 1
{
    let sum = 0n;
    for (let secret of data) {
        for (let i = 0; i < 2000; i++)
            secret = next(secret);
        sum += secret;
    }
    console.log(sum);
}

// Part 2
{
    let sumScores = new Map();

    for (let secret of data) {
        let values = [];
        let changes = [];

        for (let i = 0; i < 2000; i++) {
            values.push(next(secret) % 10n);
            changes.push(next(secret) % 10n - secret % 10n);
            secret = next(secret);
        }

        let scores = new Map();

        for (let i = 3; i < 2000; i++) {
            let seq = changes.slice(i - 3, i + 1).toString();
            if (!scores.has(seq))
                scores.set(seq, values[i]);
        }

        for (let [seq, value] of scores.entries())
            sumScores.set(seq, (sumScores.get(seq) || 0n) + value);
    }

    let maxSeq;
    let maxScore = -Infinity;

    for (let [seq, score] of sumScores)
        if(score > maxScore)
            [maxSeq, maxScore] = [seq, score];

    console.log(maxSeq, maxScore);

}
