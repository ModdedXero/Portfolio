import "../../styles/slider.css";

export default function Slider({ label, reverse=false, ...props }) {
    return (
        <div className="mx_slider">
            <label>{label}</label>
            <input type="range" style={{ direction: reverse ? "rtl" : "ltr" }} {...props}/>
        </div>
    )
}