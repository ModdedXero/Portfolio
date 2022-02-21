import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

import "../../styles/navbar.css";

export function Navbar({ children, zIndex=1000, top=0 }) {
    const [sticky, setSticky] = useState();
    const navRef = useRef(null);

    useEffect(() => {
        setSticky(top || navRef.current.getBoundingClientRect().top);
    }, [])

    return (
        <nav ref={navRef} className="mx_navbar" style={{ 
            zIndex: zIndex, top: sticky
        }}>
            <div className="mx_navbar_container">
                {children}
            </div>
        </nav>
    )
}

export function NavGroup({ children, align=null }) {
    let className;

    switch (align) {
        case "right":
            className = "mx_navbar_group_right";
            break;
        case "center":
            className = "mx_navbar_group_center";
            break;
        default:
            className = "mx_navbar_group";
    }

    return (
        <div className={className}>
            {children}
        </div>
    )
}

export function NavTitle({ children }) {
    return (
        <h1 className="mx_navbar_title">
            {children}
        </h1>
    )
}

export function NavButton({ children, ...props }) {
    return (
        <button className="mx_navbar_button" {...props}>
            {children}
        </button>
    )
}

export function NavDropdown({ label, children }) {
    const [clickState, setClickState] = useState(false);

    return (
        <div className={clickState ? "mx_navbar_dropdown_active" : "mx_navbar_dropdown"}>
            <button onClick={_ => setClickState(!clickState)}>
                {label} {!clickState ? <i className="fa-solid fa-angle-down" /> : <i className="fa-solid fa-angle-up" />}
            </button>
            <div onClick={_ => setClickState(!clickState)}>
                {children}
            </div>
        </div>
    )
}

export function NavLink({ href="", children, onClick=null, disabled=false, ...props}) {
    return (
        <div key={disabled + `${Math.random()}`} className="mx_navbar_link" onClick={_ => disabled ? null : onClick()} {...props}>
            <Link to={href ? href : ""}>{children}</Link>
        </div>
    )
}