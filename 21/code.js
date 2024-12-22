import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

let input = fs.readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'input.txt')).toString();

let codes = input.split(/\n/).filter(line => line);

/*
 *                                                      7 8 9
 *     ^ A              ^ A              ^ A            4 5 6
 *   < v >    --->    < v >    --->    < v >    --->    1 2 3
 *                                                        0 A
 */

let keypad = [
    [7, 8, 9],
    [4, 5, 6],
    [1, 2, 3],
    [, 0, 'A'],
    [, '^', 'a'],
    ['<', 'v', '>'],
];

let pos = new Map(keypad.map((row, y) => row.map((c, x) => [String(c), [y, x]])).flat());

function move([y0, x0], [y1, x1]) {
    if (y0 == y1 && x0 == x1) return [''];

    let result = [];

    let add = function (c, dy, dx) {
        let [y, x] = [y0 + dy, x0 + dx];
        if (0 <= y && y < keypad.length && 0 <= x && x < keypad[y].length && keypad[y][x] != null)
            move([y0 + dy, x0 + dx], [y1, x1]).forEach(rest => result.push(c + rest))
    }

    if (y0 < y1) add('v', 1, 0);
    if (y1 < y0) add('^', -1, 0);
    if (x0 < x1) add('>', 0, 1);
    if (x1 < x0) add('<', 0, -1);

    return result;

}

function abstract(start, code) {
    let rs = [''];
    let current = start;

    for (let next of code) {
        rs = rs.flatMap(prefix => move(pos.get(current), pos.get(next)).map(suffix => prefix + suffix + 'a'));
        rs = [...new Set(rs)];
        current = next;
    }

    return rs;
}

function complexity(code) {
    codes = [code];
    codes = codes.flatMap(code => abstract('A', code));
    //codes = codes.flatMap(code => abstract('a', code));
    //codes = codes.flatMap(code => abstract('a', code));

    let [min, max] = [Infinity, -Infinity];
    for (let code of codes) {
        if (code.length < min) min = code.length;
        if (max < code.length) max = code.length;
    }
    console.log(code, codes.length, min, max);
    console.log(codes);
    console.log();
    return min * code.replace(/[^\d]/, '');
}

let result = codes.reduce((sum, code) => sum + complexity(code), 0);
console.log(result);

/*

code len  min max
593A 12288 78 78
283A 1280 72 76
670A 512 68 72
459A 3072 74 74
279A 2048 76 80
167360 (TOO HIGH)

code len  min max
593A 4718592 74 80
283A 2867200 68 84
670A 2539520 68 90
459A 5767168 74 90
279A 2064384 72 84
162740 (CORRECT)

93831469524
86475783008
84248089344
90594397580
91387668328
Answer: 203640915832208

 */