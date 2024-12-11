import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

let input = fs.readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'input.txt')).toString();

let dataa = [...input.replace('\n', '')]
    .map((n, i) => i % 2 ? Array.from({ length: n }, () => '.') : Array.from({ length: n }, () => i / 2))
    .flat();

// Part 1
{
    let data = [...dataa];
    let [i, j] = [0, data.length - 1];

    while (i < j) {
        if (data[i] == '.') {
            data[i] = data[j];
            data[j] = '.';
            j--;
        }
        else i++;
    }

    let result = data.filter(n => n != '.').reduce((sum, n, i) => sum + n * i, 0);
    console.log(result);
}


// Part 2
{
    let data = [...dataa];
    let j = data.length - 1;

    while (0 < j) {
        let cj = 1;
        while (0 < j - cj && data[j] == data[j - cj]) cj++;

        let [i, ci] = [0, 0];
        while (i + ci <= j - cj && ci < cj) {
            if (data[i + ci] == '.') ci++;
            else { i = i + ci + 1; ci = 0; }
        }


        if (ci == cj) {
            for (let k = i; k < i + ci; k++) data[k] = data[j];
            for (let k = j; j - cj < k; k--) data[k] = '.';
        }

        j -= cj;
    }

    let result = data.reduce((sum, n, i) => n == '.' ? sum : sum + n * i, 0);
    console.log(result);
}