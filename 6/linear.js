import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

/*
    --- O(n) Algorithm ---

    We consider a digraph with nodes consisting of (position, direction) pairs,
        together with a node representing out-of-bounds,
        and edges representing steps.

    The graph can be considered a forest, with trees rooted in cycles.
        We compute a pre and post -order for each tree.
        For each cycle, we fix a first node and compute the induced order on the cycle.
        We also compute for each node:
            Which tree it belongs to.
            Its layer (distance to its root).
            Whether it lies on a cycle.
            Its entry point into the root (first ancestor in the root).

    Define dist(a, b) as the length of the simple path from a to b, or infinity if there is none.

    Observation: dist(a, b) < infinity iff all of the following holds:
            tree(a) = tree(b)
            layer(a) >= layer(b)
            pre(b) <= pre(a)
            post(a) <= post(b)
        In which case we also have:
            dist(a, b) = layer(a) - layer(b) + [cycleOrder(entry(b)) - cycleOrder(entry(a)) mod cycle]
    
    Observation: Let dist* be the distance after replacing an edge (u, v) with (u, w).
        If          dist(a, b) <= dist(a, u)    then    dist*(a, b) = dist(a, b).
        Else if     dist(w, u) <  dist(w, b)    then    dist*(a, b) = infinity.
        Else                                            dist*(a, b) = dist(a, u) + 1 + dist(w, b).
    
    Placing an obstacle corresponds to doing 4 edge replacements.
        To decide whether it will cause the guard to loop,
        we use preprocessing together with the observations above
        and check whether dist(start, out-of-bounds) is infinity.
*/

let startTime = Date.now();
let time = startTime;

// Read input
let input = fs.readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'input.txt')).toString();

console.log(`Read the input: ${- time + (time = Date.now())}ms`);


// Parse input
let grid = input.split(/\n/).filter(row => row).map(row => row.split(''));

console.log(`Parse the input: ${- time + (time = Date.now())}ms`);


// Find start position
let startX = 0;
let startY = 0;
let startD = 'up';

while (grid[startY][startX] != '^') {
    startX++;
    if (startX == grid.length) {
        startX = 0;
        startY++;
    }
}

console.log(`Find start position: ${- time + (time = Date.now())}ms`);


// Construct graph
let graph = grid.map((row, y) => row.map((symbol, x) => ({ up: { prev: [] }, down: { prev: [] }, left: { prev: [] }, right: { prev: [] } })));

let ob = { prev: [] };
ob.next = ob;

for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid.length; x++) {
        if (grid[y][x] == '#') continue;

        graph[y][x].up.next = y == 0 ? ob : grid[y - 1][x] == '#' ? graph[y][x].right : graph[y - 1][x].up;
        graph[y][x].down.next = y == grid.length - 1 ? ob : grid[y + 1][x] == '#' ? graph[y][x].left : graph[y + 1][x].down;
        graph[y][x].left.next = x == 0 ? ob : grid[y][x - 1] == '#' ? graph[y][x].up : graph[y][x - 1].left;
        graph[y][x].right.next = x == grid.length - 1 ? ob : grid[y][x + 1] == '#' ? graph[y][x].down : graph[y][x + 1].right;

    }
}

let nodes = [ob];

for (let y = 0; y < grid.length; y++)
    for (let x = 0; x < grid.length; x++)
        if (grid[y][x] != '#')
            for (let d of ['up', 'down', 'left', 'right'])
                nodes.push(graph[y][x][d]);

for (let node of nodes)
    node.next.prev.push(node);

console.log(`Construct graph: ${- time + (time = Date.now())}ms`);


// Compute tree, entry, cyc
let treeCount = 0;
let cycleLengths = [];

function walk(start) {
    let node = start;

    while (!node.marked) {
        node.marked = true;
        node = node.next;
    }
    let end = node;

    // Crash into existing tree
    if (end.tree) {
        node = start;
        while (node != end) {
            node.tree = end.tree;
            node.entry = end.entry;
            node = node.next;
        }
    }

    // Crash into self
    else {
        treeCount++;
        node = start;

        while (node != end) {
            node.tree = treeCount;
            node.entry = end;
            node = node.next;
        }

        let cyc = 0;

        do {
            node.cyc = ++cyc;
            node.tree = treeCount;
            node.entry = node;
            node = node.next;
        } while (node != end);

        cycleLengths[treeCount] = cyc;
    }

}

nodes.forEach(walk);

console.log(`Compute tree, entry, cyc: ${- time + (time = Date.now())}ms`);


// Compute pre, post, level
let stack = [];

for (let node of nodes)
    if (node.cyc) {
        node.pre = 0;
        node.post = Infinity;
        node.level = 0;
    }
    else if (node.next.cyc)
        stack.push(node);

let preCount = 0;
let postCount = 0;

while (stack.length > 0) {
    let node = stack.pop();
    if (node.pre)
        node.post = ++postCount;
    else {
        node.level = node.next.level + 1;
        node.pre = ++preCount;
        stack.push(node, ...node.prev);
    }
}

console.log(`Compute pre, post, level: ${- time + (time = Date.now())}ms`);


// Distance
function distance(a, b) {
    if (
        a.tree == b.tree &&
        a.level >= b.level &&
        a.pre >= b.pre &&
        a.post <= b.post
    )
        return a.level - b.level + (b.entry.cyc - a.entry.cyc + cycleLengths[a.tree]) % cycleLengths[a.tree];
    else
        return Infinity;
}

function replace(dist, u, w) {
    return (a, b) => {
        if (dist(a, u) == Infinity) return dist(a, b);
        if (dist(a, b) <= dist(a, u)) return dist(a, b);
        if (dist(w, u) <= dist(w, b)) return Infinity;
        return dist(a, u) + 1 + dist(w, b);
    }

}

// Count
let count = 0;

for (let y = 0; y < grid.length; y++)
    for (let x = 0; x < grid.length; x++)
        if (grid[y][x] == '.') {

            let dist = distance;

            if (0 <= y - 1 && grid[y - 1][x] != '#') dist = replace(dist, graph[y - 1][x].down, graph[y - 1][x].left);
            if (y + 1 < grid.length && grid[y + 1][x] != '#') dist = replace(dist, graph[y + 1][x].up, graph[y + 1][x].right);
            if (0 <= x - 1 && grid[y][x - 1] != '#') dist = replace(dist, graph[y][x - 1].right, graph[y][x - 1].down);
            if (x + 1 < grid.length && grid[y][x + 1] != '#') dist = replace(dist, graph[y][x + 1].left, graph[y][x + 1].up);

            count += dist(graph[startY][startX][startD], ob) == Infinity;
        }

console.log(`Count: ${count} in ${- time + (time = Date.now())}ms`);
console.log(`Total time: ${- startTime + (time = Date.now())}ms`);