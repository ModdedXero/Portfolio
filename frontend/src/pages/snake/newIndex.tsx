import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

import { Navbar, NavButton, NavDropdown, NavGroup, NavLink, NavTitle } from "../../components/utility/navbar";
import useKeyPress from "../../components/hooks/useKeyPress";
import Node from "../../components/snake/node";
import { ModalItem, ModalList } from "../../components/utility/modal";

import "../../styles/snake.css";

export default function Snake() {
    const [roomId, setRoomId] = useState("");
    const [roomData, setRoomData] = useState(null);

    useEffect(() => {
        if (roomId) {
            const socket = io(`http://${window.location.hostname}:5000`);
            socket.on(`snake-${roomId}-update`, data => setRoomData(data));
        }
    }, [roomId])

    // const wPress = useKeyPress("w", updateDirection);
    // const aPress = useKeyPress("a", updateDirection);
    // const sPress = useKeyPress("s", updateDirection);
    // const dPress = useKeyPress("d", updateDirection);

    // function updateDirection(dir: string) {
    //     setPlayerDir(() => {
    //         return dir;
    //     })
    // }

    async function CreateRoom() {
        const id = await axios.post("/api/snake/room/create", {username: "Mythidas"});
        setRoomId(id.data.id);
        setRoomData(id.data);
        console.log(id.data)
    }

    async function StartGame() {
        await axios.post(`/api/snake/room/start/${roomId}`);
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