import { Route, Routes } from "react-router";

import Landing from "./pages/landing";
import Pathfinder from "./pages/pathfinder";
import Sorting from "./pages/sorting";
import Snake from "./pages/snake";
import Test from "./pages/snake/newIndex";

import "./styles/global.css";

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/pathfinder" element={<Pathfinder />} />
            <Route path="/sorting" element={<Sorting />} />
            <Route path="/snake" element={<Snake />} />
            <Route path="/test" element={<Test />}/>
        </Routes>
    )
}