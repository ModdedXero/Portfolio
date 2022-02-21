import ReactDOM from "react-dom";

import "../styles/modal.css";

export default function Modal({ open, zIndex=1000, onClose, children }) {
    if (!open) return null;

    return  ReactDOM.createPortal(
        <div className="mx_modal" style={{ zIndex }} onContextMenu={e => e.stopPropagation()}>
            <div className="mx_modal_content">
                <button onClick={_ => onClose(false)}>X</button>
                {children}
            </div>
        </div>,
        document.getElementById("modalPortal")
    )
}