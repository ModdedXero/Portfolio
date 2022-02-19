import { Children, useEffect, useState } from "react";

import { Navbar, NavButton, NavDropdown, NavGroup, NavLink, NavTitle } from "../../components/utility/navbar";
import useKeyPress from "../../components/hooks/useKeyPress";
import Node from "../../components/snake/node";

import "../../styles/snake.css";

export default function Snake() {
    const [playerPos, setPlayerPos] = useState({ row: 14, col: 10 });
    const [playerDir, setPlayerDir] = useState("s");
    const [playerChildren, setPlayerChildren] = useState([{ row: 14, col: 10 }]);

    const [gameState, setGameState] = useState(1);
    const [foodPos, setFoodPos] = useState({ row: 3, col: 10 });
    const [grid, setGrid] = useState(getInitialGrid(playerPos, foodPos));

    const [update, setUpdate] = useState(null);

    const wPress = useKeyPress("w", updateDirection);
    const aPress = useKeyPress("a", updateDirection);
    const sPress = useKeyPress("s", updateDirection);
    const dPress = useKeyPress("d", updateDirection);

    useEffect(() => {
        setUpdate(setInterval(() => { onUpdate(); }, 250));
        return () => clearInterval(update);
    }, [])

    function GameOver() {
        setUpdate(() => { return null; });
        setGameState(() => { return 0; });
        console.log("Game Over");
    }

    function onUpdate() {
        setGameState(previous => {
            if (previous !== 1) return previous;

            movePlayer();
            moveChildren();

            return previous;
        })
    }

    function movePlayer() {
        setPlayerPos(previous => {
            const playerPos = {...previous};

            grid[previous.row][previous.col] = 0;

            setPlayerDir(dir => {
                if (dir === "w") {
                    if (grid[previous.row - 1] === undefined) {
                        grid[grid.length - 1][previous.col] = 2;
                        playerPos.row = grid.length - 1;
                    } else {
                        grid[previous.row - 1][previous.col] = 2;
                        playerPos.row = previous.row - 1;
                    }
                } else if (dir === "a") {
                    if (grid[previous.col - 1] === undefined) {
                        grid[previous.row][grid[previous.row].length - 1] = 2;
                        playerPos.col = grid[previous.row].length - 1;
                    } else {
                        grid[previous.row][previous.col - 1] = 2;
                        playerPos.col = previous.col - 1;
                    }
                } else if (dir === "s") {
                    if (grid[previous.row + 1] === undefined) {
                        grid[0][previous.col] = 2;
                        playerPos.row = 0;
                    } else {
                        grid[previous.row + 1][previous.col] = 2;
                        playerPos.row = previous.row + 1;
                    }
                } else if (dir === "d") {
                    if (grid[previous.col + 1] === undefined) {
                        grid[previous.row][0] = 2;
                        playerPos.col = 0;
                    } else {
                        grid[previous.row][previous.col + 1] = 2;
                        playerPos.col = previous.col + 1;
                    }
                }

                return dir;
            })

            checkFood(playerPos);
            
            return playerPos;
        })
    }

    function moveChildren() {
        setPlayerPos(player => {
            setPlayerChildren(children => {
                if (children.length <= 0) return children;

                const newChildren = JSON.parse(JSON.stringify(children));
                grid[children.at(-1).row][children.at(-1).col] = 0;
                
                for (let i = newChildren.length - 1; i >= 0; i--) {
                    if (i === 0) {
                        newChildren[i].row = player.row;
                        newChildren[i].col = player.col;
                        grid[newChildren[i].row][newChildren[i].col] = 2;
                        break;
                    }
                    
                    newChildren[i].row = newChildren[i - 1].row;
                    newChildren[i].col = newChildren[i - 1].col;
                    grid[newChildren[i].row][newChildren[i].col] = 2;

                    if (newChildren[i].row === player.row &&
                        newChildren[i].col === player.col &&
                        i !== newChildren.length - 1) {
                            GameOver();
                            break;
                    }
                }
                
                return newChildren;
            })
            return player;
        })
    }

    function checkFood(player: {row: number, col: number}) {
        setFoodPos(food => {
            const newFood = {...food};
            
            if (player.row === food.row && player.col === food.col) {
                const row = Math.floor(Math.random() * 20);
                const col = Math.floor(Math.random() * 20);

                newFood.row = row;
                newFood.col = col;

                setPlayerChildren(children => {
                    children.push(player);
                    return children;
                })
            }

            for (let row = 0; row < grid.length; row++) {
                for (let col = 0; col < grid[row].length; col++) {
                    if (grid[row][col] === 1) {
                        if (row !== newFood.row) {
                            grid[row][col] = 0;
                        }
                        if (col !== newFood.col) {
                            grid[row][col] = 0;
                        }
                    }
                }
            }

            grid[newFood.row][newFood.col] = 1;

            return newFood;
        })
    }

    function updateDirection(dir: string) {
        setPlayerDir(() => {
            return dir;
        })
    }

    return (
        <div className="mx_page">
            <Navbar zIndex={100}>
                <NavGroup>
                    <NavTitle>
                        <NavLink href="/">
                            Sorting
                        </NavLink>
                    </NavTitle>
                </NavGroup>
                <NavGroup>

                </NavGroup>
            </Navbar>
            <div className="mx_snake">
                <div className="mx_snake_grid">
                {
                    grid.map((row, index) => {
                        return row.map((node, index1) => {
                            return <Node
                                key={`${index} ${index1}`}
                                state={node}
                            />
                        })
                    })
                }
                </div>
            </div>
        </div>
    )
}

function getInitialGrid(
    playerPos: {row: number, col: number}, 
    foodPos: {row: number, col: number}
): number[][] {
    const grid = [];

    for (let row = 0; row < 20; row++) {
        const rowArray = [];
        for (let col = 0; col < 20; col++) {
            if (playerPos.row === row && playerPos.col === col) {
                rowArray.push(2);
            } else if (foodPos.row === row && foodPos.col === col) {
                rowArray.push(1);
            } else {
                rowArray.push(0);
            }
        }
        grid.push(rowArray);
    }

    return grid;
}