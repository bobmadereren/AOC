import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

let input = fs.readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'input.txt')).toString();

let width = 101;
let height = 103;

let data = [...input.matchAll(/p=(\d+),(\d+) v=(-?\d+),(-?\d+)/g)]
    .map(robot => robot.slice(1, 5).map(Number));

// Part 1
{
    let time = 100;
    let quandrants = [0, 0, 0, 0];

    for (let [x, y, dx, dy] of data) {
        let endX = ((x + dx * time) % width + width) % width;
        let endY = ((y + dy * time) % height + height) % height;

        let qX = Math.sign(endX - (width - 1) / 2);
        let qY = Math.sign(endY - (height - 1) / 2);

        if (qX == 0 || qY == 0) continue;

        quandrants[(qX + 1) / 2 + qY + 1]++;
    }

    let result = quandrants.reduce((product, n) => product * n, 1);
    console.log(result);
}

/**
 * Failed attempt at Part 2
 * Assumptions:
 * The christmas tree consists of a triangle and stem
 * Can have any size and position
 * Completely filled
 * No robot lies outside of the christmas tree
 * 
 *           x0
 *           |
 * .....................
 * ..........#.......... - y0
 * .........###.........
 * ........#####........
 * .......#######.......
 * ......#########......
 * .....###########.....
 * ....#############....
 * ...###############... - y1
 * ..........#..........
 * ..........#.......... - y2
 * .....................
 */
() => {
    let time = 0;
    let insideTriangle, spanningTriangle, insideStem, spanningStem;
    while (!insideTriangle || !spanningTriangle || !insideStem || !spanningStem) {
        time++;
        let robots = data.map(([x, y, dx, dy]) => [
            ((x + dx * time) % width + width) % width,
            ((y + dy * time) % height + height) % height,
        ]);

        let [x0, y0] = robots.reduce(([x0, y0], [x, y]) => y < y0 ? [x, y] : [x0, y0], [undefined, Infinity]);

        let y1 = robots.reduce((y1, [x, y]) => x != x0 && y > y1 ? y : y1, -Infinity);
        let y2 = robots.reduce((y2, [x, y]) => x == x0 && y > y2 ? y : y2, -Infinity);

        let top = robots.filter(([_, y]) => y <= y1);
        let bottom = robots.filter(([_, y]) => y > y1);

        insideTriangle = top.every(([x, y]) => Math.abs(x - x0) <= y - y0);
        spanningTriangle = (new Set(top.map(([x, y]) => x + width * y))).size == (y1 - y0 + 1) * (y1 - y0 + 1);

        insideStem = bottom.every(([x]) => x == x0);
        spanningStem = (new Set(bottom.map(([_, y]) => y))).size == y2 - y1;
    }

    console.log(time - 1);
}

/**
 * Successful attempt at Part 2
 * Step 1: I visualize the positions at every time step and looked for anything resembling a christmas tree
 * Step 2: I noticed at time=7 that the robots clustered along a vertical line
 * Step 3: I noticed this happening at time=7, 108, 209, 310, 411 and 512 as well, note the period of dt=101=width
 * Step 4: I visualized the positions at every such time point and saw the christmas tree
 */
 
{
    function print(time = 0) {
        let arr = Array.from({ length: height }, () => Array.from({ length: width }, () => 0));

        for (let [x, y, dx, dy] of data)
            arr[((y + dy * time) % height + height) % height][((x + dx * time) % width + width) % width]++;

        let str = arr.map(row => row.map(c => c == 0 ? '.' : c).join('')).join('\n')

        console.log("Time: " + time);
        console.log(str);
    }

    let interresting = [7, 108, 156, 209, 310, 411, 512];

    let time = 7//interresting[interresting.length - 1];
    setInterval(() => print(time += 101), 250);

}