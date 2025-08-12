import styles from "@/styles/Board.module.css";
import { BoardTile } from "./BoardTile";
import { BoardType, Grid, Pos, SubDragInfosType, SubmarineType } from "@/types";
import {
    canFitInTile,
    changeGrid,
    replaceValuesOnGrid,
    subDragInfosToPositions,
    tranformInitSubPosToSubmarines,
} from "@/utils";
import { FireState } from "@/enum";
import { Submarine } from "./Submarine";
import { useEffect, useState } from "react";
import { initialSubmarines } from "@/data";

const columnTitle = [1, 2, 3, 4, 5, 6, 7, 8];
const lineTitle = ["A", "B", "C", "D", "E", "F", "G", "H"];
const TILE_SIZE = 40;

export const Board = ({
    subDragInfos,
    onClick,
    grid,
    setGrid,
    setSubDragInfos,
    rotateSubSwitch,
    dragPos,
    isGameStart,
}: BoardType) => {
    const [submarines, setSubmarines] = useState<SubmarineType[] | undefined>(
        dragPos ? tranformInitSubPosToSubmarines(initialSubmarines, TILE_SIZE, handleDragStart) : undefined
    );
    const [dragHoverBoardPos, setDragHoverBoardPos] = useState<Pos | undefined>();

    useEffect(() => {
        rotateSub();
    }, [rotateSubSwitch]);

    useEffect(() => {
        subDragInfos && dragPos && changeDragPos(subDragInfos.index, dragPos.x, dragPos.y);
    }, [dragPos]);

    function handleDragStart(dragInfos: SubDragInfosType) {
        !isGameStart && setSubDragInfos && setSubDragInfos(dragInfos);
    }

    const changeBoardPos = (SubIndex: number, x: number, y: number) => {
        setSubmarines(submarines =>
            submarines?.map((v, i) => (i != SubIndex ? v : { ...v, boardPos: { x, y }, dragPos: undefined }))
        );
    };
    const changeDragPos = (SubIndex: number, x: number, y: number) => {
        setSubmarines(submarines =>
            submarines?.map((v, i) => (i != SubIndex ? v : { ...v, dragPos: { x, y }, boardPos: undefined }))
        );
    };

    const rotateSub = () => {
        if (!subDragInfos || !setSubDragInfos) return;
        const OffetX = subDragInfos.dragSectionIndex * 50 * (subDragInfos.horizontal ? 1 : -1);
        const OffetY = subDragInfos.dragSectionIndex * 50 * (subDragInfos.horizontal ? -1 : 1);
        setSubmarines(subs =>
            subs?.map(sub =>
                sub.index === subDragInfos.index
                    ? {
                          ...sub,
                          horizontal: !sub.horizontal,
                          dragPos: {
                              x: (sub.dragPos?.x || 0) + OffetX,
                              y: (sub.dragPos?.y || 0) + OffetY,
                          },
                      }
                    : sub
            )
        );

        setSubDragInfos(prev => ({
            ...prev,
            horizontal: !prev.horizontal,
            shiftX: prev.shiftX - OffetX,
            shiftY: prev.shiftY - OffetY,
        }));
        removeAllPInGrid();

        dragHoverBoardPos &&
            canFitInTile(
                grid,
                dragHoverBoardPos,
                !subDragInfos.horizontal,
                subDragInfos.subSize,
                subDragInfos.dragSectionIndex,
                subDragInfos.index
            ) &&
            changeBoard(
                subDragInfosToPositions(
                    !subDragInfos.horizontal,
                    dragHoverBoardPos,
                    subDragInfos.subSize,
                    subDragInfos.dragSectionIndex
                ),
                "P"
            );
    };

    const changeBoard = (positions: Pos[], newValue: string) => {
        setGrid(prevGrid => changeGrid(prevGrid, positions, newValue));
    };

    const removeOldSubPos = (index: string) => {
        setGrid(prevGrid => replaceValuesOnGrid(prevGrid, index, "-"));
    };

    const removeAllPInGrid = (): void => {
        setGrid(prevGrid => replaceValuesOnGrid(prevGrid, "P", "-"));
    };

    const onDragEnter = (pos: Pos) => {
        setDragHoverBoardPos(pos);
        subDragInfos &&
            canFitInTile(
                grid,
                pos,
                subDragInfos.horizontal,
                subDragInfos.subSize,
                subDragInfos.dragSectionIndex,
                subDragInfos.index
            ) &&
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
        setDragHoverBoardPos(undefined);
        removeAllPInGrid();
    };

    const onDrop = (pos: Pos) => {
        if (
            subDragInfos &&
            changeBoardPos &&
            canFitInTile(
                grid,
                pos,
                subDragInfos.horizontal,
                subDragInfos.subSize,
                subDragInfos.dragSectionIndex,
                subDragInfos.index
            )
        ) {
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
        onClick && onClick(pos);
    };

    const Submarines = submarines?.map((submarine, i) => (
        <Submarine
            key={i}
            {...submarine}
            tileSize={TILE_SIZE}
        />
    ));

    const line = (firstLetter: string, i: number) => {
        return (
            <div
                key={firstLetter}
                className={styles.othersLines}
            >
                <div
                    className={styles.case}
                    style={{ height: TILE_SIZE, width: TILE_SIZE }}
                >
                    {firstLetter}
                </div>{" "}
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
                        tileSize={TILE_SIZE}
                    />
                ))}
            </div>
        );
    };
    return (
        <div className={styles.boardGame}>
            {Submarines}
            <div className={styles.firstLine}>
                <div
                    className={styles.case}
                    style={{ height: TILE_SIZE, width: TILE_SIZE }}
                ></div>
                {columnTitle.map(v => (
                    <div
                        key={v}
                        className={styles.case}
                        style={{ height: TILE_SIZE, width: TILE_SIZE }}
                    >
                        {v}
                    </div>
                ))}
            </div>
            {lineTitle.map((v, i) => line(v, i))}
        </div>
    );
};
