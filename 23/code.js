import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

let input = fs.readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'input.txt')).toString();

let data = input.matchAll(/([a-z]{2})\-([a-z]{2})/g);

/**
 * @typedef {{name: string, neighbors: GraphNode[]}} GraphNode
 * @type {Map<string, GraphNode>}
 */
let nodeMap = new Map();

for (let [_, sourceName, targetName] of data) {
    if (!nodeMap.has(sourceName)) nodeMap.set(sourceName, { name: sourceName, neighbors: [] });
    if (!nodeMap.has(targetName)) nodeMap.set(targetName, { name: targetName, neighbors: [] });

    let sourceNode = nodeMap.get(sourceName);
    let targetNode = nodeMap.get(targetName);

    sourceNode.neighbors.push(targetNode);
    targetNode.neighbors.push(sourceNode);
}

/*
    --- Algorithm ---
    Recursively construct a tree that contains every clique up to a certain size exactly once
    as an upward path starting at a leaf.

    Each leaf will keep track of the neighbors of the corresponding clique
    for easy extension to the cliques 1 greater in size.

    Note that if a clique (C) has a neighbor (v)
    then the neighbors of the clique (C + v) is the intersection of
    the neighbors of (C) with the neighbors of (v).

    We keep neighbor lists sorted for linear time intersection.

    To prevent duplicate cliques, we only extend a path monotonically.

    We initialize the tree with a dummy root whose clique-neighbors is every node.
*/

/**
 * @type {GraphNode[]}
 */
let graphNodes = [];
for (let [_, node] of nodeMap) {
    node.neighbors.sort((node1, node2) => (node1.name > node2.name) - (node1.name < node2.name));
    graphNodes.push(node);
}
graphNodes.sort((node1, node2) => (node1.name > node2.name) - (node1.name < node2.name));

/**
 * By sorted set we mean an array with no duplicates sorted in ascending order.
 * @param {GraphNode[]} A a sorted set.
 * @param {GraphNode[]} B a sorted set.
 * @returns {GraphNode[]} Intersection of A and B as a sorted set.
 */
function intersection(A, B) {
    let result = [];

    let [i, j] = [0, 0];
    while (i < A.length && j < B.length) {
        if (A[i] == B[j]) result.push(A[i++]);
        else if (A[i].name < B[j].name) i++;
        else if (A[i].name > B[j].name) j++;
    }

    return result;
}

/**
 * @typedef {{name: string, parent: TreeNode, cliqueContainsT: boolean, cliqueNeighbors: GraphNode[]}} TreeNode
 * 
 * @param {number} size Clique size.
 * @returns {TreeNode[]} Leaves of a clique tree.
 */
function cliques(size) {
    if (size == 0) return [{ name: '', parent: null, cliqueContainsT: false, cliqueNeighbors: graphNodes }];

    let leaves = [];

    for (let oldLeaf of cliques(size - 1)) {
        for (let cliqueNeighbor of oldLeaf.cliqueNeighbors) {
            if (oldLeaf.name < cliqueNeighbor.name) {

                let newLeaf = {
                    name: cliqueNeighbor.name,
                    parent: oldLeaf,
                    cliqueContainsT: oldLeaf.cliqueContainsT || cliqueNeighbor.name[0] == 't',
                    cliqueNeighbors: intersection(oldLeaf.cliqueNeighbors, cliqueNeighbor.neighbors)
                };

                leaves.push(newLeaf);

            }
        }
    }

    return leaves;
}

console.log(cliques(3).filter(leaf => leaf.cliqueContainsT).length);

