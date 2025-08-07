import { useEffect, useState } from "react";
import styles from "@/styles/Submarine.module.css";
import { SubmarineType } from "@/types";



const Submarine = ({ posX, posY, size, handleDragStart, index, horizontal }: SubmarineType) => {
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
        const target = event.target as HTMLTextAreaElement;
        const shiftX = event.pageX - target.offsetLeft;
        const shiftY = event.clientY - target.offsetTop;
        const dragSectionIndex = Math.floor(
            horizontal ? shiftX / (target.offsetWidth / size) : shiftY / (target.offsetHeight / size)
        );
        //On teste d'abord si il a un element parent (le cas ou on clique en dehors des ronds rouge si c'est null)
        //on prend l'élément direct
        handleDragStart({
            horizontal,
            dragSectionIndex,
            size,
            index,
            shiftX,
            shiftY,
        });
    };
    const onEndDrag = () => {
        setIsDragging(false);
        handleDragStart({ horizontal, dragSectionIndex: 2, size, index: -1, shiftX: -1, shiftY: -1 });
    };

    const direction: "row" | "column" = horizontal ? "row" : "column";
    const events: "none" | "auto" = isDragging ? "none" : "auto";

    const subStyle = {
        left: posX,
        top: posY,
        display: "flex",
        flexDirection: direction,
        pointerEvents: events,
    };

    return (
        <div
            onMouseDown={handleOnStartDrag}
            style={subStyle}
            className={styles.submarine}
        >
            {Array.from({ length: size }, (_, i) => i + 1).map((_, i) => (
                <div
                    onMouseDown={() => false}
                    key={i}
                    className={styles.submarineSection}
                    style={{ pointerEvents: "none" }} // permet de ne sélectionner que le parent
                ></div>
            ))}
        </div>
    );
};

export { Submarine };

// const getSubInfos = (subWidth: number, subHeigth: number, posClickX: number, posClickY: number) => {
//     const horizontal = subWidth > subHeigth;
//     const pos = Math.floor(horizontal ? posClickX / (subWidth / size) : posClickY / (subHeigth / size));
//     return { horizontal, pos, size, index };
// };
