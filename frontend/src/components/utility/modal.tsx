import ReactDOM from "react-dom";
import { Children, useState } from "react";

import "../styles/modal.css";

export default function Modal(): JSX.Element {
    return null;
}

export function ModalList({ children }): JSX.Element {
    const [childIndex, setChildIndex] = useState();
    const childArray = Children.toArray(children);

    return null;
}

export function ModalItem(): JSX.Element {
    return null;
}