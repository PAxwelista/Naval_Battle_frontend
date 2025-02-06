import { useState } from "react";
import styles from "../src/styles/Submarine.module.css";

type submarineProps = {
    posX: number;
    posY: number;
    size: number;
    handleDragStart: Function;
    index: number;
    horizontal :boolean
};

export default function Submarine({ posX, posY, size, handleDragStart, index ,horizontal}: submarineProps) {
    const [isDragging, setIsDragging] = useState(false);
    const getSubInfos = (subWidth: number, subHeigth: number, posClickX: number, posClickY: number) => {
        const horizontal = subWidth > subHeigth;
        const pos = Math.floor(horizontal ? posClickX / (subWidth / size) : posClickY / (subHeigth / size));
        return { horizontal, pos, size, index };
    };

    const onDragStart = (event: React.DragEvent) => {
        setIsDragging(true);
        const target = event.target as HTMLTextAreaElement;

        handleDragStart(
            getSubInfos(
                target.clientWidth,
                target.clientHeight,
                event.pageX - target.offsetLeft,
                event.pageY - target.offsetTop
            )
        );
    };

    const subStyle = { left: posX, top: posY, display: "flex", flexDirection: horizontal?"column" as "column":"row" as "row" }

    return (
        <div
        tabIndex={0}
            style={subStyle}
            className={styles.submarine}
            draggable
            onDragStart={onDragStart}
            onDragEnd={() => setIsDragging(false)}
            onKeyDown={() => console.log("keydowbn")}
            onAuxClick={()=>console.log("click")}

        >
            {Array.from({ length: size }, (_, i) => i + 1).map((_, i) => (
                <div
                    key={i}
                    className={styles.submarineSection}
                ></div>
            ))}
        </div>
    );
}
