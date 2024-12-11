import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

let input = fs.readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'input.txt')).toString();

let data = [...input.replace('\n', '')]
    .map((n, i) => i % 2 ? Array.from({ length: n }, () => '.') : Array.from({ length: n }, () => i / 2))
    .flat();

let [i, j] = [0, data.length - 1];
while (i < j) {
    if(data[i] == '.'){
        data[i] = data[j];
        data[j] = '.';
        j--;
    }
    else i++;
}

let result = data.filter(n => n != '.').reduce((sum, n, i) => sum + n * i, 0);
console.log(result);
