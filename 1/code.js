import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

let input = fs.readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'input.txt')).toString();

let match = [...input.matchAll(/(\d+) +(\d+)/g)];

let left = match.map(([_, l, r]) => Number(l)).sort();
let right = match.map(([_, l, r]) => Number(r)).sort();

// Part 1
let result = match.reduce((sum, _, i) => sum + Math.abs(left[i] - right[i]), 0);
console.log(result);

// Part 2 O(n^2)
let result2 = left.reduce((sum, l) => sum + l * right.filter(r => l == r).length, 0);
console.log(result2);

// Part 2 O(nlogn) ... O(n) when excluding the sort from the previous part
let [l, r, sum] = [0, 0, 0];

while (l < left.length && r < right.length) {
    if (left[l] == right[r]) { sum += left[l]; r++; }
    else if (left[l] > right[r]) r++;
    else if (left[l] < right[r]) l++;
}
console.log(sum);
