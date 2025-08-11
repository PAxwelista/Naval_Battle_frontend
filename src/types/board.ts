import { Grid } from "./grid";
import { SubDragInfosType, SubmarineType } from "./submarine";

export type BoardType = {
    subDragInfos: SubDragInfosType | null;
    changeBoardPos?: (SubIndex: number, x: number, y: number) => void;
    onClick: Function;
    grid: Grid;
    setGrid: React.Dispatch<React.SetStateAction<Grid>>
    submarines?:SubmarineType[]
};
