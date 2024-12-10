import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

let input = fs.readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'input.txt')).toString();

let [rules, updates] = input.split(/\n\n/);
rules = new Set(rules.split(/\n/));
updates = updates.split(/\n/).filter(line => line).map(u => u.split(/,/).map(n => Number(n)));

console.assert(updates.every(u => u.length % 2), "Even number of pages");

// Part 1
function test(update) {
    for (let i = 0; i < update.length - 1; i++)
        for (let j = i + 1; j < update.length; j++)
            if (rules.has(update[j] + '|' + update[i]))
                return false;
    return true;
}

let result = updates.filter(test)
    .map(u => u[(u.length - 1) / 2])
    .reduce((sum, n) => sum + n, 0);
console.log(result);

// Part 2
function order(update) {
    update = [...update];
    for (let i = 1; i < update.length; i++)
        for (let j = i; 1 <= j && rules.has(update[j] + '|' + update[j - 1]); j--) {
            let temp = update[j];
            update[j] = update[j - 1];
            update[j - 1] = temp;
        }
    return update;
}

let result2 = updates.filter(u => !test(u))
    .map(order)
    .map(u => u[(u.length - 1) / 2])
    .reduce((sum, n) => sum + n, 0);
console.log(result2);