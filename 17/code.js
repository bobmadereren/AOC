let program = [2n, 4n, 1n, 5n, 7n, 5n, 4n, 5n, 0n, 3n, 1n, 6n, 5n, 5n, 3n, 0n];

function compute(A) {

    let [B, C] = [0n, 0n];

    let out = [];
    let i = 0n;

    let combo = (operand) => {
        switch (operand) {
            case 0n: case 1n: case 2n: case 3n: return operand;
            case 4n: return A;
            case 5n: return B;
            case 6n: return C;
        }
    }

    let execute = [
        operand => A = A >> combo(operand),
        operand => B = B ^ operand,
        operand => B = combo(operand) % 8n,
        operand => i = A == 0n ? i : operand - 2n,
        operand => B = B ^ C,
        operand => out.push(combo(operand) % 8n),
        operand => B = A >> combo(operand),
        operand => C = A >> combo(operand),
    ];

    while (i < program.length) {
        let [opcode, operand] = [program[i], program[i + 1n]];
        execute[opcode](operand);
        i += 2n;
    }
    
    return out;
}

let viruses = [0n];

let period = 3n;    // <--- number of bits reduced for the input at each recursive call of the program

while(viruses.length > 0) {
    let newViruses = [];
    for (let aLeft of viruses) {
        for (let aRight of Array.from({length: Number(1n << period)}, (_, i) => BigInt(i))) {
            let A = (aLeft << period) + aRight;
            let out = compute(A);
            if (program.join().match(out.join() + '$'))
                newViruses.push(A);
        }
    }
    viruses = newViruses;
    let [virus] = viruses;
    if(compute(virus).length == program.length) break;
}

console.log(viruses[0]);