const { parentPort } = require('worker_threads');
class PuzzleNode {
    constructor(state, parent, move, depth, cost) {
        this.state = state;
        this.parent = parent;
        this.move = move;
        this.depth = depth;
        this.cost = cost;
    }

    getChildren() {
        const children = [];
        const emptyIndex = this.state.indexOf(0);
        const row = Math.floor(emptyIndex / 3);
        const col = emptyIndex % 3;

        if (col > 0) {
            const newState = this.state.slice();
            const targetIndex = emptyIndex - 1;
            [newState[emptyIndex], newState[targetIndex]] = [newState[targetIndex], newState[emptyIndex]];
            children.push(new PuzzleNode(newState, this, "left", this.depth + 1, this.cost + 1));
        }

        if (col < 2) {
            const newState = this.state.slice();
            const targetIndex = emptyIndex + 1;
            [newState[emptyIndex], newState[targetIndex]] = [newState[targetIndex], newState[emptyIndex]];

            children.push(new PuzzleNode(newState, this, "right", this.depth + 1, this.cost + 1));
        }

        if (row > 0) {
            const newState = this.state.slice();
            const targetIndex = emptyIndex - 3;
            [newState[emptyIndex], newState[targetIndex]] = [newState[targetIndex], newState[emptyIndex]];
            children.push(new PuzzleNode(newState, this, "up", this.depth + 1, this.cost + 1));
        }

        if (row < 2) {
            const newState = this.state.slice();
            const targetIndex = emptyIndex + 3;
            [newState[emptyIndex], newState[targetIndex]] = [newState[targetIndex], newState[emptyIndex]];
            children.push(new PuzzleNode(newState, this, "down", this.depth + 1, this.cost + 1));
        }

        return children;
    }

    getHeuristic(goal) {
        let h = 0;
        for (let i = 0; i < this.state.length; i++) {
            const value = this.state[i];
            if (value === 0) continue;
            const goalIndex = goal.indexOf(value);
            const dx = Math.abs(i % 3 - goalIndex % 3);
            const dy = Math.abs(Math.floor(i / 3) - Math.floor(goalIndex / 3));
            h += dx + dy;
        }
        return h;
    }

    getScore(goal) {
        return this.depth + this.getHeuristic(goal);
    }
}
function solvePuzzle(start, goal) {
    const startNode = new PuzzleNode(start, null, null, 0, 0);
    const goalNode = new PuzzleNode(goal, null, null, null, null);
    const startTime = Date.now();
    let nowTime;
    const queue = [startNode];
    const visited = new Set();
    visited.add(startNode.state.toString());
    while (queue.length > 0) {
        queue.sort((a, b) => a.getScore(goal) - b.getScore(goal));
        const node = queue.shift();
        if (node.state.toString() === goalNode.state.toString()) {
            nowTime = ((Date.now() - startTime) / 1000).toFixed(3)
            const path = [];
            let currNode = node;
            while (currNode.parent !== null) {
                path.push(currNode.move);
                currNode = currNode.parent;
            }
            path.reverse()
            return { path, nowTime };
        }
        const children = node.getChildren();
        for (const child of children) {
            if (!visited.has(child.state.toString())) {
                queue.push(child);
                visited.add(child.state.toString());
            }
        }
    }
    nowTime = ((Date.now() - startTime) / 1000).toFixed(3)
    return { path: null, nowTime: nowTime }; // no solution found
}
function solvePuzzleBFS(start, goal) {
    const startNode = new PuzzleNode(start, null, null, 0, 0);
    const goalNode = new PuzzleNode(goal, null, null, null, null);
    const startTime = Date.now();
    let nowTime;
    const queue = [startNode];
    const visited = new Set();
    visited.add(startNode.state.toString());
    while (queue.length > 0) {
        const node = queue.shift();
        if (node.state.toString() === goalNode.state.toString()) {
            nowTime = ((Date.now() - startTime) / 1000).toFixed(3)
            const path = [];
            let currNode = node;
            while (currNode.parent !== null) {
                path.push(currNode.move);
                currNode = currNode.parent;
            }
            path.reverse()
            return { path, nowTime };
        }
        const children = node.getChildren();
        for (const child of children) {
            if (!visited.has(child.state.toString())) {
                queue.push(child);
                visited.add(child.state.toString());
            }
        }
    }
    nowTime = ((Date.now() - startTime) / 1000).toFixed(3)
    return { path: null, nowTime: nowTime }; // no solution found
}
function solvePuzzleDFS(start, goal, depth) {
    const startNode = new PuzzleNode(start, null, null, 0, 0);
    const goalNode = new PuzzleNode(goal, null, null, null, null);
    const startTime = Date.now();
    let nowTime;
    const queue = [startNode];
    const visited = new Set();
    visited.add({ state: startNode.state.toString(), depth: startNode.depth });
    while (queue.length > 0) {
        const node = queue.pop();
        if (node.state.toString() === goalNode.state.toString()) {
            nowTime = ((Date.now() - startTime) / 1000).toFixed(3)
            const path = [];
            let currNode = node;
            while (currNode.parent !== null) {
                path.push(currNode.move);
                currNode = currNode.parent;
            }
            path.reverse()
            return { path, nowTime };
        }
        if (node.depth <= depth) {
            const children = node.getChildren();
            for (const child of children) {
                let isvisite = false
                visited.forEach((e) => {
                    if (e.state == child.state.toString() && e.depth <= child.depth) {
                        isvisite = true
                    }
                })
                if (!isvisite) {
                    queue.push(child);
                    visited.add({ state: child.state.toString(), depth: child.depth });
                }
            }
        }

    }
    nowTime = ((Date.now() - startTime) / 1000).toFixed(3)
    return { path: null, nowTime: nowTime }; // no solution found
}

// Example usage:
parentPort.on("message", (data) => {
    let { start, goal, depth, algorithme } = data
    let res
    if (algorithme == "A") {
        res = solvePuzzle(start, goal)
        parentPort.postMessage(res)
    } else if (algorithme == "L") {
        res = solvePuzzleBFS(start, goal)
        parentPort.postMessage(res)
    } else if (algorithme == "P") {
        res = solvePuzzleDFS(start, goal, depth)
        parentPort.postMessage(res)
    }
})