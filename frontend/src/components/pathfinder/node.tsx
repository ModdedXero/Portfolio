import "../../styles/pathfinder.css";

interface NodeProps {
    size: number;
    row: number;
    col: number;
    state: number;
    f: number;
    h: number;
    g: number;
    onMouseDown(row: number, col: number): void;
    onMouseUp(row: number, col: number): void;
    onMouseEnter(row: number, col: number): void;
}

export default function Node(props: NodeProps): JSX.Element {
    let extraClass: string;
    switch(props.state) {
        case 1:
            extraClass = "mx_node_start";
            break;
        case 2:
            extraClass = "mx_node_final";
            break;
        case 3:
            extraClass =  "mx_node_wall";
            break;
        case 4:
            extraClass = "mx_node_weight";
            break;
        default:
            extraClass = "";
    }

    // TODO: Add debug mode to show f value
    return (
        <div
            id={`node-${props.row}-${props.col}`}
            className={"mx_node" + " " + extraClass}
            style={{
                width: `${props.size}px`,
                height: `${props.size}px`,
            }}
            onMouseDown={_ => props.onMouseDown(props.row, props.col)}
            onMouseUp={_ => props.onMouseUp(props.row, props.col)}
            onMouseEnter={_ => props.onMouseEnter(props.row, props.col)}
        >
            
        </div>
    )
}