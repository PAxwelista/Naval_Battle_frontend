import { Board } from "@/components";
import { Shoot } from "@/components/Shoot";


import { Grid, Pos } from "@/types";
import { createEmptyGrid } from "@/utils";
import { SetStateAction, useState } from "react";

export const FirePageDev = () => {
    const [triggerShoot, setTriggerShoot] = useState<boolean>(false);
    const [shootPos, setShootPos] = useState<{ x: number; y: number }>({ x: 100, y: 100 });
    const [grid, setGrid] = useState<Grid>(createEmptyGrid("-", 8));

    const handleOnClick = (event: React.MouseEvent) => {
        setShootPos({ x: event.clientX, y: event.clientY });

        setTriggerShoot(value => !value);
    };

    const handleOnClickGrid = async (pos: Pos): Promise<void> => {
        setTimeout(
            () => setGrid(prev => prev.map((line, i) => line.map((v, j) => (pos.x === j && pos.y === i ? "X" : v)))),
            1000
        );
    };

    return (
        <button
            style={{ display: "flex", height: "100vh", width: "100vw", backgroundColor: "white" }}
            onClick={handleOnClick}
        >
            <span>Fire page Dev</span>
            <p>Cliquez sur la page pour tirer</p>
            <Shoot
                triggerShoot={triggerShoot}
                pos={shootPos}
                time={1}
            />
            <Board
                subDragInfos={null}
                grid={grid}
                setGrid={function (value: SetStateAction<Grid>): void {
                    throw new Error("Function not implemented.");
                }}
                onClick={handleOnClickGrid}
            />
        </button>
    );
    shootPos;
};
