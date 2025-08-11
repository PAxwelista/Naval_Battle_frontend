import { Grid } from "./grid";
import { Pos } from "./pos";
import { SubDragInfosType, SubmarineType } from "./submarine";

export type BoardType = {
    subDragInfos: SubDragInfosType | null;
    changeBoardPos?: (SubIndex: number, x: number, y: number) => void;
    onClick?: (pos: Pos) => Promise<void>;
    grid: Grid;
    setGrid: React.Dispatch<React.SetStateAction<Grid>>;
    submarines?: SubmarineType[];
    rotateSubSwitch?: boolean;
    setSubDragInfos?: React.Dispatch<React.SetStateAction<SubDragInfosType>>;
    dragPos?: Pos;
    isGameStart?: boolean;
};
