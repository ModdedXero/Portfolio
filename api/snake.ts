import { Router } from "express";
const uuid = require("uuid").v4;
const Socket = require("../server").Socket;

Router.route("/room/create").post((req, res) => {
    Socket.emit
});

Router.route("/room/join/:id").post((req, res) => {
    const { username } = req.body;

    Socket.emit(`snake-${req.params.id}`, `${username} has joined!`);
});

export default Router;