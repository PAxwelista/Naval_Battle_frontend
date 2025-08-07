import { Grid, Pos } from "@/types";

const createEmptyGrid = (value: string, size: number): Grid => {
    return Array.from({ length: size }, () => Array.from({ length: size }, () => value));
};

const changeGrid = (grid: Grid, positions: Pos[], newValue: string): Grid => {
    return grid.map((gridLine, i) =>
        gridLine.map((val, j) => (positions.some(pos => i === pos.y && j === pos.x) ? newValue : val))
    );
};

const replaceValuesOnGrid = (grid: Grid, value: string, newValue: string): Grid => {
    return grid.map(gridLine => gridLine.map(v => (v === value ? newValue : v)));
};

const gridIncludesValuesInPositions = (grid: Grid, positions: Pos[], values: string[]): boolean => {
    return positions.every(pos => values.includes(grid[pos.y]?.[pos.x]));
};

const subDragInfosToPositions = (horizontal: boolean, pos: Pos, size: number, indexDrag: number): Pos[] => {
    if (indexDrag + 1 > size || indexDrag < 0 || size < 0) return [];

    const positions = Array.from({ length: size }, (v, i) => ({
        x: pos.x + (horizontal ? i - indexDrag : 0),
        y: pos.y + (horizontal ? 0 : i - indexDrag),
    }));

    return positions;
};

export { createEmptyGrid, changeGrid, replaceValuesOnGrid, gridIncludesValuesInPositions,subDragInfosToPositions };
