const router = require("express").Router();
const Socket = require("../server").Socket;
const uuid = require("uuid").v4;

const CreateRoom = require("../lib/snake_room").CreateRoom;
const JoinRoom = require("../lib/snake_room").JoinRoom;
const StartGame = require("../lib/snake_room").StartGame;

router.route("/room/create").post(async (req, res) => {
    const { username } = req.body;

    const id = await CreateRoom(username);
    res.status(200).send(id);
});

router.route("/room/join/:id").post((req, res) => {
    const { username } = req.body;

    const result = JoinRoom(username, req.params.id);

    if (result) {
        Socket.emit(`snake-${req.params.id}-join`, `${username} has joined!`);
        res.status(200).send("Room joined");
    } else {
        res.status(204).send("Room is full or doesn't exist");
    }
});

router.route("/room/start/:id").post((req, res) => {
    const id = req.params.id;

    const result = StartGame(id);
    if (result) {
        res.status(200).send("Game started");
    } else {
        res.status(204).send("Game was not found");
    }
})

module.exports = router;