import { Route, Routes } from "react-router";
import Landing from "./pages/landing";

import "./styles/global.css";

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Landing />}>

            </Route>
        </Routes>
    )
}