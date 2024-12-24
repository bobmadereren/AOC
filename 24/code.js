import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

let input = fs.readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'input.txt')).toString();



let fixed = input.matchAll(/(...): (0|1)/g);
let gates = [...input.matchAll(/(...) (AND|XOR|OR) (...) -> (...)/g)];

let values = new Map();

for (let [_, name, value] of fixed)
    values.set(name, Number(value));


let changed = true;
let i = 0;
while (changed) {
    changed = false;
    console.log("Iteration", ++i);

    for (let [_, a, op, b, c] of gates)

        if (values.has(a) && values.has(b) && !values.has(c)) {

            switch (op) {
                case 'AND': values.set(c, Number(values.get(a) && values.get(b))); break;
                case 'OR': values.set(c, Number(values.get(a) || values.get(b))); break;
                case 'XOR': values.set(c, Number(values.get(a) ^ values.get(b))); break;
            }

            changed = true;

        }

}

let result = [];

for (let [name, value] of values) {
    if(/z\d\d/.test(name))
        result[Number(name.slice(1))] = value;
}

console.log(parseInt(result.reverse().join(''), 2));