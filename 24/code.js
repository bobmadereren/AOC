import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

let input = fs.readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'input.txt')).toString();

let fixedGates = [...input.matchAll(/(...): (0|1)/g)];
let dynamicGates = [...input.matchAll(/(...) (AND|XOR|OR) (...) -> (...)/g)];

/**
 * @typedef {{name: string, operation: string, left: Gate, right: Gate, output: number, reduced: string, max: number, min: number}} Gate
 */

/**
 * @type {Map<string, Gate>}
 */
let gateMap = new Map();

for (let [_, name, output] of fixedGates)
    gateMap.set(name, { name, output: Number(output), reduced: name, max: Number(name.slice(1)), min: Number(name.slice(1)) });

for (let [_, leftName, operation, rightName, name] of dynamicGates)
    gateMap.set(name, { name, operation });

for (let [_, leftName, operation, rightName, name] of dynamicGates) {
    let gate = gateMap.get(name);
    gate.left = gateMap.get(leftName);
    gate.right = gateMap.get(rightName);
}

let gates = [...gateMap.values()];

function swap(name1, name2) {
    let gate1 = gateMap.get(name1);
    let gate2 = gateMap.get(name2);

    gate1.name = name2;
    gate2.name = name1;

    gateMap.set(name1, gate2);
    gateMap.set(name2, gate1);
}

let toSwap = [
    //['vbr', 'nnf'],
];

for (let [a, b] of toSwap)
    swap(a, b);

/**
 * @param {Gate} gate
 * @returns {number}
 */
function findMax(gate) {
    if (gate.max != undefined) return gate.max;
    return gate.max = Math.max(findMax(gate.left), findMax(gate.right));
}
gates.forEach(findMax);

/**
 * @param {Gate} gate
 * @returns {number}
 */
function findMin(gate) {
    if (gate.min != undefined) return gate.min;
    return gate.min = Math.min(findMin(gate.left), findMin(gate.right));
}
gates.forEach(findMin);

/**
 * @param {Gate} gate
 */
function order(gate) {
    if (gate.operation == undefined) return;
    order(gate.left);
    order(gate.right);

    if (gate.left.min > gate.right.min || gate.left.min == gate.right.min && gate.left.name > gate.right.name) {
        let temp = gate.left;
        gate.left = gate.right;
        gate.right = temp;
    }
}
gates.forEach(order);

/**
 * @param {Gate} gate
 * @returns {number} output
 */
function evaluate(gate) {
    if (gate.output != undefined) return gate.output;
    switch (gate.operation) {
        case 'AND': return gate.output = evaluate(gate.left) && evaluate(gate.right);
        case 'OR': return gate.output = evaluate(gate.left) || evaluate(gate.right);
        case 'XOR': return gate.output = evaluate(gate.left) ^ evaluate(gate.right);
    }
}
gates.forEach(evaluate);

/**
 * @param {string} name Variable name. 
 * @returns {number}
 */
function evaluateVariable(name, length) {
    let binary = gates
        .filter(gate => gate.name[0] == name)
        .sort((g1, g2) => (g1.name > g2.name) - (g1.name < g2.name))
        .map(gate => gate.output)
        .reverse()
        .slice(0, length)
        .join('');

    return parseInt(binary, 2);
}

for (let length = 0; length < 45; length++) {
    let [x, y, z] = [evaluateVariable('x', length), evaluateVariable('y', length), evaluateVariable('z', length + 1)];
    //console.log(length, x, y, x + y, z, (z - (x + y)).toString(2));
}

/**
 * @param {Gate} gate
 * @returns {string}
 */
function reduce(gate) {
    if (gate.reduced != undefined) return gate.reduced;
    return gate.reduced = `${reduce(gate.left)} ${gate.operation} ${reduce(gate.right)}`;
}
gates.forEach(reduce);

/*
    y09 OR x00
    nnf OR vbr hvg

        OR x09
    kgr AND fvp nnf
    kgr XOR fvp vbr

    x00 AND




*/
let l = /å/;
let r = /å/;

console.log(
    gates.filter(gate => gate.operation && l.test(gate.left.reduced) && r.test(gate.right.reduced))
        .map(gate => [gate.left.name, gate.operation, gate.right.name, gate.name].join(' '))
        .join('\n')
);

let zReduced = gates
    .filter(gate => gate.name[0] == 'z')
    .sort((g1, g2) => (g1.name > g2.name) - (g1.name < g2.name))
    .map(gate => [gate.name, gate.max, gate.reduced]);

/**
 * @param {string} gateName 
 */
function print(gateName) {
    let gate = gateMap.get(gateName);
    console.log(gate.left.name, gate.operation, gate.right.reduced, '->', gate.name);
}

//console.log(zReduced.join('\n'))

print('z03')
print('vnw')
print('nqw')
print('skd')
print('qrt')
print('dsr')