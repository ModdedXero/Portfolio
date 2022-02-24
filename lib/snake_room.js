const Socket = require("../server").Socket;
const uuidv4 = require("uuid").v4;

const P1_START_POS = { row: 15, col: 5 };
const P2_START_POS = { row: 15, col: 15 };
const FOOD_START_POS = { row: 5, col: 10 };

const Rooms = [];

async function CreateRoom(username) {
    const id = uuidv4();

    const room = {
        id,
        Player1: { username, position: {...P1_START_POS}, direction: "up", children: [{...P1_START_POS}]},
        Player2: null,
        State: 0,
        FoodPos: {...FOOD_START_POS},
        Grid: getInitialGrid(),
        Interval: null,

        update: 0,
        createdAt: Date.now()
    };

    Rooms.push(room);
    return room;
}

function JoinRoom(username, id) {
    const room = getRoom(id);
    if (!room) return false;

    if (room.id === id) {
        if (room.Player2.username === null) {
            room.Player2.username = username;
            room.Player2.direction = "up";
            room.Player2.children = [{...P2_START_POS}];
            room.Player2.position = {...P2_START_POS};
            room.Grid[P2_START_POS.row][P2_START_POS.col] = 3;
            Socket.emit(`snake-${room.id}-update`, room);
            return true;
        }
    }

    return false;
}

function StartGame(id) {
    const room = getRoom(id);
    room.State = 1;
    room.Interval = setInterval(() => { UpdateLoop(id) }, 250);
    return room;
}

function StopGame(id) {
    const room = getRoom(id);
    room.State = 0;
    clearInterval(room.Interval);
    return room;
}

function UpdateLoop(id) {
    const room = getRoom(id);
    if (room.State !== 1) return;

    room.update++;
    movePlayer(room, {...room.Player1.position}, room.Player1);
    if (room.Player2) movePlayer(room, {...room.Player2.position}, room.Player2);

    checkFood(room, {...room.Player1});
    if (room.Player2) checkFood(room, {...room.Player2});

    moveChildren(room, room.Player1);
    if (room.Player2) moveChildren(room, room.Player2);

    Socket.emit(`snake-${room.id}-update`, room);
}

function movePlayer(room, previous, player) {
    room.Grid[previous.row][previous.col] = 0;

    if (player.direction === "up") {
        if (room.Grid[previous.row - 1] === undefined) {
            room.Grid[room.Grid.length - 1][previous.col] = 2;
            player.position.row = room.Grid.length - 1;
        } else {
            room.Grid[previous.row - 1][previous.col] = 2;
            player.position.row = previous.row - 1;
        }
    } else if (dir === "left") {
        if (room.Grid[previous.col - 1] === undefined) {
            room.Grid[previous.row][room.Grid[previous.row].length - 1] = 2;
            player.position.col = room.Grid[previous.row].length - 1;
        } else {
            room.Grid[previous.row][previous.col - 1] = 2;
            player.position.col = previous.col - 1;
        }
    } else if (dir === "down") {
        if (room.Grid[previous.row + 1] === undefined) {
            room.Grid[0][previous.col] = 2;
            player.position.row = 0;
        } else {
            room.Grid[previous.row + 1][previous.col] = 2;
            player.position.row = previous.row + 1;
        }
    } else if (dir === "right") {
        if (room.Grid[previous.col + 1] === undefined) {
            room.Grid[previous.row][0] = 2;
            player.position.col = 0;
        } else {
            room.Grid[previous.row][previous.col + 1] = 2;
            player.position.col = previous.col + 1;
        }
    }
}

function checkFood(room, player) {
    if (player.position.row === room.FoodPos.row && player.position.col === room.FoodPos.col) {
        const row = Math.floor(Math.random() * 20);
        const col = Math.floor(Math.random() * 20);

        room.Grid[room.FoodPos.row][room.FoodPos.col] = 0;
        room.Grid[row][col] = 1;

        room.FoodPos.row = row;
        room.FoodPos.col = col;

        player.children.push(player.position);
    }
}

function moveChildren(room, player) {
    if (player.children.length <= 0) return;

    room.Grid[player.children.at(-1).row][player.children.at(-1).col] = 0;

    for (let i = player.children.length - 1; i >= 0; i--) {
        if (i === 0) {
            player.children[i].row = player.position.row;
            player.children[i].col = player.position.col;
            room.Grid[player.children[i].row][player.children[i].col] = 2;
            break;
        }
        
        player.children[i].row = player.children[i - 1].row;
        player.children[i].col = player.children[i - 1].col;
        room.Grid[player.children[i].row][player.children[i].col] = 2;

        if (player.children[i].row === player.position.row &&
            player.children[i].col === player.position.col &&
            i !== player.children.length - 1) {
                console.log("Game Over");
                break;
        }
    }
}

// Helper Functions

function getRoom(id) {
    for (let i = 0; i < Rooms.length; i++) {
        if (Rooms[i].id === id) return Rooms[i];
    }

    return null;
}

function getInitialGrid() {
    const grid = [];

    for (let row = 0; row < 20; row++) {
        const rowArray = [];
        for (let col = 0; col < 20; col++) {
            // Player 1 Start
            if (P1_START_POS.row === row && P1_START_POS.col === col) {
                rowArray.push(2);
            } else if (FOOD_START_POS.row === row && FOOD_START_POS.col === col) {
                rowArray.push(1);
            } else {
                rowArray.push(0);
            }
        }
        grid.push(rowArray);
    }

    return grid;
}

exports.CreateRoom = CreateRoom;
exports.JoinRoom = JoinRoom;
exports.StartGame = StartGame;
exports.StopGame = StopGame;