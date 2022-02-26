import "../../styles/snake.css";

export interface NodeProps {
    state: number,
}

export default function Node(props: NodeProps) {
    let backgroundColor: string;

    switch (props.state) {
        case 0:
            backgroundColor = "var(--mx-node-empty)";
            break;
        case 1:
            backgroundColor = "var(--mx-node-food)";
            break;
        case 2:
            backgroundColor = "#dd9a35";
            break;
        case 3:
            backgroundColor = "#99c24d" 
            break;
        default:
            backgroundColor = "var(--mx-node-empty)";
    }

    return (
        <div className="mx_snake_node" style={{ backgroundColor }}>
            
        </div>
    )
}