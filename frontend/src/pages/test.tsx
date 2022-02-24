import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

export default function Test(): JSX.Element {
    const [room, setRoom] = useState(null);
    const usernameRef = useRef(null);

    useEffect(() => {
        if (room) {
            const socket = io(`http://${window.location.hostname}:5000`);
            socket.on(`snake-${room}-update`, data => console.log(data))
        }
    }, [room]);

    async function CreateRoom() {
        const id = await axios.post("/api/snake/room/create", {username: usernameRef.current.value});
        setRoom(id.data);
    }

    async function StartGame() {
        const result = await axios.post(`/api/snake/room/start/${room}`);
        console.log(result.data);
    }

    return (
        <div>
            <button onClick={StartGame}>Start Game</button>
            <button onClick={CreateRoom}>Create Room</button>
            <input ref={usernameRef}/>
        </div>
    )
}