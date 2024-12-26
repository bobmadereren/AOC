
let length = 46;

/**
 * @param {number} a 
 * @returns {number[]}
 */
function toBinary(a) {
    let result = a.toString(2).split('').map(Number).reverse();
    while (result.length <= length)
        result.push(0);
    return result;
}

/**
 * 
 * @param {number[]} a 
 * @returns {number}
 */
function toNumber(a) {
    return parseInt(a.reverse().join(''), 2);
}

/*
    x[i]
    y[i]
    
    main[i] = x[i] XOR y[i]
    both[i] = x[i] AND y[i]
    comb[i] = rest[i - 1] AND main[i]
    rest[i] = comb[i] OR both[i]

    z[i] = rest[i] XOR main[i]
 */

/**
 * 
 * @param {number[]} x
 * @param {number[]} y 
 * @returns {number[]}
 */
function addition(x, y) {
    let z = [];
    let main = [];
    let both = [];
    let rest = [];
    let comb = [];

    z[0] = x[0] ^ y[0];
    rest[0] = x[0] && y[0];

    for (let i = 1; i <= length; i++) {
        main[i] = x[i] ^ y[i];
        both[i] = x[i] && y[i];
        comb[i] = rest[i - 1] && main[i];

        z[i] = rest[i - 1] ^ main[i];
        rest[i] = comb[i] || both[i];
    }

    return z;
}

/**
 * 
 * @param {number[]} x
 * @param {number[]} y 
 * @returns {string}
 */
function expr(x, y) {
    let z = [];
    let r = [];

    z[0] = "(x00 XOR y00)";
    r[0] = "(x00 AND y00)";

    for (let i = 1; i <= length; i++) {
        let ii = i.toString().padStart(2, 0);
        z[i] = `(${r[i - 1]} XOR (x${ii} XOR y${ii}))`;
        r[i] = `((${r[i - 1]} AND (x${ii} XOR y${ii})) OR (x${ii} AND y${ii}))`;
    }

    return z;
}


let x = Math.floor(Math.random() * 100_000_000);
let y = Math.floor(Math.random() * 100_000_000);

console.log(x, y, x + y, toNumber(addition(toBinary(x), toBinary(y))));

//console.log(expr(toBinary(5), toBinary(7)).pop());