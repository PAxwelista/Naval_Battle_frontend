import { useState } from "react";
import styles from "@/styles/PlayBoard.module.css";
import { BoardTile } from "./BoardTile";
import { BoardGameType, Grid, Pos } from "@/types";
import {
    changeGrid,
    createEmptyGrid,
    gridIncludesValuesInPositions,
    replaceValuesOnGrid,
    subDragInfosToPositions,
} from "@/utils";

const columnTitle = [1, 2, 3, 4, 5, 6, 7, 8];
const lineTitle = ["A", "B", "C", "D", "E", "F", "G", "H"];

const BoardGame = ({ subDragInfos, moveSub, onClick }: BoardGameType) => {
    const [grid, setGrid] = useState<Grid>(createEmptyGrid("-", 8));
    // initialise un tableau deux entrée avec des - correspondant au jeu,
    // un chiffre qui correspond au numéro du tableau pour un vaisseau placé et P pour le passage d'un navire

    const canFitInTile = (pos: Pos) => {
        if (subDragInfos) {
            const positions = subDragInfosToPositions(
                subDragInfos.horizontal,
                pos,
                subDragInfos.size,
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
                subDragInfosToPositions(subDragInfos.horizontal, pos, subDragInfos.size, subDragInfos.dragSectionIndex),
                "P"
            );
    };

    const onDragLeave = () => {
        setGrid(prevGrid => prevGrid.map(line => line.map(boardCase => (boardCase === "P" ? "-" : boardCase))));
    };

    const onDrop = (pos: Pos, event: React.MouseEvent) => {
        if (subDragInfos && moveSub && canFitInTile(pos)) {
            const target = event.target as HTMLTextAreaElement;
            removeOldSubPos(subDragInfos.index.toString());
            changeBoard(
                subDragInfosToPositions(subDragInfos.horizontal, pos, subDragInfos.size, subDragInfos.dragSectionIndex),
                subDragInfos.index.toString()
            );
            moveSub(
                subDragInfos.index,
                subDragInfos.horizontal
                    ? target.offsetLeft - target.offsetWidth * subDragInfos.dragSectionIndex
                    : target.offsetLeft,
                subDragInfos.horizontal
                    ? target.offsetTop
                    : target.offsetTop - target.offsetHeight * subDragInfos.dragSectionIndex
            );
        }
    };

    const handleClick = (pos: Pos) => {
        onClick(pos);
    };

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

export { BoardGame };
