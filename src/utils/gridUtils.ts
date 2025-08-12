import { Grid, initialSubType, Pos, SubmarineHandleDragStartType, SubmarineType } from "@/types";

export const createEmptyGrid = (value: string, size: number): Grid => {
    return Array.from({ length: size }, () => Array.from({ length: size }, () => value));
};

export const changeGrid = (grid: Grid, positions: Pos[], newValue: string): Grid => {
    return grid.map((gridLine, i) =>
        gridLine.map((val, j) => (positions.some(pos => i === pos.y && j === pos.x) ? newValue : val))
    );
};

export const replaceValuesOnGrid = (grid: Grid, value: string, newValue: string): Grid => {
    return grid.map(gridLine => gridLine.map(v => (v === value ? newValue : v)));
};

export const gridIncludesValuesInPositions = (grid: Grid, positions: Pos[], values: string[]): boolean => {
    return positions.every(pos => values.includes(grid[pos.y]?.[pos.x]));
};

export const subDragInfosToPositions = (horizontal: boolean, pos: Pos, size: number, indexDrag: number): Pos[] => {
    if (indexDrag + 1 > size || indexDrag < 0 || size < 0) return [];

    const positions = Array.from({ length: size }, (v, i) => ({
        x: pos.x + (horizontal ? i - indexDrag : 0),
        y: pos.y + (horizontal ? 0 : i - indexDrag),
    }));

    return positions;
};

export const tranformInitSubPosToSubmarines = (
    initialSubmarines: initialSubType[],
    tileSize: number,
    handleDragStart: SubmarineHandleDragStartType
): SubmarineType[] => {
    return initialSubmarines.map((v, i) => ({
        ...v,
        dragPos: v.pos,
        tileSize,
        boardPos: undefined,
        index: i,
        handleDragStart,
    }));
};

export const canFitInTile = (grid:Grid,pos: Pos, isHorizontal: boolean, size: number, dragSectionIndex: number,subIndex:number): boolean => {
    if (size<=0 || dragSectionIndex>=size) return false
    const positions = subDragInfosToPositions(
        isHorizontal,
        pos,
        size,
        dragSectionIndex
    );
    return gridIncludesValuesInPositions(grid, positions, ["-", "P", subIndex.toString()]);
};

