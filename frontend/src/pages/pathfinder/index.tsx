import { useState } from "react";

import { Navbar, NavButton, NavDropdown, NavGroup, NavLink, NavTitle } from "../../components/utility/navbar";
import AStar from "../../lib/algorithms/pathfinding/astar";
import Node from "../../components/pathfinder/node";
import NodeVar from "../../lib/algorithms/pathfinding/nodevar";
import "../../styles/pathfinder.css";

const GRID_WIDTH = 40;
const GRID_HEIGHT = 15;
const NODE_SIZE = 30;

export default function Pathfinder(): JSX.Element {
    const [startNode, setStartNode] = useState({ row: 7, col: 10 });
    const [finalNode, setFinalNode] = useState({ row: 7, col: 30 });
    const [grid, setGrid] = useState(getIntialGrid(GRID_WIDTH, startNode, finalNode, GRID_HEIGHT, NODE_SIZE));
    const [algorithm, setAlgorithm] = useState("AStar");

    const [isMousePressed, setIsMousePressed] = useState(false);
    const [selectedMarker, setSelectedMarker] = useState("none");

    function onMouseDown(row: number, col: number) {
        setIsMousePressed(true);
        setGrid(toggleNodeState(grid, {row, col}, selectedMarker));
    }

    function onMouseUp() {
        setIsMousePressed(false);
    }

    function onMouseEnter(row: number, col: number) {
        if (!isMousePressed) return;
        setGrid(toggleNodeState(grid, {row, col}, selectedMarker));
    }

    function toggleMarker(marker: string) {
        if (selectedMarker === marker) {
            setSelectedMarker("none");
        } else {
            setSelectedMarker(marker);
        }
    }

    function visualizeAlgorithm() {
        clearGrid();
        let pathfinder: NodeVar[];

        if (algorithm === "AStar") {
            pathfinder = AStar(grid, getStartNode(grid), getFinalNode(grid));
        }
        
        const closestPath = getPathFromNode(pathfinder.at(-1));
        animateVisitedNodes(pathfinder, closestPath);
    }

    function getPathFromNode(node: NodeVar) {
        let current = node;
        const path: NodeVar[] = [];
    
        while (current) {
            path.push(current);
            current = current.parent;
        }
    
        return path.reverse();
    }

    function animateVisitedNodes(visitedNodes: NodeVar[], shortestPath: NodeVar[]) {
        for (let i = 0; i <= visitedNodes.length; i++) {
            if (i === visitedNodes.length) {
                setTimeout(() => {
                    animateShortestPath(shortestPath);
                }, 10 * i);
                return;
            }
            const node = { row: visitedNodes[i].row, col: visitedNodes[i].col };
            if (isEqualNode(getStartNode(grid), node) || isEqualNode(getFinalNode(grid), node) || grid[node.row][node.col].isWeight) continue;
            setTimeout(() => {
                document.getElementById(`node-${node.row}-${node.col}`).className = "mx_node" + " " + "mx_node_visited";
            }, 10 * i);
        }
    }

    function animateShortestPath(shortestPath: NodeVar[]) {
        for (let i = 0; i < shortestPath.length; i++) {
            const node = { row: shortestPath[i].row, col: shortestPath[i].col };
            if (isEqualNode(getStartNode(grid), node) || isEqualNode(getFinalNode(grid), node) || grid[node.row][node.col].isWeight) continue;
            setTimeout(() => {
                document.getElementById(`node-${node.row}-${node.col}`).className = "mx_node" + " " + "mx_node_closest";
            }, 50 * i);
        }
    }

    function isEqualNode(a: {row: number, col:number}, b: {row: number, col: number}) {
        return (a.col === b.col) && (a.row === b.row);
    }

    function clearGrid() {
        const gridCopy = [...grid];

        for (let row = 0; row < gridCopy.length; row++) {
            for (let col = 0; col < gridCopy[0].length; col++) {
                if (!gridCopy[row][col].isStart && !gridCopy[row][col].isFinal
                    && !gridCopy[row][col].isWall && !gridCopy[row][col].isWeight) {
                    gridCopy[row][col].isVisited = false;
                    document.getElementById(`node-${row}-${col}`).className = "mx_node";
                }
            }
        }

        setGrid(gridCopy);
    }

    function resetGrid() {
        clearGrid();
        setGrid(getIntialGrid(GRID_WIDTH, startNode, finalNode, GRID_HEIGHT, NODE_SIZE));
    }

    return (
        <div 
            className="mx_page"
            onMouseUp={_ => onMouseUp()}
            onMouseDown={e => e.preventDefault()}
        >
            <Navbar zIndex={100}>
                <NavGroup>
                    <NavTitle>
                        <NavLink href="/">
                            Pathfinder
                        </NavLink>
                    </NavTitle>
                </NavGroup>
                <NavGroup align>
                    <NavLink onClick={_ => clearGrid()}>
                        Clear Grid
                    </NavLink>
                    <NavLink onClick={_ => resetGrid()}>
                        Reset Grid
                    </NavLink>
                    <NavDropdown label="Grid Templates">
                        <button onClick={_ => { resetGrid(); setGrid(getMazeGrid(GRID_WIDTH, GRID_HEIGHT, NODE_SIZE)); }}>Maze</button>
                    </NavDropdown>
                    <NavButton onClick={visualizeAlgorithm}>
                        Visualize {algorithm}
                    </NavButton>
                </NavGroup>
            </Navbar>
            <div className="mx_grid_tools">
                <div>
                    <p>
                        Choose a node type and 
                        <em> click and drag </em> 
                        to place on the grid.
                    </p>
                    <div>
                        <div>
                            <div 
                                onClick={_ => toggleMarker("start")}
                                className={`mx_node mx_node_start ${selectedMarker === "start" ? "mx_node_glow_start" : null}`}
                                style={{
                                    width: `${NODE_SIZE}px`,
                                    height: `${NODE_SIZE}px`,
                                }}
                            ></div>
                            <strong>Start</strong>
                        </div>
                        <div>
                            <div 
                                onClick={_ => toggleMarker("final")}
                                className={`mx_node mx_node_final ${selectedMarker === "final" ? "mx_node_glow_final" : null}`}
                                style={{
                                    width: `${NODE_SIZE}px`,
                                    height: `${NODE_SIZE}px`,
                                }}
                            ></div>
                            <strong>Final</strong>
                        </div>
                        <div>
                            <div 
                                onClick={_ => toggleMarker("wall")}
                                className={`mx_node mx_node_wall ${selectedMarker === "wall" ? "mx_node_glow_wall" : null}`}
                                style={{
                                    width: `${NODE_SIZE}px`,
                                    height: `${NODE_SIZE}px`,
                                }}
                            ></div>
                            <strong>Wall</strong>
                        </div>
                        <div>
                            <div 
                                onClick={_ => toggleMarker("weight")}
                                className={`mx_node mx_node_weight ${selectedMarker === "weight" ? "mx_node_glow_weight" : null}`}
                                style={{
                                    width: `${NODE_SIZE}px`,
                                    height: `${NODE_SIZE}px`,
                                }}
                            ></div>
                            <strong>Weight</strong>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mx_grid">
                {grid.map((row: NodeVar[], index: number) => {
                    return (
                        <div className="mx_grid_row" key={index}>
                        {
                            row.map((node: NodeVar, nodeIndex: number) => {
                                let state: number;
                                if (node.isStart)
                                    state = 1;
                                else if (node.isFinal)
                                    state = 2;
                                else if (node.isWall)
                                    state = 3;
                                else if (node.isWeight)
                                    state = 4;
                                else state = 0;

                                return (
                                    <Node
                                        key={nodeIndex}
                                        row={node.row}
                                        col={node.col}
                                        size={node.size}
                                        state={state}
                                        f={node.f}
                                        h={node.h}
                                        g={node.g}
                                        onMouseDown={onMouseDown}
                                        onMouseUp={onMouseUp}
                                        onMouseEnter={onMouseEnter}
                                    />
                                )
                            })
                        }
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

function toggleNodeState(grid: NodeVar[][], node: {row: number, col: number}, state: string): NodeVar[][] {
    const gridCopy = [...grid];

    if (state === "start") {
        if (gridCopy[node.row][node.col].isStart) return gridCopy;
        const currentState = gridCopy[node.row][node.col].isStart;

        for (let i = 0; i < gridCopy.length; i++) {
            for (let j = 0; j < gridCopy[0].length; j++) {
                gridCopy[i][j].isStart = false;
            }
        }

        gridCopy[node.row][node.col].isStart = !currentState;
    } else if (state === "final") {
        if (gridCopy[node.row][node.col].isFinal) return gridCopy;
        const currentState = gridCopy[node.row][node.col].isFinal;

        for (let i = 0; i < gridCopy.length; i++) {
            for (let j = 0; j < gridCopy[0].length; j++) {
                gridCopy[i][j].isFinal = false;
            }
        }

        gridCopy[node.row][node.col].isFinal = !currentState;
    } else if (state === "wall") {
        gridCopy[node.row][node.col].isWall = !gridCopy[node.row][node.col].isWall;
    } else if (state === "weight") {
        gridCopy[node.row][node.col].isWeight = !gridCopy[node.row][node.col].isWeight;
    }

    return gridCopy;
}

function getStartNode(grid: NodeVar[][]): NodeVar {
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
            if (grid[i][j].isStart) return grid[i][j];
        }
    }
    return null;
}

function getFinalNode(grid: NodeVar[][]): NodeVar {
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
            if (grid[i][j].isFinal) return grid[i][j];
        }
    }
    return null;
}

function getMazeGrid(width: number, height: number, size: number) {
    const nodes: NodeVar[][] = [];

    for (let row = 0; row < height; row++) {
        const currentRow: NodeVar[] = [];
        for (let col = 0; col < width; col++) {
            currentRow.push({
                row,
                col,
                size,
                isStart: mazeTemplate[row][col] === 1,
                isFinal: mazeTemplate[row][col] === 2,
                isVisited: false,
                isWall: mazeTemplate[row][col] === 3,
                isWeight: mazeTemplate[row][col] === 4,
                parent: null,
                children: [],
                f: 0,
                g: 0,
                h: 0
            });
        }
        nodes.push(currentRow);
    }

    return nodes;
}

const mazeTemplate: number[][] = [
    [1, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 3, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
    [0, 3, 0, 3, 3, 3, 0, 3, 0, 0, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 3, 0, 0, 3, 0, 3, 3, 3, 3, 3, 3, 0, 3, 3, 3, 3, 0, 3],
    [0, 3, 0, 0, 0, 3, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 3, 3, 3, 3, 3, 3, 0, 3, 0, 0, 0, 0, 0, 0, 3, 3, 3, 0, 0, 3, 0, 0],
    [0, 3, 0, 3, 0, 3, 0, 3, 0, 0, 3, 0, 3, 3, 3, 0, 3, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 3, 3, 3, 0, 0, 0, 3, 3, 0, 3, 3, 0],
    [0, 3, 0, 3, 0, 3, 0, 3, 0, 0, 3, 0, 0, 0, 3, 0, 3, 0, 3, 3, 3, 0, 3, 3, 3, 3, 3, 3, 3, 0, 3, 3, 3, 0, 0, 3, 0, 0, 0, 0],
    [0, 0, 0, 3, 0, 3, 0, 3, 3, 3, 3, 3, 3, 0, 3, 0, 0, 0, 3, 0, 3, 0, 3, 0, 4, 0, 0, 3, 0, 0, 0, 0, 3, 3, 4, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 0, 3, 0, 0, 0, 4, 0, 0, 0, 0, 3, 0, 3, 3, 3, 0, 3, 0, 3, 0, 3, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 0, 3, 0, 0, 0, 3, 0, 0, 0, 3, 0, 3, 3, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0],
    [3, 0, 3, 0, 0, 0, 0, 3, 0, 0, 0, 0, 3, 3, 3, 0, 3, 0, 3, 0, 3, 0, 4, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0],
    [3, 0, 3, 0, 3, 0, 0, 3, 0, 3, 0, 0, 0, 0, 3, 3, 3, 0, 4, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 3, 4],
    [3, 0, 3, 0, 3, 0, 0, 3, 0, 3, 3, 3, 3, 0, 0, 0, 3, 0, 4, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0],
    [3, 0, 3, 0, 3, 3, 4, 3, 0, 3, 0, 0, 3, 3, 3, 0, 3, 3, 3, 3, 3, 3, 3, 0, 3, 3, 3, 3, 3, 3, 3, 0, 3, 3, 3, 3, 3, 3, 0, 3],
    [3, 0, 3, 0, 4, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 4, 0, 4, 0, 3, 0, 0],
    [3, 0, 0, 0, 3, 0, 3, 3, 3, 3, 0, 3, 3, 3, 3, 3, 3, 0, 3, 0, 3, 0, 3, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 4, 0, 3, 0, 3, 3, 0],
    [3, 3, 3, 0, 0, 0, 3, 0, 3, 0, 0, 0, 0, 0, 0, 0, 3, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 3, 0, 0, 0, 2],
]

function getIntialGrid(width: number, start: {row: number, col: number}, final: {row: number, col: number}, height: number, size: number): NodeVar[][] {
    const nodes: NodeVar[][] = [];

    for (let row = 0; row < height; row++) {
        const currentRow: NodeVar[] = [];
        for (let col = 0; col < width; col++) {
            currentRow.push({
                row,
                col,
                size,
                isStart: col === start.col && row === start.row,
                isFinal: col === final.col && row === final.row,
                isVisited: false,
                isWall: false,
                isWeight: false,
                parent: null,
                children: [],
                f: 0,
                g: 0,
                h: 0
            });
        }
        nodes.push(currentRow);
    }

    return nodes;
}