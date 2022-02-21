import ReactDOM from "react-dom";
import { Children, useState } from "react";

import "../../styles/modal.css";

export default function Modal(): JSX.Element {
    return null;
}

export function ModalList({ visible=true, onClose=null, children }): JSX.Element {
    const [childIndex, setChildIndex] = useState(0);
    const childArray = Children.toArray(children);
    const [isVisible, setIsVisible] = useState(visible);

    function close() {
        setIsVisible(false);
        if (onClose) onClose(false);
    }

    if (!isVisible || childArray.length === 0) return null;
    return ReactDOM.createPortal(
        <div className="mx_modal">
            <div className="mx_modal_container">
                <button onClick={close} className="mx_modal_close">X</button>
                <div className="mx_modal_content">
                {
                    childArray.map((child, index) => {
                        if (index === childIndex) return child;
                        else return null;
                    })
                }
                    <div className="mx_modal_content_scroll">
                        <button 
                            className="mx_modal_scroll_left"
                            onClick={_ => {
                                if (childIndex === 0)
                                    setChildIndex(childArray.length - 1);
                                else setChildIndex(childIndex - 1);
                            }}
                        >
                            {"<"}
                        </button>
                        <button 
                            className="mx_modal_scroll_right"
                            onClick={_ => {
                                if (childIndex === childArray.length - 1)
                                    setChildIndex(0);
                                else setChildIndex(childIndex + 1);
                            }}
                        >
                            {">"}
                        </button>
                    </div>
                </div>
            </div>
        </div>,
    document.getElementById("modalPortal"));
}

export function ModalItem({ children }): JSX.Element {
    return (
        <div className="mx_modal_item">
            {children}
        </div>
    );
}