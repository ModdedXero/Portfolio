import { useEffect, useState } from "react";

export default function useKeyPress(targetKey: string, callback: (key: string) => void) {
    const [keyPressed, setKeyPressed] = useState(false);

    function downHandler({ key }) {
        if (key === targetKey) {
            setKeyPressed(true);
            callback(key);
        }
    }

    function upHandler({ key }) {
        if (key === targetKey) {
            setKeyPressed(false);
        }
    }

    useEffect(() => {
        window.addEventListener("keydown", downHandler);
        window.addEventListener("keyup", upHandler);

        return () => {
            window.removeEventListener("keydown", downHandler);
            window.removeEventListener("keyup", upHandler);
        }
    }, [])

    return keyPressed;
}