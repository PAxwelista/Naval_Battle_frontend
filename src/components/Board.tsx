import styles from "@/styles/Board.module.css";
import { BoardTile } from "./BoardTile";
import { BoardType, Pos } from "@/types";
import { changeGrid, gridIncludesValuesInPositions, replaceValuesOnGrid, subDragInfosToPositions } from "@/utils";
import { FireState } from "@/enum";
import { Submarine } from "./Submarine";

const columnTitle = [1, 2, 3, 4, 5, 6, 7, 8];
const lineTitle = ["A", "B", "C", "D", "E", "F", "G", "H"];

export const Board = ({ submarines, subDragInfos, changeBoardPos, onClick, grid, setGrid }: BoardType) => {
    const canFitInTile = (pos: Pos) => {
        
        if (subDragInfos) {
            const positions = subDragInfosToPositions(
                subDragInfos.horizontal,
                pos,
                subDragInfos.subSize,
                subDragInfos.dragSectionIndex
            );
            return gridIncludesValuesInPositions(grid, positions, ["-", "P", subDragInfos.index.toString()]);
        }
    };

    const changeBoard = (positions: Pos[], newValue: string) => {
        setGrid(prevGrid => changeGrid(prevGrid, positions, newValue));
    };

    const removeOldSubPos = (index: string) => {
        setGrid(prevGrid => replaceValuesOnGrid(prevGrid, index, "-"));
    };

    const onDragEnter = (pos: Pos) => {
        canFitInTile(pos) &&
            subDragInfos &&
            changeBoard(
                subDragInfosToPositions(
                    subDragInfos.horizontal,
                    pos,
                    subDragInfos.subSize,
                    subDragInfos.dragSectionIndex
                ),
                "P"
            );
    };

    const onDragLeave = () => {
        setGrid(prevGrid => prevGrid.map(line => line.map(boardCase => (boardCase === "P" ? "-" : boardCase))));
    };

    const onDrop = (pos: Pos, event: React.MouseEvent) => {
        if (subDragInfos && changeBoardPos && canFitInTile(pos)) {
            removeOldSubPos(subDragInfos.index.toString());

            changeBoard(
                subDragInfosToPositions(
                    subDragInfos.horizontal,
                    pos,
                    subDragInfos.subSize,
                    subDragInfos.dragSectionIndex
                ),
                subDragInfos.index.toString()
            );
            changeBoardPos(
                subDragInfos.index,
                subDragInfos.horizontal ? pos.x - subDragInfos.dragSectionIndex : pos.x,
                subDragInfos.horizontal ? pos.y : pos.y - subDragInfos.dragSectionIndex
            );
        }
    };

    const handleClick = (pos: Pos) => {
        onClick(pos);
    };

    const Submarines = submarines?.map((submarine, i) => (
        <Submarine
            key={i}
            {...submarine}
        />
    ));

    const line = (firstLetter: string, i: number) => {
        return (
            <div
                key={firstLetter}
                className={styles.othersLines}
            >
                <div className={styles.case}>{firstLetter}</div>{" "}
                {columnTitle.map((_, j) => (
                    <BoardTile
                        key={i.toString() + " " + j.toString()}
                        shipPassing={grid[i][j] === "P"}
                        fireState={
                            grid[i][j] === "X"
                                ? FireState.missFire
                                : grid[i][j] === "F"
                                ? FireState.successFire
                                : FireState.notFire
                        }
                        pos={{ x: j, y: i }}
                        onDragEnter={onDragEnter}
                        onDrop={onDrop}
                        onDragLeave={onDragLeave}
                        canDragAndDrop={!!(subDragInfos && subDragInfos.index >= 0)}
                        onClick={handleClick}
                    />
                ))}
            </div>
        );
    };
    return (
        <div className={styles.boardGame}>
            {Submarines}
            <div className={styles.firstLine}>
                <div className={styles.case}></div>
                {columnTitle.map(v => (
                    <div
                        key={v}
                        className={styles.case}
                    >
                        {v}
                    </div>
                ))}
            </div>
            {lineTitle.map((v, i) => line(v, i))}
        </div>
    );
};
