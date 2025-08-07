export type SubDragInfosType = {
    horizontal: boolean;
    dragSectionIndex: number;
    size: number;
    index: number;
    shiftX: number;
    shiftY: number;
};

export type SubmarineHandleDragStartType = {
    ({ horizontal, dragSectionIndex, size, index, shiftX, shiftY }: SubDragInfosType): void;
};

export type SubmarineType = {
    posX: number;
    posY: number;
    size: number;
    handleDragStart: SubmarineHandleDragStartType;
    index: number;
    horizontal: boolean;
};

export type initialSubmarineType = { posX: number; posY: number; size: number; index: number; horizontal: boolean };
