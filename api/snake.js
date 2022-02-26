
const router = require("express").Router();
const Socket = require("../server").Socket;
const uuid = require("uuid").v4;

const { CreateRoom, JoinRoom, StartGame, UpdateDirection } = require("../lib/snake_room");

router.route("/room/create").post(async (req, res) => {
    const { username } = req.body;

    const id = await CreateRoom(username);
    res.status(200).send(id);
});

router.route("/room/join/:id").post(async (req, res) => {
    const { username } = req.body;
    const id = req.params.id;

    const result = await JoinRoom(username, id);

    if (result) {
        Socket.emit(`snake-${id}-join`, `${username} has joined!`);
        res.status(200).send(result);
    } else {
        res.status(204).send("Room is full or doesn't exist");
    }
});

router.route("/room/start/:id").post(async (req, res) => {
    const id = req.params.id;

    const result = await StartGame(id);
    if (result) {
        res.status(200).send("Game started");
    } else {
        res.status(204).send("Game was not found");
    }
})

router.route("/client/direction/:id").post(async (req, res) => {
    const { direction, username } = req.body;
    const id = req.params.id;

    const result = await UpdateDirection(id, username, direction);
    if (result) {
        res.status(200).send("Direction updated");
    } else {
        res.status(204).send("Room or player not found");
    }
});

module.exports = router;