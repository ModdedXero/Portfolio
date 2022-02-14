export default interface NodeVar {
    row: number,
    col: number,
    size: number,
    isStart: Boolean,
    isFinal: Boolean,
    isVisited: Boolean,
    isWall: Boolean,
    isWeight: Boolean,
    parent: NodeVar,
    children: NodeVar[],
    f: number,
    g: number,
    h: number
}