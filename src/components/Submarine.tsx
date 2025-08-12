import { useEffect, useState } from "react";
import styles from "@/styles/Submarine.module.css";
import { SubmarineType } from "@/types";
import Image from "next/image";

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

    const handleOnPointerDown = (event: React.PointerEvent) => {
        setIsDragging(true);
        const target = event.target as HTMLDivElement;
        const sub = target.closest(".submarine") as HTMLDivElement;
        const squareSection = target.closest(".squareSection") as HTMLDivElement;
        const shiftX = event.pageX - sub.offsetLeft;
        const shiftY = event.pageY - sub.offsetTop;
        const dragSectionIndex = Number(squareSection.dataset.index);

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

    const left = boardPos ? (boardPos.x + 1) * tileSize : dragPos?.x || 0;
    const top = boardPos ? (boardPos.y + 1) * tileSize : dragPos?.y || 0;

    const subStyle = {
        left,
        top,
        display: "flex",
        flexDirection,
        pointerEvents,
    };
    const imageStyle = {
        position: "absolute" as const,
        pointerEvents: "none" as const,
        transformOrigin: `${tileSize/2}px center`,
        rotate: !horizontal ? "90deg" :"none",
    };

    return (
        <div
            onPointerDown={handleOnPointerDown}
            style={subStyle}
            className={`${styles.submarine} submarine`}
        >
            {Array.from({ length: subSize }, (_, i) => i + 1).map((_, i) => (
                <div
                    className="squareSection"
                    key={i}
                    data-index={i}
                    style={{ backgroundImage: "/public/images/boat2x1.png" }}
                >
                    <div
                        className={styles.submarineSection}
                        style={{ height: tileSize, width: tileSize }}
                    ></div>
                </div>
            ))}
            <Image
                style={imageStyle}
                src={require(`/public/images/boat${subSize}x1.png`)}
                width={tileSize * subSize}
                height={tileSize}
                alt={"Boat"}
            />
        </div>
    );
};

export { Submarine };
