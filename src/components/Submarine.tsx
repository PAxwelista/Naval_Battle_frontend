import { useEffect, useState } from "react";
import styles from "@/styles/Submarine.module.css";
import { SubmarineType } from "@/types";

const Submarine = ({ boardPos, dragPos, tileSize, subSize, handleDragStart, index, horizontal }: SubmarineType) => {
    const [isDragging, setIsDragging] = useState<boolean>(false);

    useEffect(() => {
        //ce useEffect est utilisé car il est compliqué de gérer le passage de la souris sur les cases du jeux
        //en même temps que le drag'n'drop improvisé
        if (isDragging) {
            window.addEventListener("mouseup", onEndDrag);
        } else {
            window.removeEventListener("mouseup", onEndDrag);
        }
        return () => window.removeEventListener("mouseup", onEndDrag);
    }, [isDragging]);

    const handleOnStartDrag = (event: React.MouseEvent) => {
        setIsDragging(true);
        const target = event.target as HTMLDivElement;
        const sub = target.parentElement as HTMLDivElement;
        const shiftX = event.pageX - sub.offsetLeft;
        const shiftY = event.pageY - sub.offsetTop;
        const dragSectionIndex = Number(target.dataset.index);
        handleDragStart({
            horizontal,
            dragSectionIndex,
            subSize,
            index,
            shiftX,
            shiftY,
        });
    };
    const onEndDrag = () => {
        setIsDragging(false);
        handleDragStart({ horizontal, dragSectionIndex: 2, subSize, index: -1, shiftX: -1, shiftY: -1 });
    };

    const flexDirection: "row" | "column" = horizontal ? "row" : "column";
    const pointerEvents: "none" | "auto" = isDragging ? "none" : "auto";

    const left = boardPos ? (boardPos.x + 1) * tileSize : dragPos?.x;
    const top = boardPos ? (boardPos.y + 1) * tileSize : dragPos?.y;

    const subStyle = {
        left,
        top,
        display: "flex",
        flexDirection,
        pointerEvents,
    };

    return (
        <div
            onMouseDown={handleOnStartDrag}
            style={subStyle}
            className={styles.submarine}
        >
            {Array.from({ length: subSize }, (_, i) => i + 1).map((_, i) => (
                <div
                    onMouseDown={() => false}
                    key={i}
                    data-index={i}
                    className={styles.submarineSection}
                    style={{  height: tileSize, width: tileSize }}
                ></div>
            ))}
        </div>
    );
};

export { Submarine };
