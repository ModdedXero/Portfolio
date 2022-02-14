import { Route, Routes } from "react-router";

import Landing from "./pages/landing";
import Pathfinder from "./pages/pathfinder";
import Sorting from "./pages/sorting";

import "./styles/global.css";

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/pathfinder" element={<Pathfinder />} />
            <Route path="/sorting" element={<Sorting />} />
        </Routes>
    )
}