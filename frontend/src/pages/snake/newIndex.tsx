import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

import { Navbar, NavButton, NavDropdown, NavGroup, NavLink, NavTitle } from "../../components/utility/navbar";
import Node from "../../components/snake/node";
import { ModalItem, ModalList } from "../../components/utility/modal";

import "../../styles/snake.css";

export default function Snake() {
    const [roomData, setRoomData] = useState(null);
    const currentDir = useRef("w");

    const usernameRef = useRef(null);

    useEffect(() => {
        if (roomData) {
            const socket = io(`http://${window.location.hostname}:5000`);
            socket.on(`snake-${roomData.id}-update`, data => {console.log(data); setRoomData(data)});

            window.addEventListener("keydown", updateDirection);
    
            return () => {
                window.removeEventListener("keydown", updateDirection);
            }
        }
    }, [roomData])

    async function updateDirection({ key }) {
        if (!roomData || roomData.State !== 1 || currentDir.current === key) return;
        let direction: string;

        switch (key) {
            case "w":
                direction = "up";
                break;
            case "s":
                direction = "down";
                break;
            case "a":
                direction = "left";
                break;
            case "d":
                direction = "right";
                break;
            default:
                direction = "";
        }

        currentDir.current = key;
        axios.post(`/api/snake/client/direction/${roomData.id}`, { direction,  username: usernameRef.current.value});
    }

    async function CreateRoom() {
        const id = await axios.post("/api/snake/room/create", {username: usernameRef.current.value});
        setRoomData(id.data);
    }

    async function JoinRoom() {

    }

    async function StartGame() {
        await axios.post(`/api/snake/room/start/${roomData.id}`);
    }

    return (
        <div className="mx_page">
            <Navbar zIndex={100}>
                <NavGroup>
                    <NavTitle>
                        <NavLink href="/">
                            Snake
                        </NavLink>
                    </NavTitle>
                </NavGroup>
                <NavGroup>
                    <label>Username</label>
                    <input ref={usernameRef} disabled={roomData !== null}/>
                </NavGroup>
                <NavGroup>
                    <NavButton onClick={CreateRoom}>Create Room</NavButton>
                    <NavButton onClick={StartGame}>Start</NavButton>
                </NavGroup>
            </Navbar>
            <div className="mx_snake">
                <div className="mx_snake_grid">
                {
                    roomData &&
                    roomData.Grid.map((row, index) => {
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