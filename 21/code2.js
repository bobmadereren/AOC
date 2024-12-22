import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

let input = fs.readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'input.txt')).toString();

//let codes = input.split(/\n/).filter(line => line);

let codes = [
    [
        '^^<A^>AvvAvA',
        '^^<A>^AvvAvA',
        '^<^A^>AvvAvA',
        '^<^A>^AvvAvA',
        '<^^A^>AvvAvA',
        '<^^A>^AvvAvA'
    ],
    [
        '^<A^^Avv>AvA',
        '^<A^^Av>vAvA',
        '^<A^^A>vvAvA',
        '<^A^^Avv>AvA',
        '<^A^^Av>vAvA',
        '<^A^^A>vvAvA'
    ],
    [
        '^^A^<<Avv>vA>A',
        '^^A^<<Av>vvA>A',
        '^^A^<<A>vvvA>A',
        '^^A<^<Avv>vA>A',
        '^^A<^<Av>vvA>A',
        '^^A<^<A>vvvA>A',
        '^^A<<^Avv>vA>A',
        '^^A<<^Av>vvA>A',
        '^^A<<^A>vvvA>A'
    ],
    [
        '^^<<A>A^>AvvvA',
        '^^<<A>A>^AvvvA',
        '^<^<A>A^>AvvvA',
        '^<^<A>A>^AvvvA',
        '^<<^A>A^>AvvvA',
        '^<<^A>A>^AvvvA',
        '<^^<A>A^>AvvvA',
        '<^^<A>A>^AvvvA',
        '<^<^A>A^>AvvvA',
        '<^<^A>A>^AvvvA'
    ],
    [
        '^<A^^<A>>AvvvA',
        '^<A^<^A>>AvvvA',
        '^<A<^^A>>AvvvA',
        '<^A^^<A>>AvvvA',
        '<^A^<^A>>AvvvA',
        '<^A<^^A>>AvvvA'
    ]
];

let keypad = [
    [, '^', 'A'],
    ['<', 'v', '>'],
];

let pos = new Map(keypad.map((row, y) => row.map((c, x) => [String(c), [y, x]])).flat());

/**
 * All shortest instruction sets to move from (y0, x0) to (y1, x1) and press the button.
 */
function instructions([y0, x0], [y1, x1]) {
    if (y0 == y1 && x0 == x1) return ['A'];

    let result = [];

    let add = function (c, dy, dx) {
        let [y, x] = [y0 + dy, x0 + dx];
        if (0 <= y && y < keypad.length && 0 <= x && x < keypad[y].length && keypad[y][x] != null)
            instructions([y0 + dy, x0 + dx], [y1, x1]).forEach(rest => result.push(c + rest))
    }

    if (y0 < y1) add('v', 1, 0);
    if (y1 < y0) add('^', -1, 0);
    if (x0 < x1) add('>', 0, 1);
    if (x1 < x0) add('<', 0, -1);

    return result;
}

let countMap = new Map();

/**
 * Length of minimum initial instruction sequence that through a chain of n keypads
 * moves an (n + 1)-th keypad from source to target and presses the button.
 * Assuming the n keypads starts at 'A'
 */
function count(n, source, target) {
    if (n == 0) return 1;
    if (countMap.has([n, source, target].join())) return countMap.get([n, source, target].join());

    let min = Infinity;

    for (let word of instructions(pos.get(source), pos.get(target))) {
        let len = 0;
        let current = 'A';
        for (let next of word) {
            len += count(n - 1, current, next)
            current = next;
        }
        if (len < min) min = len;
    }

    countMap.set([n, source, target].join(), min);

    return min;
}

function complexity(n, word) {
    let current = 'A';
    let sum = 0;
    for (let next of word) {
        sum += count(n, current, next);
        current = next;
    }
    return sum;
}

for (let words of codes)
    console.log(Math.min(...words.map(word => complexity(25, word))));

