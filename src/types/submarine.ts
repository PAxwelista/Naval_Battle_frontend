import { Pos } from "./pos";

export type SubDragInfosType = {
    horizontal: boolean;
    dragSectionIndex: number;
    subSize: number;
    index: number;
    shiftX: number;
    shiftY: number;
};

export type SubmarineHandleDragStartType = {
    ({ horizontal, dragSectionIndex, subSize, index, shiftX, shiftY }: SubDragInfosType): void;
};

export type SimpleSubmarineType = {
    boardPos: Pos | undefined;
    dragPos: Pos | undefined;
    tileSize: number;
    subSize: number;
    index: number;
    horizontal: boolean;
};

export type SubmarineType = SimpleSubmarineType & {
    handleDragStart: SubmarineHandleDragStartType;
};

export type initialSubType = {
    pos: Pos;
    subSize: number;
    horizontal: boolean;
};
