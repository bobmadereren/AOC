import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

let input = fs.readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'input.txt')).toString();

function swap(name1, name2) {
    input = input.replaceAll('-> ' + name1, '-> ååå');
    input = input.replaceAll('-> ' + name2, '-> ' + name1);
    input = input.replaceAll('-> ååå', '-> ' + name2);
}

let toSwap = [
    ['z09', 'nnf'],
    ['z20', 'nhs'],
    ['kqh', 'ddn'],
    ['z34', 'wrc'],
]

console.log(toSwap.flat().sort().join());

for(let [a, b] of toSwap) swap(a, b);

let fixedGates = [...input.matchAll(/(...): (0|1)/g)];
let dynamicGates = [...input.matchAll(/(...) (AND|XOR|OR) (...) -> (...)/g)];

/**
 * @typedef {{name: string, operator: string, left: Gate, right: Gate, desc: Set<string>, index: number}} Gate
 */

/**
 * @type {Map<string, Gate>}
 */
let gateMap = new Map();

for (let [_, name, output] of fixedGates)
    gateMap.set(name, { name, desc: new Set(name.at(0)), index: Number(name.slice(1)) });

for (let [_, leftName, operator, rightName, name] of dynamicGates)
    gateMap.set(name, { name, operator });

for (let [_, leftName, operator, rightName, name] of dynamicGates) {
    let gate = gateMap.get(name);
    gate.left = gateMap.get(leftName);
    gate.right = gateMap.get(rightName);
    gate.desc = new Set();
}

/**
 * Gates in topological order.
 * @type {Gate[]}
 */
let gates = [];
let added = new Set();
function add(gate) {
    if (added.has(gate)) return;
    if (gate.left) add(gate.left);
    if (gate.right) add(gate.right);
    gates.push(gate);
    added.add(gate);
}

for (let gate of gateMap.values())
    add(gate);

/**
 * 
 * @param {Gate} gate 
 */
function reduce(gate) {
    if (gate.desc.size > 0) return;

    // z[0] = x[0] XOR y[0]
    if (
        gate.left.desc.has('x') &&
        gate.operator == 'XOR' &&
        gate.right.desc.has('y') &&
        gate.left.index == 0 &&
        gate.right.index == 0
    ) {
        gate.desc.add('z');
        gate.index = 0;
    }

    // rest[0] = x[0] AND y[0]
    if (
        gate.left.desc.has('x') &&
        gate.operator == 'AND' &&
        gate.right.desc.has('y') &&
        gate.left.index == 0 &&
        gate.right.index == 0
    ) {
        gate.desc.add('rest');
        gate.index = 0;
    }

    // main[i] = x[i] XOR y[i]
    if (
        gate.left.desc.has('x') &&
        gate.operator == 'XOR' &&
        gate.right.desc.has('y') &&
        gate.left.index == gate.right.index
    ) {
        gate.desc.add('main');
        gate.index = gate.right.index;
    }

    // both[i] = x[i] AND y[i]
    if (
        gate.left.desc.has('x') &&
        gate.operator == 'AND' &&
        gate.right.desc.has('y') &&
        gate.left.index == gate.right.index &&
        gate.right.index > 0
    ) {
        gate.desc.add('both');
        gate.index = gate.right.index;
    }

    // comb[i] = rest[i - 1] AND main[i]
    if (
        gate.left.desc.has('rest') &&
        gate.operator == 'AND' &&
        gate.right.desc.has('main') &&
        gate.left.index == gate.right.index - 1
    ) {
        gate.desc.add('comb');
        gate.index = gate.right.index;
    }

    // rest[i] = comb[i] OR both[i]
    if (
        gate.left.desc.has('comb') &&
        gate.operator == 'OR' &&
        gate.right.desc.has('both') &&
        gate.left.index == gate.right.index
    ) {
        gate.desc.add('rest');
        gate.index = gate.right.index;
    }

    // z[i] = rest[i - 1] XOR main[i]
    if (
        gate.left.desc.has('rest') &&
        gate.operator == 'XOR' &&
        gate.right.desc.has('main') &&
        gate.left.index == gate.right.index - 1
    ) {
        gate.desc.add('z');
        gate.index = gate.right.index;
    }

}

for (let gate of gates.filter(gate => gate.desc.size == 0)) {
    reduce(gate);

    let tmp = gate.left;
    gate.left = gate.right;
    gate.right = tmp;

    reduce(gate);
}

for (let gate of gates.filter(gate => gate.operator != undefined)) {
    console.log(
        [...gate.left.desc].map(d => d + gate.left.index).join('/'),
        gate.operator,
        [...gate.right.desc].map(d => d + gate.right.index).join('/'),
        '->',
        [...gate.desc].map(d => d + gate.index).join('/'),
        ' | ',
        gate.left.name, gate.operator, gate.right.name, '->', gate.name,
    );
}

/*
z00 =                                                                                                  (x00 XOR y00)  // main00
z01 =                                                                               ((x00 AND y00) XOR (x01 XOR y01)) // both00 XOR main01
z02 =                                        ((((x00 AND y00) AND (x01 XOR y01)) OR (x01 AND y01)) XOR (x02 XOR y02)) // ((both00 AND main01) OR both01) XOR main02 // ((both00 AND main01) OR both01) XOR main02
z03 = ((((((x00 AND y00) AND (x01 XOR y01)) OR (x01 AND y01)) AND (x02 XOR y02)) OR (x02 AND y02)) XOR (x03 XOR y03))

z09
Observed    x9 AND y9 -> both9 -> z09
Should be   main9 XOR rest8 -> z9 -> z09
Observed    main9 XOR rest8 -> z9 -> nnf

Conclude    swap z09 <-> nnf


z20
Observed    rest19 XOR main20 -> z20    |  tcv XOR gqh -> nhs
Should be   rest19 XOR main20 -> z20    |  tcv XOR gqh -> z20

Conclude    swap z20 <-> nhs


z30
Observed    both30 XOR rest29 ->   |  kqh XOR fmn -> z30
Should be   main30 XOR rest29 ->   |  ... XOR fmn -> z30
Observed    x30 XOR y30 -> main30  |  x30 XOR y30 -> ddn

Conclude    swap kqh <-> ddn


z34
Observed    main34 XOR rest33 -> z34  |  bmh XOR spk -> wrc
Should be   main34 XOR rest33 -> z34  |  bmh XOR spk -> z34

Colclude    swap z34 <-> wrc


*/
