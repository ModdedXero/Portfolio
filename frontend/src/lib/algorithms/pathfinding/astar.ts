import NodeVar from "./nodevar";

export default function AStar(grid: NodeVar[][], start: NodeVar, final: NodeVar): NodeVar[] {
    // Create open and closed, put starting position in open
    let open: NodeVar[] = [{...start}];
    let closed: NodeVar[] = [];

    while (open.length > 0) {
        // Checked for current with lowest f
        let current: NodeVar = undefined;
        for (const node of open) {
            if (!current || current.f > node.f) current = node;
        }

        // Remove current from open and add to closed
        open = removeFromOpen(current, open);
        closed.push(current);

        // Return open list if goal is found
        if (isEqualNode(current, final)) {
            open.push(current);
            return [...closed, ...open];
        }

        current.children.length = 0;
        // Loop through potential children
        for (const [row, col] of [[0, -1], [0, 1], [-1, 0], [1, 0], [-1, -1], [-1, 1], [1, -1], [1, 1]]) {
            const newNode = { row: current.row + row, col: current.col + col };

            // Check if node is valid coordinates
            if (newNode.row > grid.length - 1 || newNode.row < 0 
                || newNode.col > grid[0].length - 1 || newNode.col < 0) continue;

            // Assign node parent and push to children
            const child: NodeVar = {...grid[newNode.row][newNode.col]};
            current.children.push(child);
        }

        // Loop through valid children
        for (const child of current.children) {
            // Check if child is already closed
            if (isNodeInList(child, closed) || child.isWall) {
                continue;
            }
            
            // Assign weights for each node
            const gScore = current.g + 1;
            let gScoreIsBest = false;

            if (!isNodeInList(child, open)) {
                gScoreIsBest = true;
                child.h = Math.abs(child.row - final.row) + Math.abs(child.col - final.col);
                open.push(child);
            } else if (gScore < child.g) {
                gScoreIsBest = true;
            }

            if (gScoreIsBest) {
                const weight = child.isWeight ? 1.5 : 1;
                child.parent = current;
                child.g = gScore;
                child.f = child.g + weight * child.h;
            }
        }
    }

    // If no path was found return null
    return null;
}

function isNodeInList(node: NodeVar, list: NodeVar[]) {
    for (const lNode of list) {
        if (isEqualNode(node, lNode)) return true;
    }

    return false;
}

// Loops through list and removes node
function removeFromOpen(node: NodeVar, open: NodeVar[]) {
    const list = [...open]
    for (let i = 0; i < list.length; i++) {
        if (list[i].row === node.row && list[i].col === node.col) {
            list.splice(i, 1);
            break;
        }
    }
    return list;
}

// Compare two node coorinates
function isEqualNode(a: NodeVar, b: NodeVar) {
    return (a.col === b.col) && (a.row === b.row);
}