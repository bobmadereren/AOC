import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

let input = fs.readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'input.txt')).toString();

let [[, A, B, C, D]] = input.matchAll(/Register A: (\d+)\nRegister B: (\d+)\nRegister C: (\d+)\n\nProgram: ((\d,?)+)/g);
let data = D.split(',').map(Number);

let out = [];
let i = 0;

let combo = (operand) => {
    switch (operand) {
        case 0: case 1: case 2: case 3: return operand;
        case 4: return A;
        case 5: return B;
        case 6: return C;
    }
}

let execute = [
    operand => A = A >> combo(operand),         // 0
    operand => B = B ^ operand,                 // 1
    operand => B = combo(operand) % 8,          // 2
    operand => i = A == 0 ? i : operand - 2,    // 3
    operand => B = B ^ C,                       // 4
    operand => out.push(combo(operand) % 8),    // 5
    operand => B = A >> combo(operand),         // 6
    operand => C = A >> combo(operand),         // 7
];

while (i < data.length) {
    execute[data[i]](data[i + 1]);
    i += 2;
}

console.log(out.join());
