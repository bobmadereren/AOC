import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

let input = fs.readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'input.txt')).toString();

let data = input.split(/\n/).filter(line => line).map(line => line.split(' '));

// Part 1
function safe(report) {
    let d = 0;
    for (let i = 1; i < report.length; i++) {
        let newD = report[i] - report[i - 1];
        if (Math.abs(newD) > 3 || Math.abs(newD) < 1 || Math.abs(Math.sign(newD) - Math.sign(d)) == 2) return false;
        d = newD;
    }
    return true;
}

let result = data.filter(safe).length;
console.log(result);

// Part 2
let data2 = data.map(report => report.map((_, i) => [...report.slice(0, i), ...report.slice(i + 1, report.length)]));
let result2 = data2.filter(reports => reports.some(safe)).length;
console.log(result2);