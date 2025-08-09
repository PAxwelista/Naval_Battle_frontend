import { Grid } from "./grid";
import { SubDragInfosType } from "./submarine";

export type BoardGameType = {
    subDragInfos: SubDragInfosType | null;
    moveSub: (SubIndex: number, x: number, y: number) => void;
    onClick: Function;
    grid: Grid;
    setGrid: React.Dispatch<React.SetStateAction<Grid>>
};
