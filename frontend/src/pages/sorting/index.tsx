import { useEffect, useRef, useState } from "react";

import { Navbar, NavButton, NavDropdown, NavGroup, NavLink, NavTitle } from "../../components/utility/navbar";
import Slider from "../../components/utility/slider";

import BubbleSort from "../../lib/algorithms/sorting/bubble";
import MergeSort from "../../lib/algorithms/sorting/merge";

import "../../styles/sorting.css";

export default function Sorting(): JSX.Element {
    const [arraySize, setArraySize] = useState(150);
    const [animationSpeed, setAnimationSpeed] = useState(200);

    const [tableState, setTableState] = useState(getInitialValues(arraySize));
    const [sortingMethod, setSortingMethod] = useState("Bubble");
    const [disabled, setDisabled] = useState(false);
    const [sorted, setSorted] = useState(false);

    const indexRef = useRef([]);

    useEffect(() => {
        resetArray();
    }, [])

    function updateArraySize(e) {
        setArraySize(e.target.value);
        setTableState(getInitialValues(arraySize));
    }

    function resetArray() {
        setTableState(getInitialValues(arraySize));

        for (const index of indexRef.current) {
            if (!index) continue;
            index.className = "mx_chart_table_value";
        }

        setSorted(false);
    }

    function sortArray() {
        setDisabled(true);
        if (sorted) resetArray();
        
        if (sortingMethod === "Bubble") {
            visualizeBubbleSort();
        } else if (sortingMethod === "Merge") {
            visualizeMergeSort();
        }
    }

    function visualizeMergeSort() {
        MergeSort([...tableState], arraySize - 1, animateMergeSort);
    }

    function animateMergeSort(start: number, end: number, index: number[], delay: number) {
        if (start === -1) {
            setTimeout(() => {
                for (let i = 0; i < index.length; i++) {
                    if (!indexRef.current[i]) continue;

                    indexRef.current[i].className = "mx_chart_table_value_final";
                }

                setDisabled(false);
                setSorted(true);
            }, delay * animationSpeed)

            return;
        }

        setTimeout(async () => {
            for (let i = start; i <= end; i++) {
                if (!indexRef.current[i]) continue;

                indexRef.current[i].className = "mx_chart_table_value_current";
                indexRef.current[i].style.height = `calc(100% - (${index[i]}px * 4))`;
            }

            await new Promise((resolve) => setTimeout(resolve, animationSpeed * 0.75));

            for (let i = start; i <= end; i++) {
                if (!indexRef.current[i]) continue;

                indexRef.current[i].className = "mx_chart_table_value";
            }
        }, delay * animationSpeed);
    }

    function visualizeBubbleSort() {
        BubbleSort([...tableState], animateBubbleSort);
    }

    function animateBubbleSort(index1: number[], index2: number[], delay: number) {
        if (!index1 && !index2) {
            setTimeout(async () => {
                for (const index of indexRef.current) {
                    index.className = "mx_chart_table_value_final";
                }

                setDisabled(false);
                setSorted(true);
            }, delay * animationSpeed);

            return;
        }

        setTimeout(async () => {
            indexRef.current[index1[0]].className = "mx_chart_table_value_current";
            if (index2[0] < tableState.length) indexRef.current[index2[0]].className = "mx_chart_table_value_current";
            
            if (index2[1] !== undefined) indexRef.current[index1[0]].style.height = `calc(100% - (${index1[1]}px * 4))`;
            if (index2[1] !== undefined) indexRef.current[index2[0]].style.height = `calc(100% - (${index2[1]}px * 4))`;
            
            await new Promise((resolve) => setTimeout(resolve, animationSpeed * 0.75));

            indexRef.current[index1[0]].className = "mx_chart_table_value";
            if (index2[0] < tableState.length) indexRef.current[index2[0]].className = "mx_chart_table_value";
        }, delay * animationSpeed);
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
                    <NavDropdown label="Sorting Methods">
                        <button onClick={_ => setSortingMethod("Bubble")}>Bubble</button>
                        <button onClick={_ => setSortingMethod("Merge")}>Merge</button>
                    </NavDropdown>
                    <NavButton onClick={sortArray} disabled={disabled}>
                        Visualize {sortingMethod} Sort
                    </NavButton>
                    <NavLink onClick={resetArray} disabled={disabled}>
                        Reset Array
                    </NavLink>
                    <Slider label="Size" min="50" max="300" defaultValue="200" onChange={e => updateArraySize(e)} />
                    <Slider label="Speed" reverse min="50" max="300" defaultValue="200" onChange={e => setAnimationSpeed(e.target.value)} />
                </NavGroup>
            </Navbar>
            <div className="mx_chart">
                <div className="mx_chart_background">
                    <div className="mx_chart_table">
                    {
                        tableState.map((value, index) => {
                            return (
                                <div 
                                    key={index}
                                    className="mx_chart_table_value"
                                    style={{ height: `calc(100% - (${value}px * 4))` }}
                                    ref={el => indexRef.current[index] = el}
                                >
                                    
                                </div>
                            )
                        })
                    }
                    </div>
                </div>
            </div>
        </div>
    )
}

function getInitialValues(count: number): number[] {
    const ret = [];

    for (let i = 0; i < count; i++) {
        ret.push(Math.floor(Math.random() * 100));
    }

    return ret;
}