import { useState } from "react";
import styles from "../src/styles/PlayBoard.module.css";
import BoardCase from "./BoardCase";

const columnTitle = [1, 2, 3, 4, 5, 6, 7, 8];
const lineTitle = ["A", "B", "C", "D", "E", "F", "G", "H"];

type playboardProps = {
    subDragInfos: { horizontal: boolean; pos: number; size: number; index: number };
    moveSub: Function;
};

export default function PlayBoard({ subDragInfos, moveSub }: playboardProps) {
    const [shipsPos, setShipsPos] = useState(columnTitle.map(column => lineTitle.map(line => "-")));
    // initialise un tableau deux entrée avec des 0 correspondant au jeu,
    // un chiffre qui correspond au numéro du tableau pour un vaisseau placé et P pour le passage de la souris

    const canFitInCase = (x: number, y: number) => {
        if (subDragInfos.horizontal) {
            if (x + (subDragInfos.size - subDragInfos.pos) > columnTitle.length) return false;
        } else {
            if (y + (subDragInfos.size - subDragInfos.pos) > lineTitle.length) return false;
        }
        if (
            newPositionsTab({ x, y }, subDragInfos.horizontal, subDragInfos.size, subDragInfos.pos).some(pos => {
                const valueInLine = shipsPos[pos.y];
                if (valueInLine === undefined) return true;
                const valueInCase = valueInLine[pos.x];
                return valueInCase != "-" && valueInCase != "P" && valueInCase != subDragInfos.index.toString();
            })
        )
            return false;
        return true;
    };

    const changeBoard = (positions: { x: number; y: number }[], newValue: string) => {
        setShipsPos(shipsPos =>
            shipsPos.map((shipPosLine, i) =>
                shipPosLine.map((val, j) => (positions.some(pos => i === pos.y && j === pos.x) ? newValue : val))
            )
        );
    };
    const removeOldSubPos = (index: number) => {
        setShipsPos(shipsPos =>
            shipsPos.map(shipPosLine => shipPosLine.map(val => (Number(val) === index ? "-" : val)))
        );
    };

    const newPositionsTab = (pos: { x: number; y: number }, horizontal: boolean, size: number, dragPos: number) =>
        Array.from({ length: size }, (_, i) => i).map(nb => {
            return horizontal ? { x: pos.x + nb - dragPos, y: pos.y } : { x: pos.x, y: pos.y + nb - dragPos };
        });

    const onDragEnter = (pos: { x: number; y: number }) => {
        canFitInCase(pos.x, pos.y) &&
            changeBoard(newPositionsTab(pos, subDragInfos.horizontal, subDragInfos.size, subDragInfos.pos), "P");
    };
    const onDragLeave = (pos: { x: number; y: number }) => {
        setShipsPos(shipspos => shipspos.map(line => line.map(boardCase => (boardCase === "P" ? "-" : boardCase))));
    };
    const onDrop = (pos: { x: number; y: number }, event: MouseEvent) => {
        if (!canFitInCase(pos.x, pos.y)) return;

        const target = event.target as HTMLTextAreaElement;
        removeOldSubPos(subDragInfos.index);
        changeBoard(
            newPositionsTab(pos, subDragInfos.horizontal, subDragInfos.size, subDragInfos.pos),
            subDragInfos.index.toString()
        );
        moveSub(
            subDragInfos.index,
            subDragInfos.horizontal ? target.offsetLeft - target.offsetWidth * subDragInfos.pos : target.offsetLeft,
            subDragInfos.horizontal ? target.offsetTop : target.offsetTop - target.offsetHeight * subDragInfos.pos
        );
    };

    const line = (firstLetter: string, i: number) => {
        return (
            <div
                key={firstLetter}
                className={styles.othersLines}
            >
                <div className={styles.case}>{firstLetter}</div>{" "}
                {columnTitle.map((_, j) => (
                    <BoardCase
                        key={i.toString() + " " + j.toString()}
                        shipPassing={shipsPos[i][j] === "P"}
                        ship={Number(shipsPos[i][j]) >= 0}
                        pos={{ x: j, y: i }}
                        onDragEnter={onDragEnter}
                        onDrop={onDrop}
                        onDragLeave={onDragLeave}
                        subDragInfos={subDragInfos}
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
}
