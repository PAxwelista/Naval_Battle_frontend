import { FireState } from "@/enum";
import { Pos } from "./pos";

export type BoardTileType = {
    shipPassing: boolean;
    pos: Pos;
    onDragEnter: (pos: Pos) => void;
    onDrop: (pos: Pos, event: React.MouseEvent) => void;
    onDragLeave: () => void;
    canDragAndDrop: boolean;
    onClick: Function;
    fireState: FireState;
    tileSize: number;
};
